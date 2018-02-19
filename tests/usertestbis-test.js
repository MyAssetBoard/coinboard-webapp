var assert = require('assert');
const authMod = require('../coin_board/methods/auth_methods');
var data = {};
data['InputName'] = 'footest';
data['InputEmail'] = 'footest@footes.eu';
data['InputEthaddr'] = 'NONE';
data['InputBcurr'] = 'EUR';
var resmock = {};
resmock['ok'] = resmock['nb'] = 1;


var desc = 'Simple TEST| function auth.registerUsr() with valid data';
describe(desc, function() {
	desc = 'it should return [ ' + JSON.stringify(resmock) + ' ]';
	it(desc, function() {
		return authMod.registerUsr(data)
			.then(function(res) {
				console.log('res ? ');
				console.log(res);
				assert.equal(res.result.ok, resmock);
			})
			.catch(function (rej, err) {
				if (err) {
					console.log('error catch');
					console.log(err);
				}
				assert.equal(err, null);
			});
	});
});
desc = 'Simple TEST| function auth.registerUsr() with corrupted data';
describe(desc, function() {
	desc = 'it should return an error';
	it(desc, function() {
		data.InputName = 'x';
		return authMod.registerUsr(data)
			.then(function(res) {
				console.log('res input x ? ');
				console.log(res);
				assert.equal(res.result.ok, !resmock);
			})
			.catch(function (rej, err) {
				assert.equal(err, undefined);
			});
	});
});
