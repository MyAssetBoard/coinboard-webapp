/**
 * @file Unit test file for login route functions
 * @author base on Express app and edited by Trevis Gulby
 */

/* eslint no-invalid-this: 0 */
const User = require('../../coin_board/schemas/user');
const Scrapper = require('../../coin_board/schemas/scrapper');
const request = require('supertest');
const expect = require('chai').expect;
const express = require('../../coin_board/node_modules/express');
const bodyParser = require('../../coin_board/node_modules/body-parser');
const djunkroute = require('../../coin_board/routes/datajunk/datajunk');
const path = require('path');
const app = express();
let mocksource = {
    name: 'mockscrp',
    sourcegenre: 'Bank',
    sourcetype: 'info',
    sourcename: 'mocksource',
    sourceurl: 'https://moock.com',
    sourcereqhost: 'api.mock.com',
    sourcereqpath: '/&param=yolo',
    sourceregex: '/random/r',
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
app.use('/datajunk', djunkroute);
let testurl = '/datajunk';

describe('GET ' + testurl, function () {
    it('it respond 200 found', function (done) {
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

describe('POST /datajunk/newscrapper', function () {
    it('respond 302 found and update mockuser scrapper', function (done) {
        request(app)
            .post(testurl + '/newscrapper')
            .set('Content-type', 'application/json')
            .send({name: 'mockscrap'})
            .expect(302)
            .end(function (err) {
                if (err) return done(err);
                done();
            });
    });
    after(function (done) {
        User.findOne({username: 'mockuser'}).exec((err, user) => {
            expect(user).to.have.property('scrapperid');
            expect(user.scrapperid).to.be.a('string');
            Scrapper.findOne({_id: user.scrapperid}).exec((err, scrapper) => {
                expect(scrapper).to.be.an('object');
                expect(scrapper).to.have.property('name');
                expect(scrapper.name).to.be.deep.equal('mockscrap');
                done();
            });
        });
    });
});

describe('GET /datajunk after setting scrapper', function () {
    it('it respond 200 found', function (done) {
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

describe('POST /datajunk/scrapper/newsource', function () {
    it('respond 302 found and add a new source to user scrapper', (done) => {
        request(app)
            .post(testurl + '/scrapper/newsource')
            .set('Content-type', 'application/json')
            .send(mocksource)
            .expect(302)
            .end(function (err) {
                if (err) return done(err);
                done();
            });
    });
    after(function (done) {
        User.findOne({username: 'mockuser'}).exec((err, user) => {
            Scrapper.findOne({_id: user.scrapperid}).exec((err, scrapper) => {
                // expect(scrapper.Sources.Bank.infos).to.be.an('array');
                // expect(scrapper.Sources.Bank.infos).to.have.length.above(0);
                done();
            });
        });
    });
});
