/**
 * @file Unit test file for user schemas functions
 * @author edited by Trevis Gulby
 */

/* eslint no-invalid-this: 0 */
const expect = require('chai').expect;
const User = require('../../coin_board/schemas/user');
let mockuser = {
    username: 'mockuser',
    email: 'test@test.test',
    usercurrency: 'EUR',
    password: 'password',
};
let mockasset = {
    name: 'MockAsset',
    ticker: 'MOCK',
    qtt: 33.33,
};
let mockapi = {
    name: 'MockApi',
    key: 'thekey',
    secret: 'thesecret',
};

describe('User schema validation', function () {
    it('should be invalid if username is empty', function (done) {
        let m = new User();

        m.validate(function (err) {
            expect(err.errors.username).to.exist;
            done();
        });
    });
    it('should be invalid if email is empty', function (done) {
        let m = new User();

        m.validate(function (err) {
            expect(err.errors.email).to.exist;
            done();
        });
    });
    it('should be invalid if usercurrency is empty', function (done) {
        let m = new User();

        m.validate(function (err) {
            expect(err.errors.usercurrency).to.exist;
            done();
        });
    });
    it('should be valid if ethaddr is empty', function (done) {
        let m = new User();

        m.validate(function (err) {
            expect(err.errors.ethaddr).not.exist;
            done();
        });
    });
    it('should be valid if telegramid is empty', function (done) {
        let m = new User();

        m.validate(function (err) {
            expect(err.errors.telegramid).not.exist;
            done();
        });
    });
    it('should be invalid if usercurrency is empty', function (done) {
        let m = new User();

        m.validate(function (err) {
            expect(err.errors.usercurrency).to.exist;
            done();
        });
    });
    it('should be invalid if password is empty', function (done) {
        let m = new User();

        m.validate(function (err) {
            expect(err.errors.password).to.exist;
            done();
        });
    });
});

describe('User schema creation', function () {
    let m = new User(mockuser);
    it('should have a username property', function (done) {
        let exp = 'mockuser';
        expect(m).to.have.property('username');
        expect(m.username).to.be.a('string');
        expect(m.username).to.be.deep.equal(exp);
        done();
    });
    it('should have an email property', function (done) {
        let exp = 'test@test.test';
        expect(m).to.have.property('email');
        expect(m.email).to.be.a('string');
        expect(m.email).to.be.deep.equal(exp);
        done();
    });
    it('should have an usercurrency property', function (done) {
        let exp = 'EUR';
        expect(m).to.have.property('usercurrency');
        expect(m.usercurrency).to.be.a('string');
        expect(m.usercurrency).to.be.deep.equal(exp);
        done();
    });
    it('should not have an ethaddr property', function (done) {
        expect(m.ethaddr).to.be.an('undefined');
        done();
    });
    it('should not have a telegramid property', function (done) {
        expect(m.telegramid).to.be.an('undefined');
        done();
    });
    it('should have a password property', function (done) {
        let exp = 'password';
        expect(m).to.have.property('password');
        expect(m.password).to.be.a('string');
        expect(m.password).to.be.deep.equal(exp);
        done();
    });
    it('should have a scrapperid property', function (done) {
        let exp = 'notset';
        expect(m).to.have.property('scrapperid');
        expect(m.scrapperid).to.be.a('string');
        expect(m.scrapperid).to.be.deep.equal(exp);
        done();
    });
    it('should have an Apis property', function (done) {
        expect(m).to.have.property('Apis');
        expect(m.Apis).to.be.an('object');
        done();
    });
    it('should have an Apis.Bank property', function (done) {
        expect(m.Apis).to.have.property('Bank');
        expect(m.Apis.Bank).to.be.an('array');
        done();
    });
    it('should have an Apis.Crypto property', function (done) {
        expect(m.Apis).to.have.property('Crypto');
        expect(m.Apis.Crypto).to.be.an('array');
        done();
    });
    it('should have an Apis.Markets property', function (done) {
        expect(m.Apis).to.have.property('Markets');
        expect(m.Apis.Markets).to.be.an('array');
        done();
    });
    it('should have an Assets property', function (done) {
        expect(m).to.have.property('Assets');
        expect(m.Assets).to.be.an('object');
        done();
    });
    it('should have an Assets.Bank property', function (done) {
        expect(m.Assets).to.have.property('Bank');
        expect(m.Assets.Bank).to.be.an('array');
        done();
    });
    it('should have an Assets.Crypto property', function (done) {
        expect(m.Assets).to.have.property('Crypto');
        expect(m.Assets.Crypto).to.be.an('array');
        done();
    });
    it('should have an Assets.Markets property', function (done) {
        expect(m.Assets).to.have.property('Markets');
        expect(m.Assets.Markets).to.be.an('array');
        done();
    });
});

