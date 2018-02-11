$(document).ready(function() {
	var auth = io.connect('http://localhost:3001/auth');
	var clickDiv = document.getElementById("click");
	$('#exampleModal').modal({
		keyboard: false
	})

	function update_usr(data) {
		/** create new div */
		$.each(data, function (key, obj) {
			console.log(key, obj)
			if (data.errcode) {
				var newline = $('<li class="text-danger">');
				$('#dialogtext').text(' ');
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

	auth.on('connection', function (socket) {
		console.log('succesfully connected to auth socket');
	});
	auth.on('my-message', function (data) {
		if (!data.msg) {
			console.log(data);
			update_usr(data);
		} else {
			console.log(data.msg);
			update_usr(data);
		}
	});
	auth.on('error-message', function (data) {
		console.log(data.msg);
		update_usr(data);
	});
	/** dom manip -send */
	clickDiv.addEventListener("click", sendname);
});
