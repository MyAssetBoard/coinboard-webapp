/**
 * @file Unit test file for parseur schemas functions
 * @author edited by Trevis Gulby
 */

/* eslint no-invalid-this: 0 */
const expect = require('chai').expect;
const Source = require('../../coin_board/schemas/scrapper').Parseur;

describe('Parseur schema', function () {
    it('should be invalid if regex is empty', function (done) {
        let m = new Source();

        m.validate(function (err) {
            expect(err.errors.regex).to.exist;
            done();
        });
    });
    it('should be valid if name is empty', function (done) {
        let m = new Source();

        m.validate(function (err) {
            expect(err.errors.name).not.exist;
            done();
        });
    });
});