describe('User schemas authenticate method', function () {
    it('should return mockuser with valid creds', function (done) {
        User.authenticate('mockuser', 'password', function (error, user) {
            expect(user).to.be.an('object');
            expect(error).to.be.a('null');
            done();
        });
    });
    it('should return \'Bad password.\' Error with wrong password', (done) => {
        User.authenticate('mockuser', 'fake', function (error, user) {
            let exp = 'Bad password.';
            expect(user).to.be.an('undefined');
            expect(error.message).to.be.deep.equal(exp);
            done();
        });
    });
    it('should return \'User not found.\' Error with wrong user', (done) => {
        User.authenticate('fake', 'fake', function (error, user) {
            let exp = 'User not found.';
            expect(user).to.be.an('undefined');
            expect(error.message).to.be.deep.equal(exp);
            done();
        });
    });
});

describe('User schemas addasset method', function () {
    let u;
    before((done) => {
        User.authenticate('mockuser', 'password', function (error, user) {
            u = user._id;
            done();
        });
    });
    it('should return success with valid asset', function (done) {
        User.addasset(u, 'Bank', mockasset.name, mockasset.ticker,
            mockasset.qtt,
            function (error, success) {
                let exp = 'Asset ' + mockasset.name + ' successfully added.';
                expect(error).to.be.a('null');
                expect(success).to.be.deep.equal(exp);
                done();
            });
    });
    it('should return error \'No such asset type\'', function (done) {
        User.addasset(u, 'Error', mockasset.name, mockasset.ticker,
            mockasset.qtt,
            function (error, success) {
                let exp = 'No such asset type.';
                expect(error.message).to.be.deep.equal(exp);
                done();
            });
    });
    it('should return error no user', function (done) {
        User.addasset('err', 'Bank', mockasset.name, mockasset.ticker,
            mockasset.qtt,
            function (error, success) {
                let exp = 'Cast to ObjectId failed for value "err" ';
                exp += 'at path "_id" for model "User"';
                expect(error.message).to.be.deep.equal(exp);
                done();
            });
    });
    after((done) => {
        User.authenticate('mockuser', 'password', function (error, user) {
            expect(user.Assets.Bank).to.have.length.above(0);
            done();
        });
    });
});

describe('User schemas addapi method', function () {
    let u;
    before((done) => {
        User.authenticate('mockuser', 'password', function (error, user) {
            u = user._id;
            done();
        });
    });
    it('should return success with valid api', function (done) {
        User.addapi(u, 'Bank', mockapi.name, mockapi.key, mockapi.secret,
            function (error, success) {
                let exp = 'Api ' + mockapi.name + ' successfully added.';
                expect(error).to.be.a('null');
                expect(success).to.be.deep.equal(exp);
                done();
            });
    });
    it('should return error \'No such api type\'', function (done) {
        User.addapi(u, 'Error', mockapi.name, mockapi.key, mockapi.secret,
            function (error, success) {
                let exp = 'No such api type.';
                expect(error.message).to.be.deep.equal(exp);
                done();
            });
    });
    it('should return error no user', function (done) {
        User.addapi('err', 'Bank', mockapi.name, mockapi.key, mockapi.secret,
            function (error, success) {
                let exp = 'Cast to ObjectId failed for value "err" ';
                exp += 'at path "_id" for model "User"';
                expect(error.message).to.be.deep.equal(exp);
                done();
            });
    });
    after((done) => {
        User.authenticate('mockuser', 'password', function (error, user) {
            expect(user.Apis.Bank).to.have.length.above(0);
            done();
        });
    });
});

describe('User schemas toLower and toFloat test', function () {
    let toFloat;
    let toLower;
    before((done) => {
        let funcs = require('../../coin_board/schemas/user').InFuncs;
        toFloat = funcs.toFloat;
        toLower = funcs.toLower;
        done();
    });
    it('Should put \'AAAaAA\' in lowercase', function (done) {
        let tes = 'AAAaAA';
        let exp = 'aaaaaa';
        expect(toLower(tes)).to.be.deep.equal(exp);
        done();
    });
    it('Should put \'42.42\' string to number', function (done) {
        let tes = '42.42';
        let exp = 42.42;
        expect(toFloat(tes)).to.be.deep.equal(exp);
        done();
    });
});
