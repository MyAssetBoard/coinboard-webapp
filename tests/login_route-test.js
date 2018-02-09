var assert= require('assert');
var request = require('supertest');
var test_url = '/login';
var app = require('../coin_board/app');

describe('Simple GET /login on app', function() {
	it('respond with json', function(done) {
		request(app)
		.get(test_url)
		.set('Accept', 'application/json')
		.expect(200)
		.end(function(err, res) {
			if (err) return done(err);
			done();
		});
	});
	it('respond with 404', function(done) {
		request(app)
		.get(test_url + '/foobar')
		.set('Accept', 'application/json')
		.expect(404)
		.end(function(err, res) {
			if (err) return done(err);
			done();
		})
	});
});

describe('Simple POST /login on app', function() {
	it('respond with json', function(done) {
		request(app)
		.post(test_url)
		.set('Content-type', 'application/json')
		.send('{"email":"foobar@bizz.com"}')
		.expect(200)
		.end(function(err, res) {
			if (err) return done(err);
			done();
		});
	});
	it('respond with 404', function(done) {
		request(app)
		.get('/noexist')
		.set('Accept', 'application/json')
		.expect(404)
		.end(function(err, res) {
			if (err) return done(err);
			done();
		})
	});
});
