/**
 * @file Unit test file for user schemas functions
 * @author edited by Trevis Gulby
 */

const expect = require('chai').expect;
const Asset = require('../../coin_board/schemas/user').Assets;

describe('Asset schema', function () {
    it('should be invalid if name is empty', function (done) {
        let m = new Asset();

        m.validate(function (err) {
            expect(err.errors.name).to.exist;
            done();
        });
    });

    it('should be invalid if ticker is empty', function (done) {
        let m = new Asset();

        m.validate(function (err) {
            expect(err.errors.ticker).to.exist;
            done();
        });
    });
    it('should be invalid if qtt is empty', function (done) {
        let m = new Asset();

        m.validate(function (err) {
            expect(err.errors.qtt).to.exist;
            done();
        });
    });
});
