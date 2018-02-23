/**
* @file Unit test file for index route functions
* @author base on Express app and edited by Trevis Gulby
*/

var chai = require('chai');
var assert = chai.assert;
var chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
const AuthMod = require('../coin_board/methods/assets_methods');
var ekey = 'U2FsdGVkX19Qw8U0ksGrlaBPe5iKKhzTIoMewLn3L3sCneFkaeycy09%2Fnp2uB6cz';
var auth = new AuthMod();
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

it('Add assets [' + JSON.stringify(mockVdata) + '] for user maintest', function() {
	return assert.isFulfilled(auth.addAssets(mockVdata), 'optional message');
});

it('Reject  [' + JSON.stringify(mockCdata) + '] for user maintest', function() {
	return assert.isRejected(auth.addAssets(mockCdata), 'Invalid quantity');
});
