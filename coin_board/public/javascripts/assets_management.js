/* global io:false */
$(document).ready(function() {
	var socket  = io.connect('http://localhost:3001');

	socket.on('connect', function () {
		console.log('ok co');
	});

	socket.on('error', function (e) {
		console.log('System', e ? e : 'A unknown error occurred');
	});
	$('#showMine').click(function() {
		$('#showCard').toggleClass('hidden');
	});
	$('#showAdd').click(function() {
		$('#addCard').toggleClass('hidden');
	});
});
