/**
 * @file Unit test file for my assets route functions
 * @author base on Express app and edited by Trevis Gulby
 */

/* eslint no-invalid-this: 0 */
const expect = require('chai').expect;
const sinon = require('sinon');
const request = require('supertest');
const fs = require('fs');
const app = require('../../coin_board/controllers/router_methods');
const assetroad = require('../../coin_board/routes/assets/assets_roads');
let testurl = '/assets';
let mockcookie = [
'uid=U2FsdGVkX1%2Bjb7ZIjxt6%2F1NjCsg2JBE5R9xQbYHLz8P6mHLu6PCka1T2BqK5PnwI',
];

describe('GET /assets', function () {
    before(function () {
        return this.spy = sinon.spy(app, 'render');
    });
    after(function () {
        return this.spy.restore();
    });
    it('should exist', function () {
        return request(app).get('/').expect(200);
    });
    return it('should render the "assets" view', function () {
        return expect(this.spy.getCall(0).args[0]).to.be.eql('page');
    });
});

describe('GET /assets/unknow', function () {
    it('it respond with 404', function (done) {
        request(app)
            .get(testurl + 'noextIRlg')
            .set('Accept', 'application/json')
            .expect(404)
            .end(function (err) {
                if (err) return done(err);
                done();
            });
    });
});

describe('GET /assets with cookies', function () {
    it('it respond with 202 and pass mockup check', function (done) {
        let mock = './test/page_mockup/asset_mockup';
        request(app)
            .get(testurl)
            .set('Accept', 'application/json')
            .set('Cookie', mockcookie)
            .expect(200)
            .end(function (err, res) {
                if (err) return done(err);
                expect(res.text, fs.readFileSync(mock, 'utf8'));
                done();
            });
    });
});

describe('POST /addapis', function () {
    it('it respond with 200', function (done) {
        request(app)
            .post(testurl + '/addapis')
            .set('Accept', 'application/json')
            .expect(200)
            .end(function (err) {
                if (err) return done(err);
                done();
            });
    });
});

describe('POST /addasset', function () {
    it('it respond with 200', function (done) {
        request(app)
            .post(testurl + '/addasset')
            .set('Accept', 'application/json')
            .expect(200)
            .end(function (err) {
                if (err) return done(err);
                done();
            });
    });
});

describe('asset/assets_roads module properties test', function () {
    it('it have dashboard and it\'s object', function (done) {
        expect(assetroad).to.have.property('dashboard');
        expect(assetroad.dashboard).to.be.an('object');
        done();
    });
    it('it have dashboard.path and it\'s string', function (done) {
        expect(assetroad.dashboard).to.have.property('path');
        expect(assetroad.dashboard.path).to.be.a('string');
        done();
    });
    it('it have dashboard.getd and it\'s function', function (done) {
        expect(assetroad.dashboard).to.have.property('getd');
        expect(assetroad.dashboard.getd).to.be.a('function');
        done();
    });
    it('it have dashboard.stripd and it\'s function', function (done) {
        expect(assetroad.dashboard).to.have.property('stripd');
        expect(assetroad.dashboard.stripd).to.be.a('function');
        done();
    });
    it('it have infofeed and it\'s object', function (done) {
        expect(assetroad).to.have.property('infofeed');
        expect(assetroad.infofeed).to.be.an('object');
        done();
    });
    it('it have infofeed.path and it\'s string', function (done) {
        expect(assetroad.infofeed).to.have.property('path');
        expect(assetroad.infofeed.path).to.be.a('string');
        done();
    });
    it('it have infofeed.getd and it\'s function', function (done) {
        expect(assetroad.infofeed).to.have.property('getd');
        expect(assetroad.infofeed.getd).to.be.a('function');
        done();
    });
    it('it have infofeed.stripd and it\'s function', function (done) {
        expect(assetroad.infofeed).to.have.property('stripd');
        expect(assetroad.infofeed.stripd).to.be.a('function');
        done();
    });
    it('it have pricefeed and it\'s object', function (done) {
        expect(assetroad).to.have.property('pricefeed');
        expect(assetroad.pricefeed).to.be.an('object');
        done();
    });
    it('it have pricefeed.path and it\'s string', function (done) {
        expect(assetroad.pricefeed).to.have.property('path');
        expect(assetroad.pricefeed.path).to.be.a('string');
        done();
    });
    it('it have pricefeed.getd and it\'s function', function (done) {
        expect(assetroad.pricefeed).to.have.property('getd');
        expect(assetroad.pricefeed.getd).to.be.a('function');
        done();
    });
    it('it have pricefeed.stripd and it\'s function', function (done) {
        expect(assetroad.pricefeed).to.have.property('stripd');
        expect(assetroad.pricefeed.stripd).to.be.a('function');
        done();
    });
    it('it have apiparams and it\'s object', function (done) {
        expect(assetroad).to.have.property('apiparams');
        expect(assetroad.apiparams).to.be.an('object');
        done();
    });
    it('it have apiparams.path and it\'s string', function (done) {
        expect(assetroad.apiparams).to.have.property('path');
        expect(assetroad.apiparams.path).to.be.a('string');
        done();
    });
    it('it have apiparams.getd and it\'s function', function (done) {
        expect(assetroad.apiparams).to.have.property('getd');
        expect(assetroad.apiparams.getd).to.be.a('function');
        done();
    });
    it('it have apiparams.stripd and it\'s function', function (done) {
        expect(assetroad.apiparams).to.have.property('stripd');
        expect(assetroad.apiparams.stripd).to.be.a('function');
        done();
    });
});

