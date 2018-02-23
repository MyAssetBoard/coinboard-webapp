/**
* @file Main runable executable for websocket micro service
* @author based on socket.io doc app and edited by Trevis Gulby
*/

/** PORT to connect to */
var port = process.env.WSPORT || '3001';
/** SOCKET serv startup */
var io = require('socket.io')(port);
/** NUMBER of connected sesion on each room */
var authco = 0,
	regco = 0,
	assetco = 0;

var log = 'WEBSOCKET - Runnnig';
process.env.NODE_ENV == 'development' ? console.log(log) : log;

/** dep import */
const assetMod = require('../methods/assets_methods');
const authMod = require('../methods/auth_methods');

io.of('/auth')
	.on('connection', function (socket) {
		var log;
		authco += 1;
		log = socket.id.replace(/\/auth#/g, 'User : ');
		log += ' connected to [/auth] route | Connected : ' + authco;
		process.env.NODE_ENV == 'development' ? console.log(log) : log;
		var usrtmp = 'welcome ' + socket.id.replace(/\/auth#/g, 'user ');
		var scktid = socket.id.replace(/\/auth#/g, '');
		var co_msg = {
			'msg' : usrtmp,
			'scktid' : scktid,
			'tot' : authco
		};
		io.of('/auth')
			.to(socket.id)
			.emit('my-message', co_msg);
		socket.on('user login', function (data) {
			var auth = new authMod();
			auth.checkcoData(data, socket, io);
		});
		socket.on('disconnect', function() { authco -= 1; });
	});

io.of('/register')
	.on('connection', function (socket) {
		regco += 1;
		var log = socket.id.replace(/\/register#/g, 'User : ');
		log += ' connected to [/register] route| Connected : ' + regco;
		process.env.NODE_ENV == 'development' ? console.log(log) : log;
		var scktid = socket.id.replace(/\/register#/g, '');
		var co_msg = { 'scktid' : scktid };
		io.of('/register')
			.to(socket.id)
			.emit('my-message', co_msg);
		socket.on('user signin', function (data) {
			var auth = new authMod();
			var log = 'received : \n' + JSON.stringify(data);
			process.env.NODE_ENV == 'development' ? console.log(log) : log;
			auth.checkRegData(data, socket, io);
		});
		socket.on('disconnect', function() { regco -= 1; });
	});

io.of('/assets')
	.on('connection', function (socket) {
		var log = socket.id.replace(/\/register#/g, 'User : ');
		assetco += 1;
		log += ' connected to [/assets] route| Connected : ' + assetco;
		process.env.NODE_ENV == 'development' ? console.log(log) : log;
		socket.on('add asset', function (data) {
			var asset = new assetMod();
			var log = 'add asset data returned :\n' + JSON.stringify(data);
			process.env.NODE_ENV == 'development' ? console.log(log) : log;
			asset.checkAssetData(data, socket, io);
		});
		socket.on('disconnect', function() { assetco -= 1;});
	});
