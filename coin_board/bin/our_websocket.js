/**
* @file Main runable executable for websocket micro service
* @author based on socket.io doc app and edited by Trevis Gulby
*/

/** PORT to connect to */
var port;
var io;
var connected = 0;
port = process.env.WSPORT || '3001';
io = require('socket.io')(port);

console.log('WEBSOCKET - Runnnig');
/** dep import */
const assetMod = require('../methods/assets_methods');
const authMod = require('../methods/auth_methods');

io
	.of('/auth')
	.on('connection', function (socket) {
		connected += 1;
		var log = socket.id.replace(/\/auth#/g, 'User : ');
		log += ' connected to [/auth] route \nconnected : ';
		log += connected;
		console.log(log);
		var usrtmp = 'welcome ' + socket.id.replace(/\/auth#/g, 'user ');
		var scktid = socket.id.replace(/\/auth#/g, '');
		var co_msg = {
			'msg' : usrtmp,
			'scktid' : scktid,
			'tot' : connected
		};
		io.of('/auth')
			.to(socket.id)
			.emit('my-message', co_msg);
		socket.on('user login', function (data) {
			var auth = new authMod();
			auth.checkcoData(data, socket, io);
		});
		socket.on('disconnect', function() { connected -= 1; });
	});

io
	.of('/register')
	.on('connection', function (socket) {
		var log = socket.id.replace(/\/register#/g, 'User : ');
		log += ' connected to [/register] route';
		console.log(log);
		var scktid = socket.id.replace(/\/register#/g, '');
		var co_msg = { 'scktid' : scktid };
		io.of('/register')
			.to(socket.id)
			.emit('my-message', co_msg);
		socket.on('user signin', function (data) {
			var auth = new authMod();
			console.log('received :');
			console.log(data);
			auth.checkRegData(data, socket, io);
		});
		socket.on('disconnect', function() { });
	});

io
	.of('/assets')
	.on('connection', function (socket) {
		var log = socket.id.replace(/\/register#/g, 'User : ');
		log += ' connected to [/assets] route';
		console.log(log);
		var asset = new assetMod();
		socket.on('add asset', function (data) {
			console.log(data);
			asset.checkAssetData(data, socket, io);
		});
		socket.on('disconnect', function() { });
	});
