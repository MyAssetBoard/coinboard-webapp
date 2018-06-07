/**
 * @file Unit test file for user schemas functions
 * @author edited by Trevis Gulby
 */

/* eslint no-invalid-this: 0 */
const expect = require('chai').expect;
const User = require('../../coin_board/schemas/user');
// let mockuser = {
//     username: 'mockuser',
//     password: 'password',
// };

describe('User schema', function () {
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