describe('roads.dashboard.getd function test', function () {
    it('return an object to callback', function (done) {
        assetroad.dashboard.getd((res) => {
            expect(res).to.have.property('blocks');
            expect(res).to.be.an('object');
            done();
        });
    });
    it('should be an array containing \'cb_block\' string', function (done) {
        assetroad.dashboard.getd((res) => {
            expect(res.blocks).to.be.an('array');
            expect(res.blocks[0]).to.equal('cb_db');
            done();
        });
    });
});

describe('roads.dashboard.stripd function test', function () {
    let mockdata = {
        foo: 'test',
        apisv2: ['test'],
    };
    it('delete \'apiv2\' property from userdata', function (done) {
        assetroad.dashboard.stripd(mockdata);
        expect(mockdata).to.have.property('foo');
        expect(mockdata).to.not.have.property('apisv2');
        done();
    });
});

describe('roads.infofeed.getd function test', function () {
    it('return an object to callback', function (done) {
        assetroad.infofeed.getd((res) => {
            expect(res).to.have.property('blocks');
            expect(res).to.be.an('object');
            done();
        });
    });
    it('should have an array containing infofeed view blocks string',
        function (done) {
            let expected = ['cb_ifeed', 'cb_dmfeed'];
            assetroad.infofeed.getd((res) => {
                expect(res.blocks).to.be.an('array');
                expect(res.blocks).to.have.length(2);
                expect(res.blocks[0]).to.equal(expected[0]);
                expect(res.blocks[1]).to.equal(expected[1]);
                done();
            });
        });
});

describe('roads.infofeed.stripd function test', function () {
    let mockdata = {
        foo: 'test',
        apisv2: ['test'],
        assets: ['testassets'],
    };
    it('delete \'apiv2\' and \'assets\' property from userdata',
        function (done) {
            assetroad.infofeed.stripd(mockdata);
            expect(mockdata).to.have.property('foo');
            expect(mockdata).to.not.have.property('apisv2');
            expect(mockdata).to.not.have.property('assets');
            done();
        });
});

describe('roads.pricefeed.getd function test', function () {
    it('return an object to callback', function (done) {
        assetroad.pricefeed.getd((res) => {
            expect(res).to.have.property('blocks');
            expect(res).to.be.an('object');
            done();
        });
    });
    it('should be an array containing \'cb_block\' string', function (done) {
        assetroad.pricefeed.getd((res) => {
            expect(res.blocks).to.be.an('array');
            expect(res.blocks[0]).to.equal('cb_pfeed');
            done();
        });
    });
});

describe('roads.pricefeed.stripd function test', function () {
    let mockdata = {
        foo: 'test',
        apisv2: ['test'],
    };
    it('delete \'apiv2\' property from userdata', function (done) {
        assetroad.pricefeed.stripd(mockdata);
        expect(mockdata).to.have.property('foo');
        expect(mockdata).to.not.have.property('apisv2');
        done();
    });
});

describe('roads.apiparams.getd function test', function () {
    it('return an object to callback', function (done) {
        assetroad.apiparams.getd((res) => {
            expect(res).to.have.property('blocks');
            expect(res).to.be.an('object');
            done();
        });
    });
    it('should be an array containing \'api_param\' string', function (done) {
        assetroad.apiparams.getd((res) => {
            expect(res.blocks).to.be.an('array');
            expect(res.blocks[0]).to.equal('api_param');
            done();
        });
    });
});

describe('roads.apiparams.stripd function test', function () {
    let mockdata = {
        foo: 'test',
        assets: ['bar'],
    };
    it('delete \'assets\' property from userdata', function (done) {
        assetroad.apiparams.stripd(mockdata);
        expect(mockdata).to.have.property('foo');
        expect(mockdata).to.not.have.property('assets');
        done();
    });
});
