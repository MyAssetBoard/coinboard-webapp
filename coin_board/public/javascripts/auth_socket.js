$(document).ready(function() {
	var auth = io.connect('http://localhost:3001/auth');

	auth.on('connection', function (socket) {
		console.log('succesfully connected to auth socket');
	});
	auth.on('my-message', function (data) {
		console.log(data.msg ? data.msg : data);
	});
	auth.on('error-message', function (data) {console.log(data.msg);});
	$('#click').click(function() {
		var InputName = $('#InputName').val().trim();
		if (InputName.length > 2) {
			console.log('click [' + InputName + '] ');
			auth.emit('user login', {logname: InputName});
		}
	})
});
