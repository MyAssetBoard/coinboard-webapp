/**
 * @file Unit test file for profile route functions
 * @author base on Express app and edited by Trevis Gulby
 */

/* eslint no-invalid-this: 0 */
const User = require('../../coin_board/schemas/user');
const request = require('supertest');
const express = require('../../coin_board/node_modules/express');
const bodyParser = require('../../coin_board/node_modules/body-parser');
const profileroute = require('../../coin_board/routes/profile/profile');
const path = require('path');
const app = express();
const testurl = '/profile';
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
app.use('/profile', profileroute);

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
