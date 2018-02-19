/**
* @file Unit test file for index route functions
* @author base on Express app and edited by Trevis Gulby
*/

var request = require('supertest');
var app = require('../coin_board/app');
var encuid = 'U2FsdGVkX1+mDHISrsXh0y2OjOzSc8p6RvS27xJfLI7h8PpyYdF0tVXaVsxGkGPd';
var base_url = '/login/id/';
var test_rdurl = base_url + 'R26536536565NDOMM';
var test_valrul = base_url + encuid;
var Cookies;

describe('Simple GET ' + test_valrul, function() {
	it('it respond with 302', function(done) {
		request(app)
			.get(test_valrul)
			.set('Accept', 'application/json')
			.expect(302)
			.end(function(err) {
				if (err) return done(err);
				done();
			});
	});
	it('it respond with 302 and add sessionuid', function(done) {
		request(app)
			.get(test_valrul)
			.set('Accept', 'application/json')
			.expect(302)
			.end(function(err, res) {
				if (err) return done(err);
				Cookies = res.headers['set-cookie']
					.map(function(r){
						return r.replace('; path=/; httponly','');
					}).join('; ');
				done();
			});
	});
	it('it respond with 200 and have cookies', function(done) {
		var req = request(app).get('/login');
		req.cookies = Cookies;
		req.set('Accept', 'application/json')
			.expect(200)
			.end(function(err) {
				var log = 'SUPERTEST== Cookies set ?\n';
				log += JSON.stringify(req.cookies);
				process.env.NODE_ENV == 'development' ?
					console.log(log) : log;
				if (err) return done(err);
				done();
			});
	});
});
describe('Simple GET ' + test_rdurl, function() {
	it('respond with 403', function(done) {
		var req = request(app).get(test_rdurl);
		req.set('Accept', 'application/json')
			.expect(403)
			.end(function(err) {
				if (err) return done(err);
				done();
			});
	});
});
