
const crudMod = require('../methods/mongo_crud');
const authMod = require('../methods/auth_methods');
var auth = new authMod();

function Assets() {

}

function addAssets(a) {
	return new Promise((resolve, reject) => {
		a.ticker = a.ticker.replace(/\W/g, '');
		a.qtt = a.qtt.replace(/\W/g, '');
		a.qtt = parseFloat(a.qtt);
		a.id = decodeURIComponent(a.id);
		a.id = auth.decryptUid(a.id);

		var data = {
			'symbol': a.ticker,
			'qtt' : a.qtt
		};
		var crud = new crudMod('test2', 'r_users');
		crud.InsertInField(a.id, 'assets', data, function(result) {
			if (result) {resolve(result);}
			reject(new Error('Db Error'));
		});
	});
}

Assets.prototype.checkAssetData = function (data, socket, io) {
	if (data['ticker'] && data['qtt'] && data['id']) {
		addAssets(data)
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
