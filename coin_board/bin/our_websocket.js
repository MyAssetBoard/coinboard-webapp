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

io.on('error', socketError);

/** Ws connection event */
io.sockets.on('connection', function (socket) {
	socket.on('datainput', function (msg) {
		msg = msg.trim();
		console.log('datainput method ok');
	});
	socket.on('disconnect', function () {
		if (!socket.nickname) return;

		delete nicknames[socket.nickname];
		socket.broadcast.emit('announcement', socket.nickname + ' disconnected');
		socket.broadcast.emit('nicknames', nicknames);
		throw error;
	});
});


/** Ws socket error handling */
function socketError(error) {
	console.log('Socket thrown error : \n' + JSON.stringify(error));
	throw error;
}
