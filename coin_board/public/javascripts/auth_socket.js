$(document).ready(function() {
	var auth = io.connect('http://localhost:3001/auth');
	var register = io.connect('http://localhost:3001/register');
	var clickDiv = document.getElementById("click");
	$('#exampleModal').modal({ keyboard: false });

	function update_usr(data) {
		/** create new div */
		$('#dialogtext').text(' ');
		$.each(data, function (key, obj) {
			console.log(key, obj)
			if (data.errcode) {
				var newline = $('<li class="text-danger">');
			} else {
				var newline = $('<li class="text-primary">');
			}
			newline = newline.text(key + ' : ' + obj);
			newline.appendTo('#dialogtext');
		});
		$('#exampleModal').modal('toggle');
	}

	function sendname() {
		var inputDiv = document.getElementById("InputName");
		var InputName = inputDiv.value.trim();
		if (InputName.length > 2) {
			auth.emit('user login', {logname: InputName});
		}
	}

	function register_send() {
		var tosend = {};
		console.log('ok');
		$("[id^='Input']").each(function(){
			tosend[this.id] = this.value.trim();
		});
		console.log(tosend);
		register.emit('user signin', tosend);
	}

	auth.on('connection', function (socket) {
		console.log('succesfully connected to auth socket');
	});

	register.on('connection', function (socket) {
		console.log('succesfully connected to auth socket');
	});

	auth.on('my-message', function (data) {
		console.log(data);
		update_usr(data);
	});
	auth.on('error-message', function (data) {
		console.log(data.msg);
		update_usr(data);
	});
	register.on('my-message', function (data) {
		console.log(data);
	});
	register.on('error-message', function (data) {
		console.log(data.msg);
	});
	/** dom manip -send */
	clickDiv.addEventListener("click", register_send);
});
