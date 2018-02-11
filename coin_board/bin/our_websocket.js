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

function checkData(data, socket) {
	if (data){
		if (data['logname']) {
			checkUsr(data)
			.then(function(res, err) {
				if (!res || err) { throw(err); }
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
	console.log('user connected id: %s\nTotal : %i', socket.id, connected);
	var usrtmp = "welcome usr " + socket.id.replace(/\/auth#/g, '-');
	var co_msg = { 'msg' : usrtmp, 'tot' : connected };
	io.of('/auth').emit('my-message', co_msg);
	socket.on('user login', function (data) { checkData(data, socket) });
	socket.on('disconnect', function() { connected -= 1; });
});
