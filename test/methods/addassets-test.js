/**
* @file Unit test file for index route functions
* @author base on Express app and edited by Trevis Gulby
*/

var chai = require('chai');
var assert = chai.assert;
var chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
const AssetsMod = require('../../coin_board/methods/assets_methods');
var ekey = 'U2FsdGVkX19Qw8U0ksGrlaBPe5iKKhzTIoMewLn3L3sCneFkaeycy09%2Fnp2uB6cz';
var assets = new AssetsMod();
var mockVdata = {
	ticker: 'ETH',
	qtt: 0.01,
	id: ekey
};
//var fakeKey = encodeURIComponent('yoyoyldldndkdkj');
var mockCdata = {
	ticker: 'ETH',
	qtt: 'yolostringnonum',
	id: 'ltioitoitoi+'
};

var desc = 'Add assets [' + JSON.stringify(mockVdata) + '] for user maintest';
describe(desc, function () {
	it('It return resolved promise', function() {
		return assert.isFulfilled(assets.addAssets(mockVdata), 'optional message');
	});
});

desc = 'Add assets [' + JSON.stringify(mockCdata) + '] for user maintest';
describe(desc, function () {
	it('It reject promise with error : Invaild quantity', function() {
		return assert.isRejected(assets.addAssets(mockCdata), 'Invalid quantity');
	});
});

describe('Test checkcoData', function () {
	it('It return false', function () {
		var rt = assets.checkAssetData({ticker: 'toto', datas: 'tata'});
		return assert.equal(rt, false);
	});

});
