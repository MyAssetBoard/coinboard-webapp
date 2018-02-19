/**
* @file Unit test file for my assets route functions
* @author base on Express app and edited by Trevis Gulby
*/

var request = require('supertest');
var test_url = '/assets';
var app = require('../coin_board/app');

describe('Simple GET / on app', function() {
	it('respond with json', function(done) {
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
			.get(test_url + '/foobar')
			.set('Accept', 'application/json')
			.expect(404)
			.end(function(err) {
				if (err) return done(err);
				done();
			});
	});
});
