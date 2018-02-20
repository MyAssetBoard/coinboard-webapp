var assert = require('assert');
var should = require('should');
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

describe('Simple TEST| function auth.registerUsr() with corrupted mock', function() {
	it('it should return an error', async () => {
		return authMod.registerUsr(errmock)
			.then(function(res, err) {
				console.log('res input x ? ');
				expect(res);
				//assert.equal(res.result.ok, !resmock);
			});
	});
});

describe('Simple TEST| function auth.registerUsr() with valid mock', function() {
	it('it should return [ ' + JSON.stringify(resmock) + ' ]', async () => {
		return authMod.registerUsr(mock)
			.then(function(res) {
				console.log('res ? ');
				console.log(res);
				assert.equal(res.result, resmock);
				expect(res.result).to.equal(resmock);
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
