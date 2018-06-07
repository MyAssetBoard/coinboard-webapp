/**
 * @file Unit test file for index route functions
 * @author base on Express app and edited by Trevis Gulby
 */

/* eslint no-invalid-this: 0 */
const app = require('../../coin_board/controllers/router_methods');
const expect = require('chai').expect;
const sinon = require('sinon');
const request = require('supertest');
const testurl = '/';

describe('GET index', function () {
    before(function () {
        return this.spy = sinon.spy(app, 'render');
    });
    after(function () {
        return this.spy.restore();
    });
    it('should exist', function () {
        return request(app).get(testurl).expect(200);
    });
    return it('should render the "index" view', function () {
        return expect(this.spy.getCall(0).args[0]).to.be.eql('page');
    });
});

describe('GET /unknow', function () {
    it('it respond with 404', function (done) {
        request(app)
            .get(testurl + 'noextsgsg')
            .set('Accept', 'application/json')
            .expect(404)
            .end(function (err) {
                if (err) return done(err);
                done();
            });
    });
});
