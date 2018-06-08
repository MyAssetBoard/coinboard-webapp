/**
 * @file Unit test file for assets route functions
 * @author base on Express app and edited by Trevis Gulby
 */

/* eslint no-invalid-this: 0 */
const User = require('../../coin_board/schemas/user');
const request = require('supertest');
const expect = require('chai').expect;
const express = require('../../coin_board/node_modules/express');
const bodyParser = require('../../coin_board/node_modules/body-parser');
const assetroute = require('../../coin_board/routes/assets/assets');
const setpagecontent = require('../../coin_board/routes/assets/assets').func;
const pageparam = require('../../coin_board/params/def_params');
const path = require('path');
const app = express();
const testurl = '/assets';
let mockapi = {
    apitype: 'Bank',
    apiid: 'mockapi',
    apikey: 'thisisthekey',
    apisecret: 'thisisthesecret',
};
let mockasset = {
    assettype: 'Bank',
    assetid: 'mockasset',
    assetticker: 'MOCK',
    assetqtt: '33.33',
};
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../../coin_board/views'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false,
}));
app.use((req, res, next) => {
    User.findOne({username: 'mockuser'}).exec((err, user) => {
        req.session = {};
        req.session.userId = user._id;
        next();
    });
});
app.use('/assets', assetroute);

describe('/assets , setpagecontent method', function () {
    it('should return Promise', function (done) {
        setpagecontent('/assets/dashboard', pageparam, {foo: 'bar'})
            .then((d) => {
                expect(d).to.have.property('blocks');
                expect(d.blocks[0]).to.be.deep.equal('cb_db');
                done();
            })
            .catch((reject, error) => {
                console.log(reject);
                console.log(error);
                done(error);
            });
    });
});

describe('GET ' + testurl, function () {
    it('it respond with 200', function (done) {
        request(app)
            .get(testurl)
            .set('Accept', 'application/json')
            .expect(200)
            .end(function (err) {
                if (err) return done(err);
                done();
            });
    });
    it('it respond with 200 (empty page)', function (done) {
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

describe('GET /assets/dashboard', function () {
    it('it respond with 200', function (done) {
        request(app)
            .get('/assets/dashboard')
            .set('Accept', 'application/json')
            .expect(200)
            .end(function (err) {
                if (err) return done(err);
                done();
            });
    });
});

describe('GET /assets/infofeed', function () {
    it('it respond with 200', function (done) {
        request(app)
            .get('/assets/infofeed')
            .set('Accept', 'application/json')
            .expect(200)
            .end(function (err) {
                if (err) return done(err);
                done();
            });
    });
});

describe('POST /assets/addapis', function () {
    it('it respond with 302', function (done) {
        request(app)
            .post('/assets/addapis')
            .set('Accept', 'application/json')
            .send(mockapi)
            .expect(302)
            .end(function (err) {
                if (err) return done(err);
                done();
            });
    });
    it('it respond with 404', function (done) {
        request(app)
            .post('/assets/r4dndom')
            .set('Accept', 'application/json')
            .expect(404)
            .end(function (err) {
                if (err) return done(err);
                done();
            });
    });
});

describe('POST /assets/addasset', function () {
    it('it respond with 302', function (done) {
        request(app)
            .post('/assets/addasset')
            .set('Accept', 'application/json')
            .send(mockasset)
            .expect(302)
            .end(function (err) {
                if (err) return done(err);
                done();
            });
    });
    it('it respond with 404', function (done) {
        request(app)
            .post('/assets/addasset/randlao')
            .set('Accept', 'application/json')
            .expect(404)
            .end(function (err) {
                if (err) return done(err);
                done();
            });
    });
});
