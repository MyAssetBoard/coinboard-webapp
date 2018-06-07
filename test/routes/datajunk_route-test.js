/**
 * @file DataJunk router controllers unit tests
 * @author Trevis Gulby
 */

// This will create stubbed functions for our overrides
// let sinon = require('sinon');
// Supertest allows us to make requests against an express object
let supertest = require('supertest');
// Natural language-like assertions
let expect = require('chai').expect;
// To isolate route
let express = require('../../coin_board/node_modules/express');
let path = require('path');
// To get created user
let User = require('../../coin_board/schemas/user');
// View path for express render
let vpath = '../../coin_board/views';
// The route to test
let djunkroute = require('../../coin_board/routes/datajunk/datajunk');


describe('GET /datajunk', function () {
    let app;
    let request;
    let testuser;

    before(function (done) {
        User.findOne({username: 'mockuser'})
            .exec(function (err, user) {
                testuser = user;
                done();
            });
    });
    beforeEach(function () {
        app = express();
        app.use((req, res, next) => {
            req.session = {};
            req.session.userId = testuser._id;
            next();
        });
        app.set('view engine', 'ejs');
        app.set('views', path.join(__dirname, vpath));
        // Bind a route to our application
        app.use('/datajunk', djunkroute);
        // Get a supertest instance so we can make requests
        request = supertest(app);
    });

    it('should respond with a 404', function (done) {
        request
            .get('/datajnky')
            .expect('Content-Type', /json/)
            .expect(404, function (err, res) {
                expect(res.body).to.deep.equal({});
                done();
            });
    });

    it('should respond with 200 and have body', function (done) {
        request
            .get('/datajunk')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200, function (err, res) {
                expect(res.text)
                    .to.have.length.above(100);
                done();
            });
    });
});
