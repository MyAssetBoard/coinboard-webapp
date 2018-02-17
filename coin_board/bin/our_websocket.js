/**
* @file Main runable executable for websocket micro service
* @author based on socket.io doc app and edited by Trevis Gulby
*/


/** PORT to connect to */
var port = process.env.WSPORT || '3001';
var io = require('socket.io')(port);
var connected = 0;
/** dep import */
const crudMod = require('../methods/mongo_crud');

console.log('WEBSOCKET - Runnnig');

function checkUsr(data) {
	return new Promise((resolve, reject) => {
		'use strict';
		var value = data.findName.replace(/\W/g, '');
		var key = 'username';
		var toFind = {};
		toFind[key] = value;
		var crud = new crudMod('test2');
		crud.FindInCollection('r_users', toFind, function(result) {
			if (result && result[key]) { resolve(result); }
			reject(new Error('Bad user'));
		});
	});
}

function registerUsr(data) {
	return new Promise((resolve, reject) => {
		'use strict';
		data.InputName = data.InputName.replace(/\W/g, '');
		data.InputEmail = data.InputEmail.trim();
		data.InputCompany = data.InputCompany.replace(/\W/g, '');
		var toRegister = {
			'username' : data.InputName,
			'useremail' : data.InputEmail,
			'companyname' : data.InputCompany,
			'usercurrency' : data.InputBcurr
		};
		var crud = new crudMod('test2');
		crud.InsertInCollection('r_users', toRegister, function(result) {
			if (result) {resolve(result);}
			reject(new Error('Db Error'));
		});
	});
}

function addAssets(data) {
	return new Promise((resolve, reject) => {
		'use strict';
		data.ticker = data.ticker.replace(/\W/g, '');
		data.qtt = data.qtt.replace(/\W/g, '');
		data.qtt = parseFloat(data.qtt);
		var toRegister = {
			'symbol' : data.ticker,
			'amount' : data.qtt
		};
		var crud = new crudMod('test2');
		crud.InsertInCollection('r_users', toRegister, function(result) {
			if (result) {resolve(result);}
			reject(new Error('Db Error'));
		});
	});
}

function checkRegData(data, socket) {
	'use strict';
	if (data) {
		if (data['InputName'] && data['InputEmail']
		&& data['InputCompany'] && data['InputBcurr']) {
			registerUsr(data)
				.then(function(res) {
					io.of('/register')
						.to(socket.id)
						.emit('my-message', res);
					return true;
				})
				.catch(function (rej, err) {
					console.error(rej.message);
					var errmsg = {
						errcode: 22,
						msg: rej.message
					};
					io.of('/register')
						.to(socket.id)
						.emit('error-message', errmsg);
					if (err) throw(err);
					return false;
				});

		}
	}
}

function checkAssetData(data, socket) {
	'use strict';
	if (data['ticker'] && data['qtt']) {
		addAssets(data)
			.then(function (res) {
				io.of('/assets')
					.to(socket.id)
					.emit('my-message', res);
				return true;
			})
			.catch(function (rej, err) {
				console.error(rej.message);
				var msg = { errcode: 23, msg: rej.message };
				io.of('/assets')
					.to(socket.id)
					.emit('error-message', msg);
				if (err) throw(err);
				return false;
			});
	}
	return false;
}

function checkcoData(data, socket) {
	'use strict';
	if (data['findName']) {
		checkUsr(data)
			.then(function(res) {
				io.of('/auth')
					.to(socket.id)
					.emit('my-message', res);
				return true;
			})
			.catch(function (rej, err) {
				console.error(rej.message);
				var errmsg = { errcode: 22, msg: rej.message };
				io.of('/auth')
					.to(socket.id)
					.emit('error-message', errmsg);
				if (err) throw(err);
				return false;
			});
	}
	return false;
}

io
	.of('/auth')
	.on('connection', function (socket) {
		'use strict';
		connected += 1;
		var log = socket.id.replace(/\/auth#/g, 'User : ');
		log += ' connected to [/auth] route \nconnected : ';
		log += connected;
		console.log(log);
		var usr = 'welcome ' + socket.id.replace(/\/auth#/g, 'user ');
		var scktid = socket.id.replace(/\/auth#/g, '');
		var co_msg = {
			'msg' : usr,
			'scktid' : scktid,
			'tot' : connected
		};
		io.of('/auth').to(socket.id).emit('my-message', co_msg);
		socket.on('user login', function (data) {
			checkcoData(data, socket);
		});
		socket.on('disconnect', function() { connected -= 1; });
	});

io
	.of('/register')
	.on('connection', function (socket) {
		'use strict';
		var log = socket.id.replace(/\/register#/g, 'User : ');
		log += ' connected to [/register] route';
		connected += 1;
		console.log(log);
		var usrtmp = 'welcome ' + socket.id.replace(/\/register#/g, 'user ');
		var scktid = socket.id.replace(/\/register#/g, '');
		var co_msg = {
			'msg' : usrtmp,
			'scktid' : scktid,
			'tot' : connected
		};
		io.of('/register').to(socket.id).emit('my-message', co_msg);
		socket.on('user signin', function (data) {
			checkRegData(data, socket);
		});
		socket.on('disconnect', function() { connected -= 1; });
	});

io
	.of('/assets')
	.on('connection', function (socket) {
		'use strict';
		var log = socket.id.replace(/\/register#/g, 'User : ');
		log += ' connected to [/assets] route';
		connected += 1;
		console.log(log);
		socket.on('add asset', function (data) {
			console.log(data);
			checkAssetData(data, socket);
		});
		socket.on('disconnect', function() { connected -= 1; });
	});
