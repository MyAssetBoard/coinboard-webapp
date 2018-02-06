$(document).ready(function() {
	var my_socket = io('http://localhost:3001')

	my_socket.on('connection', function () {
		console.log('ok co');
	});
	
});
