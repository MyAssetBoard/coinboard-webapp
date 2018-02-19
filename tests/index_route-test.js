/**
* @file Unit test file for index route functions
* @author base on Express app and edited by Trevis Gulby
*/

var request = require('supertest');
var test_url = '/';
var app = require('../coin_board/app');

describe('Simple GET /(index) on app', function() {
	it('respond with json yolo ??', function(done) {
		request(app)
			.get(test_url)
			.set('Accept', 'application/json')
			.expect(200)
			.end(function(err) {
				if (err) return done(err);
				done();
			});
	});
	it('respond with 404', function(done) {
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
