/**
* @file Main runable executable for websocket micro service
* @author based on socket.io doc app and edited by Trevis Gulby
*/
var async = require('async');

/** PORT to connect to */
var port = process.env.WSPORT || '3001';
var io = require('socket.io')(port);
var connected = 0;
console.log('WEBSOCKET - Runnnig');
/** dep import */
const crudMod = require('../methods/mongo_crud');


function checkUsr(data) {
	return new Promise((resolve, reject) => {
		data.logname = data.logname.replace(/\W/g, '');
		var toFind = {'name' : data.logname};
		var crud = new crudMod("test2");
		crud.FindInCollection("r_users", toFind, function(result) {
			if (result && result['name']) { resolve(result); }
			reject(new Error('Bad user'));
		});
	});
}

function registerUsr(data) {
	return new Promise((resolve, reject) => {
		data.InputName = data.InputName.replace(/\W/g, '');
		data.InputEmail = data.InputEmail.trim();
		data.InputCompany = data.InputCompany.replace(/\W/g, '');
		var toRegister = {
			'username' : data.InputName,
			'useremail' : data.InputEmail,
			'companyname' : data.InputCompany,
			'usercurrency' : data.InputBcurr
		};
		var crud = new crudMod("test2");
		crud.InsertInCollection("r_users", toRegister, function(result) {
			if (result) {resolve(result)}
			reject(new Error('Db Error'));
		});
	});
}

function checkRegData(data, socket) {
	if (data) {
		if (data['InputName'] && data['InputEmail']
		&& data['InputCompany'] && data['InputBcurr']) {
			registerUsr(data)
			.then(function(res) {
				io.of('/register').to(socket.id).emit('my-message', res);
				return true;
			})
			.catch(function (rej, err) {
				console.error(rej.message);
				var errmsg = { errcode: 22, msg: rej.message };
				io.of('/register').to(socket.id).emit('error-message', errmsg);
				if (err) throw(err);
				return false;
			})

		}
	}
}

function checkcoData(data, socket) {
	if (data){
		if (data['logname']) {
			checkUsr(data)
			.then(function(res) {
				io.of('/auth').to(socket.id).emit('my-message', res);
				return true;
			})
			.catch(function (rej, err) {
				console.error(rej.message);
				var errmsg = { errcode: 22, msg: rej.message };
				io.of('/auth').to(socket.id).emit('error-message', errmsg);
				if (err) throw(err);
				return false;
			})
		}
	}
	return false;
}

io
.of('/auth')
.on('connection', function (socket) {
	connected += 1;
	var log = socket.id.replace(/\/auth#/g, 'User : ');
	log += " connected to [/auth] route \nconnected : ";
	log += connected;
	console.log(log);
	var usrtmp = "welcome " + socket.id.replace(/\/auth#/g, 'user ');
	var co_msg = { 'msg' : usrtmp, 'tot' : connected };
	io.of('/auth').emit('my-message', co_msg);
	socket.on('user login', function (data) { checkcoData(data, socket) });
	socket.on('disconnect', function() { connected -= 1; });
});

io
.of('/register')
.on('connection', function (socket) {
	var log = socket.id.replace(/\/register#/g, 'User : ');
	log += " connected to [/register] route";
	console.log(log);
	socket.on('user signin', function (data) { checkRegData(data, socket)});
	socket.on('disconnect', function() { });
})
