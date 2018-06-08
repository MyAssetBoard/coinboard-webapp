/**
 * @file Unit test file for register route functions
 * @author base on Express app and edited by Trevis Gulby
 */

/* eslint no-invalid-this: 0 */
const request = require('supertest');
const sinon = require('sinon');
const expect = require('chai').expect;
const app = require('../../coin_board/controllers/router_methods');
let testurl = '/signin';
let mockuser = {
    email: 'foob@foobi.test',
    username: 'mockuser',
    usercurrency: 'EUR',
    password: 'password',
    passwordConf: 'password',
};

describe('GET ' + testurl, function () {
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
    it('it respond with 404', function (done) {
        request(app)
            .get(testurl + '/foobar')
            .set('Accept', 'application/json')
            .expect(404)
            .end(function (err) {
                if (err) return done(err);
                done();
            });
    });
});

describe('POST ' + testurl, function () {
    it('respond 302 found and register mockuser', function (done) {
        request(app)
            .post(testurl)
            .set('Content-type', 'application/json')
            .send(mockuser)
            .expect(302)
            .end(function (err) {
                if (err) return done(err);
                done();
            });
    });
    it('respond 302 and password don\'t match', function (done) {
        delete mockuser.passwordConf;
        request(app)
            .post(testurl)
            .set('Content-type', 'application/json')
            .send(mockuser)
            .expect(302)
            .end(function (err) {
                if (err) return done(err);
                done();
            });
    });
});

describe('GET signin', function () {
    before(function () {
        return this.spy = sinon.spy(app, 'render');
    });
    after(function () {
        return this.spy.restore();
    });
    it('should exist', function () {
        return request(app).get('/').expect(200);
    });
    return it('should render the "signin" view', function () {
        return expect(this.spy.getCall(0).args[0]).to.be.eql('page');
    });
});

describe('GET /unknow', function () {
    it('it respond with 404', function (done) {
        request(app)
            .get(testurl + '/noextsgsg')
            .set('Accept', 'application/json')
            .expect(404)
            .end(function (err) {
                if (err) return done(err);
                done();
            });
    });
});
