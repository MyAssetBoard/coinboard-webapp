/**
 * @file Unit test file for my assets route functions
 * @author base on Express app and edited by Trevis Gulby
 */

const expect = require('chai').expect;
const sinon = require('sinon');
const request = require('supertest');
const fs = require('fs');
const app = require('../../coin_board/controllers/router_methods');
let testurl = '/assets';

describe('GET /assets', function() {
    before(function() {
        return this.spy = sinon.spy(app, 'render');
    });
    after(function() {
        return this.spy.restore();
    });
    it('should exist', function() {
        return request(app).get('/').expect(200);
    });
    return it('should render the "assets" view', function() {
        return expect(this.spy.getCall(0).args[0]).to.be.eql('page');
    });
});

describe('GET /assets/unknow', function() {
    it('it respond with 404', function(done) {
        request(app)
            .get(testurl + 'noextIRlg')
            .set('Accept', 'application/json')
            .expect(404)
            .end(function(err) {
                if (err) return done(err);
                done();
            });
    });
});

describe('GET /assets with cookies', function() {
    it('it respond with 202 and pass mockup check', function(done) {
        let mock = './test/page_mockup/asset_mockup';
        request(app)
            .get(testurl)
            .set('Accept', 'application/json')
            .set('Cookie', ['uid=U2FsdGVkX1%2Bjb7ZIjxt6%2F1NjCsg2JBE5R9xQbYHLz8P6mHLu6PCka1T2BqK5PnwI'])
            .expect(200)
            .end(function(err, res) {
                if (err) return done(err);
                expect(res.text, fs.readFileSync(mock, 'utf8'));
                done();
            });
    });
});
