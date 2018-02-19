/**
* @file @Login methods definitions
* @author based on express boilerplate and edited by Trevis Gulby
*/

/** dep import */
const crudMod = require('../methods/mongo_crud');
const ObjectID = require('mongodb').ObjectID;
const CryptoJS = require('crypto-js');


/**
* Helpers functs to be mooved later !!
*/

function dcryptParams(p) {
	/** @TODO lolilol to be randomized */
	var enckey = 'yolo 123';
	var bytes  = CryptoJS.AES.decrypt(p, enckey);
	var plaintext = bytes.toString(CryptoJS.enc.Utf8);
	var log = 'auth_methods.js|dcryptParams()\n';
	log += '==== (TODO :update enckey)\n => plaintext if succeed [ ';
	log += plaintext + ' ]';
	process.env.NODE_ENV == 'infosec' ? console.log(log) : log;
	return plaintext;
}

function encryptParams(p) {
	/** @TODO lolilol to be randomized */
	var enckey = 'yolo 123';
	var toenc = p._id.toString();
	var citxt = CryptoJS.AES.encrypt(toenc, enckey);
	var enc = citxt.toString();
	var log = 'auth_methods.js|encryptParams(p)\n';
	log += '==== (TODO :update enckey)\n => enc str if succeed [ ';
	log += enc + ' ]';
	process.env.NODE_ENV == 'infosec' ? console.log(log) : log;
	return enc;
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

function Auth() {
}

/**
* \brief basically checking is a decrypted _id
*	exist in user collection and
*	strip private fields from result
*/
function checkUid(data) {
	return new Promise((resolve, reject) => {
		var crud = new crudMod('test2');
		var val = new ObjectID(data);
		crud.FindInCollection('r_users', val, function (res) {
			if (res) {
				delete res._id;
				delete res.socketid;
				resolve(res);
			}
			reject(new Error('Bad Id'));
		});
	});
}

/**
* \brief username /password checking method
*/
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
				resolve(result);
			} else {
				reject(new Error('Bad user'));
			}
		});
	});
}

Auth.checkRegFields = function (data) {
	data.InputName = data.InputName.replace(/\W/g, '');
	data.InputEmail = data.InputEmail.trim();
	if (data.InputName.length < 3 || data.InputEmail.length < 5
	|| data.InputSocketid.length < 5 || !data.InputEthaddr.length
	|| data.InputBcurr.length != 3) {
		return null;
	}
	if (!iscoinAddr(data.InputEthaddr)) {data.InputEthaddr = 'NONE'; }
	return data;
};
/**
* \brief register a new user base on a toregister format
* @TODO : Make toRegister stick with r_usermodel
*/
Auth.registerUsr = function (data) {
	return new Promise((resolve, reject) => {
		var crud = new crudMod('test2');
		if ((data = Auth.checkRegFields(data)) != null) {
			var toRegister = {
				'username' : data.InputName,
				'useremail' : data.InputEmail,
				'socketid'  : data.InputSocketid,
				'ethaddr' : data.InputEthaddr,
				'usercurrency' : data.InputBcurr
			};
			crud.InsertInCollection('r_users', toRegister, function(result) {
				if (result) {resolve(result);}
				reject(new Error('Db Error'));
			});
		} else {
			reject(new Error('Invalid data submitted'));
		}
	});
};


Auth.prototype.checkRegData = function(data, socket, io) {
	if (data) {
		if (data['InputName'] && data['InputEmail']
		&& data['InputEthaddr'] && data['InputBcurr']) {
			Auth.registerUsr(data)
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
				var enc = encryptParams(res);
				var resp = {_id: enc };
				process.env.NODE_ENV == 'development' ?
					console.log(resp) : resp;
				io.of('/auth')
					.to(socket.id)
					.emit('my-message', resp);
				return true;
			})
			.catch(function (rej, err) {
				console.error(rej.message);
				var errmsg = { msg: rej.message };
				io.of('/auth')
					.to(socket.id)
					.emit('error-message', errmsg);
				if (err) throw(err);
				return false;
			});
	}
	return false;
};

Auth.prototype.userisAuth = function(eUid) {
	return new Promise((resolve, reject) => {
		var duid = dcryptParams(eUid);
		checkUid(duid)
			.then(function (res) {
				resolve(res);
			})
			.catch(function (rej, err) {
				if (err) throw err;
				reject(new Error('user not found'));
			});
	});
};

Auth.prototype.isvaliduid = function(eUid) {
	var test = dcryptParams(eUid);
	return test ? true : false;
};

module.exports = Auth;
