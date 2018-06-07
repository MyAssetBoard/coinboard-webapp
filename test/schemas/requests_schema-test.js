/**
 * @file Unit test file for request schema
 * @author edited by Trevis Gulby
 */

/* eslint no-invalid-this: 0 */
const expect = require('chai').expect;
const Request = require('../../coin_board/schemas/scrapper').Request;

describe('Request schema', function () {
    it('should be invalid if host is empty', function (done) {
        let m = new Request();

        m.validate(function (err) {
            expect(err.errors.host).to.exist;
            done();
        });
    });
    it('should be invalid if path is empty', function (done) {
        let m = new Request();

        m.validate(function (err) {
            expect(err.errors.path).to.exist;
            done();
        });
    });
});
