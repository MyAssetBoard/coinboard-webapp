/**
 * @file Unit test file for user schemas functions
 * @author edited by Trevis Gulby
 */

const expect = require('chai').expect;
const Api = require('../../coin_board/schemas/user').Apis;

describe('Api schema', function () {
    it('should be invalid if name is empty', function (done) {
        let m = new Api();

        m.validate(function (err) {
            expect(err.errors.name).to.exist;
            done();
        });
    });
    it('should be invalid if key is empty', function (done) {
        let m = new Api();

        m.validate(function (err) {
            expect(err.errors.key).to.exist;
            done();
        });
    });
    it('should be invalid if secret is empty', function (done) {
        let m = new Api();

        m.validate(function (err) {
            expect(err.errors.secret).to.exist;
            done();
        });
    });
});
