/**
 * @file Unit test file for index route functions
 * @author base on Express app and edited by Trevis Gulby
 */

/* eslint no-invalid-this: 0 */
const User = require('../../coin_board/schemas/user');
const request = require('supertest');
const express = require('../../coin_board/node_modules/express');
const bodyParser = require('../../coin_board/node_modules/body-parser');
const indexroute = require('../../coin_board/routes/index/index');
const path = require('path');
const app = express();
const testurl = '/';
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
app.use('/', indexroute);
app.use('/index', indexroute);

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

describe('GET /index', function () {
    it('it respond with json', function (done) {
        request(app)
            .get('/index')
            .set('Accept', 'application/json')
            .expect(200)
            .end(function (err) {
                if (err) return done(err);
                done();
            });
    });
    it('it respond with 404', function (done) {
        request(app)
            .get('/index' + '/foobar')
            .set('Accept', 'application/json')
            .expect(404)
            .end(function (err) {
                if (err) return done(err);
                done();
            });
    });
});
