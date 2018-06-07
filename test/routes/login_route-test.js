/**
 * @file Unit test file for login route functions
 * @author base on Express app and edited by Trevis Gulby
 */

const request = require('supertest');
const app = require('../../coin_board/controllers/router_methods');
let testurl = '/login';
let mocklogin = {
    logusername: 'fakeme',
    logpassword: 'fakepass',
};

describe('Simple GET /login on app', function () {
    it('it respond with json', function (done) {
        request(app)
            .get(testurl)
            .set('Accept', 'application/json')
            .expect(200)
            .end(function (err) {
                if (err) return done(err);
                done();
            });
    });
    it('it respond with 200', function (done) {
        request(app)
            .get(testurl + '/foobar')
            .set('Accept', 'application/json')
            .expect(200)
            .end(function (err) {
                if (err) return done(err);
                done();
            });
    });
});

describe('Simple POST /login on app with fake param', function () {
    it('respond 302', function (done) {
        request(app)
            .post(testurl)
            .set('Content-type', 'application/json')
            .send(mocklogin)
            .expect(302)
            .end(function (err) {
                if (err) return done(err);
                done();
            });
    });
});
