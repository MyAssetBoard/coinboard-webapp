/**
* @file @Login methods definitions
* @author based on express boilerplate and edited by Trevis Gulby
*/

/** dep import */
const crudMod = require('../methods/mongo_crud');

function Auth() {

}

function checkUsr(data) {
	return new Promise((resolve, reject) => {
		var value = data.inputName.replace(/\W/g, '');
		var value1 = data.inputSocketid;
		var toFind = {};
		toFind['username'] = value;
		toFind['socketid'] = value1;
		var crud = new crudMod('test2');
		crud.FindInCollection('r_users', toFind, function(result) {
			if (result) {
				console.log(result);
				resolve(result);
			}
			reject(new Error('Bad user'));
		});
	});
}


function iscoinAddr(address) {
	var ticker;
	var match = false;
	var regex = { 'ETH': /^0x.{40}$/, };
	for(ticker in regex) {
		match = regex[ticker].test(address);
		if (match) break;
	}
	return match;
}

/**
* @TODO : Make toRegister stick with r_usermodel
*/
function registerUsr(data) {
	return new Promise((resolve, reject) => {
		data.InputName = data.InputName.replace(/\W/g, '');
		data.InputEmail = data.InputEmail.trim();
		if (!iscoinAddr(data.InputEthaddr)) {
			data.InputEthaddr = 'NONE';
		}
		var toRegister = {
			'username' : data.InputName,
			'useremail' : data.InputEmail,
			'socketid'  : data.InputSocketid,
			'ethaddr' : data.InputEthaddr,
			'usercurrency' : data.InputBcurr
		};
		var crud = new crudMod('test2');
		crud.InsertInCollection('r_users', toRegister, function(result) {
			if (result) {resolve(result);}
			reject(new Error('Db Error'));
		});
	});
}

Auth.prototype.checkRegData = function(data, socket, io) {
	if (data) {
		if (data['InputName'] && data['InputEmail']
		&& data['InputEthaddr'] && data['InputBcurr']) {
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
};

Auth.prototype.checkcoData = function(data, socket, io) {
	if (data['inputName'] && data['inputSocketid']) {
		checkUsr(data)
			.then(function(res) {
				io.of('/auth').to(socket.id).emit('my-message', res);
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
};

module.exports = Auth;
