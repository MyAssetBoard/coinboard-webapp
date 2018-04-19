/**
 * @file Unit test file for login route functions
 * @author base on Express app and edited by Trevis Gulby
 */

const request = require('supertest');
const app = require('../../coin_board/controllers/router_methods');
let testurl = '/signin';

describe('Simple GET ' + testurl + ' on app', function() {
    it('it respond with json', function(done) {
        request(app)
            .get(testurl)
            .set('Accept', 'application/json')
            .expect(200)
            .end(function(err) {
                if (err) return done(err);
                done();
            });
    });
    it('it respond with 404', function(done) {
        request(app)
            .get(testurl + '/foobar')
            .set('Accept', 'application/json')
            .expect(404)
            .end(function(err) {
                if (err) return done(err);
                done();
            });
    });
});

describe('Simple POST ' + testurl + ' on app', function() {
    it('respond 405 method forbidden', function(done) {
        request(app)
            .post(testurl)
            .set('Content-type', 'application/json')
            .send('{"email":"foobar@bizz.com"}')
            .expect(405)
            .end(function(err) {
                if (err) return done(err);
                done();
            });
    });
});
