var chai = require('chai');
var assert = chai.assert;
const authMod = require('../coin_board/methods/auth_methods');
const mock = {
	InputName : 'footest',
	InputEmail: 'footest@footes.eu',
	InputEthaddr:'NONE',
	InputBcurr:'EUR'
};
const errmock = {
	InputName : 'fo',
	InputEmail: 'fozzu',
	InputEthaddr:'NO^ẑzzz\nE',
	InputBcurr:'EURz'
};
var resmock = {};
resmock['ok'] = resmock['nb'] = 1;

describe('Simple TEST| auth.registerUsr() with valid mock', function() {
	it('it should return [ ' + JSON.stringify(resmock) + ' ]', function() {
		return authMod.registerUsr(mock)
			.then(function(res) {
				console.log('res ? ');
				console.log(res);
				assert.equal(res.result, resmock);
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

describe('Simple TEST| auth.registerUsr() with corrupted mock', function() {
	it('it should return an error', function() {
		return authMod.registerUsr(errmock)
			.then(function(res) {
				console.log('res ? ');
				console.log(res);
				assert.equal(res.result, !resmock);
			})
			.catch(function (rej, err) {
				if (err) {
					console.log('error catch');
					console.log(err);
				}
				assert.equal(rej, 'Error: Invalid data submitted');
			});
	});
});
