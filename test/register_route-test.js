/**
* @file Unit test file for login route functions
* @author base on Express app and edited by Trevis Gulby
*/

var request = require('supertest');
var test_url = '/signin';
var app = require('../coin_board/app');

describe('Simple GET '+ test_url + ' on app', function() {
	it('it respond with json', function(done) {
		request(app)
			.get(test_url)
			.set('Accept', 'application/json')
			.expect(200)
			.end(function(err) {
				if (err) return done(err);
				done();
			});
	});
	it('it respond with 404', function(done) {
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

describe('Simple POST '+ test_url + ' on app', function() {
	it('respond 405 method forbidden', function(done) {
		request(app)
			.post(test_url)
			.set('Content-type', 'application/json')
			.send('{"email":"foobar@bizz.com"}')
			.expect(405)
			.end(function(err) {
				if (err) return done(err);
				done();
			});
	});
});
