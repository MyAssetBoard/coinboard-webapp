$(document).ready(function() {
	var socket = io.connect('http://localhost:3001');

	socket.on('connect', function () {
		console.log('ok co');
	});

	socket.on('error', function (e) {
		message('System', e ? e : 'A unknown error occurred');
	});

	function message (msg) {
		console.log(msg);
	}
});
