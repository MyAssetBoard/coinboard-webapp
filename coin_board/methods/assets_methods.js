
const crudMod = require('../methods/mongo_crud');
const authMod = require('../methods/auth_methods');
var auth = new authMod();

function isEncoded(str) {
	try {
		var res = decodeURIComponent(str);
	} catch (e) {
		if (e || !res) {return false;}
	}
	return true;
}

function Assets(socket, io) {
	this.socket ? socket : [];
	this.io ? io : [];
}

Assets.prototype.addAssets = function (a) {
	return new Promise((resolve, reject) => {
		a.ticker = a.ticker.replace(/\W/g, '');
		a.qtt = typeof a.qtt === 'string' ?
			a.qtt.replace('(\\d)+\\.(\\d+)', '') : a.qtt;
		a.qtt = a.qtt ? parseFloat(a.qtt) : 0.00;
		a.id = isEncoded(a.id) ? decodeURIComponent(a.id) : null;
		a.id = a.id ? auth.decryptUid(a.id) : null;

		var data = { 'symbol': a.ticker, 'qtt' : a.qtt };
		if (a.id && a.qtt) {
			var crud = new crudMod('test2', 'r_users');
			crud.InsertInField(a.id, 'assets', data, function(result) {
				if (result) {
					resolve(result);
				}
				reject(new Error('Db Error'));
			});
		} else if (!a.qtt) {
			reject(new Error('Invalid quantity'));
		} else {
			reject(new Error('Wrong request'));
		}
	});
};

Assets.prototype.checkAssetData = function (data, socket, io) {
	if (data['ticker'] && data['qtt'] && data['id']) {
		var asset = new Assets();
		asset.addAssets(data)
			.then(function (res) {
				console.log(res);
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
};

module.exports = Assets;
