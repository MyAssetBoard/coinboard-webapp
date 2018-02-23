var chai = require('chai');
var assert = chai.assert;
var chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
const authMod = require('../../coin_board/methods/auth_methods');
var auth = new authMod();

const vmock = {
	InputName : 'footest',
	InputEmail: 'footest@footes.eu',
	InputSocketid: 'xxxxXX',
	InputEthaddr:'NONE',
	InputBcurr:'EUR'
};
var resvmock = { ok: 1, nb: 1};

const emock = {
	InputName : 'fo',
	InputEmail: 'fozzu',
	InputSocketid: '00',
	InputEthaddr:'NO^ẑzzz\nE',
	InputBcurr:'EURz'
};
var resemock = 'Invalid data submitted';

var desc = 'Test register new valid user [' + JSON.stringify(vmock) + ']';
describe(desc, function () {
	it('It return promise [' + JSON.stringify(resvmock) + ']', function() {
		return assert.isFulfilled(auth.registerUsr(vmock), resvmock);
	});
});

desc = 'Test register new corrupt user :[' + JSON.stringify(emock) + ']';
describe(desc, function () {
	it('It reject promise [' + resemock + ']', function() {
		return assert.isRejected(auth.registerUsr(emock), resemock);
	});
});

desc = 'Test userisAuth with corrupt euid: ldkldkldlkldk';
describe(desc, function () {
	var res = 'user not found';
	it('It reject promise [' + res + ']', function() {
		return assert.isRejected(auth.userisAuth('ldkldkldlkldk'), res);
	});
});

desc = 'Test userisAuth with valid euid';
describe(desc, function () {
	var res = 'ok user foobar';
	var euid = decodeURIComponent('U2FsdGVkX19Qw8U0ksGrlaBPe5iKKhzTIoMewLn3L3sCneFkaeycy09%2Fnp2uB6cz');
	it('It resove promise [' + res + ']', function() {
		return assert.isFulfilled(auth.userisAuth(euid), res);
	});
});

desc = 'Test checkcoData with new corrupt user [inputName: kjkj, yolo: oio]';
describe(desc, function () {
	var res = false;
	var req = { inputName: 'kjkj', yolo: 'oio' };
	it('It reject promise [' + res + ']', function() {
		return assert.equal(auth.checkcoData(req), res);
	});
});
