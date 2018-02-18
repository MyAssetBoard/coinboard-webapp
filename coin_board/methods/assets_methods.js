
const crudMod = require('../methods/mongo_crud');

function Assets() {

}

function addAssets(data) {
	return new Promise((resolve, reject) => {
		data.ticker = data.ticker.replace(/\W/g, '');
		data.qtt = data.qtt.replace(/\W/g, '');
		data.qtt = parseFloat(data.qtt);
		data.id = data.id; /** @TODO : check and trim */
		var toRegister = {
			'symbol' : data.ticker,
			'amount' : data.qtt
		};
		var crud = new crudMod('test2');
		crud.InsertInField('r_users', data.id, toRegister, function(result) {
			if (result) {resolve(result);}
			reject(new Error('Db Error'));
		});
	});
}

Assets.prototype.checkAssetData = function (data, socket, io) {
	if (data['ticker'] && data['qtt'] && data['id']) {
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
};

module.exports = Assets;
