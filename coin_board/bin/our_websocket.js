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


function checkUsr() {
	return new Promise((resolve, reject) => {
		dfDb = "test2";
		dfCo = "users";
		dfkey = "name";
		dreq = askeduser.logname;
		console.log(dreq);
		var crud = new crudMod("test2");
		crud.FindInCollection(dfDb, dfCo, dfkey, dreq, function(result) {
			if (result) {
				if (result['name']) {
					resolve(result);
				} else {
					var reason = new Error('Bad user');
					reject(reason);
				}
			} else {
				var reason = new Error('Bad user');
				reject(reason);
			}
		});
	});
}

function checkData(data, socket) {
	if (data && data['logname']) {
		askeduser = data;
		checkUsr()
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
	return false;
}

io
.of('/auth')
.on('connection', function (socket) {
	connected += 1;
	console.log('user connected id: %s\nTotal : %i', socket.id, connected);
	var usrtmp = "welcome usr " + socket.id.replace(/\/auth#/g, '-');;
	io.of('/auth').emit('my-message', { msg: usrtmp, tot: connected });
	socket.on('user login', function (data) {
		if (checkData(data, socket)) {
			io.of('/auth').emit('my-message', data);
		}
	});
	socket.on('disconnect', function() { connected -= 1; });
});
