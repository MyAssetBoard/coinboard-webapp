/**
* @file Unit test file for index route functions
* @author base on Express app and edited by Trevis Gulby
*/

var expect = require('chai').expect;
var sinon = require('sinon');
var request = require('supertest');
var test_url = '/signin';
var app = require('../../coin_board/app');

describe('GET index', function() {
	before(function() {
		return this.spy = sinon.spy(app, 'render');
	});
	after(function() {
		return this.spy.restore();
	});
	it('should exist', function() {
		return request(app).get('/').expect(200);
	});
	return it('should render the "index" view', function() {
		return expect(this.spy.getCall(0).args[0]).to.be.eql('basepage');
	});
});

describe('GET /unknow', function ()  {
	it('it respond with 404', function(done) {
		request(app)
			.get(test_url + 'noextsgsg')
			.set('Accept', 'application/json')
			.expect(404)
			.end(function(err) {
				if (err) return done(err);
				done();
			});
	});
});
