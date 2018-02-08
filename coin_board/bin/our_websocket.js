/**
 * @file Main runable executable for websocket micro service
 * @author based on socket.io doc app and edited by Trevis Gulby
 */
var async = require('async');

/** PORT to connect to */
var port = process.env.WSPORT || '3001';
/** connected state boolean */
var connected = false;

/** Instantiate socket server */
var app = require('http').createServer().listen(port);

/** WebSocket via socketIO */
var io = require('socket.io').listen(app);
/** Data container */
var nicknames = {};
var cur_nick = null;

console.log('WEBSOCKET - coin_board micro service started\n');

io.on('error', socketError);

/** Ws connection event */
io.sockets.on('connection', function (socket) {
	console.log('one client connection');
	socket.on('datainput', function (msg) {
		msg = msg.trim();
		console.log('data input recived :[' + msg + ']');
	});
	socket.on('disconnect', function () {
		if (!socket.nickname) return;
		throw error;
	});
});


/** Ws socket error handling */
function socketError(error) {
	console.log('Socket thrown error : \n' + JSON.stringify(error));
	throw error;
}
