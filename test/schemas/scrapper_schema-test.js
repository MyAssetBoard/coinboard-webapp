/**
 * @file Unit test file for user schemas functions
 * @author edited by Trevis Gulby
 */

/* eslint no-invalid-this: 0 */
const expect = require('chai').expect;
const Scrapper = require('../../coin_board/schemas/scrapper');
let mocksource = {
    sourcename: 'mockname',
    url: 'https://mock.mocking.com',
    sourcereqhost: 'mock.mock',
    sourcereqpath: '/&param=mock&otherparam=turfu',
    sourceregex: '/*mockrgx/r',
};

describe('Scrapper schema validation', function () {
    it('should be invalid if name is empty', function (done) {
        let m = new Scrapper();

        m.validate(function (err) {
            expect(err.errors.name).to.exist;
            done();
        });
    });
    it('should have a Source property', function (done) {
        let m = new Scrapper();
        expect(m).to.have.property('Sources');
        expect(m.Sources).to.be.an('object');
        done();
    });
    it('should have a Source.Bank property', function (done) {
        let m = new Scrapper();
        expect(m.Sources).to.have.property('Bank');
        expect(m.Sources.Bank).to.be.an('object');
        done();
    });
    it('should have a Source.Crypto property', function (done) {
        let m = new Scrapper();
        expect(m.Sources).to.have.property('Crypto');
        expect(m.Sources.Crypto).to.be.an('object');
        done();
    });
    it('should have a Source.Markets property', function (done) {
        let m = new Scrapper();
        expect(m.Sources).to.have.property('Markets');
        expect(m.Sources.Markets).to.be.an('object');
        done();
    });
    it('should have a Source.Other property', function (done) {
        let m = new Scrapper();
        expect(m.Sources).to.have.property('Bank');
        expect(m.Sources.Other).to.be.an('object');
        done();
    });
});

describe('Scrapper schemas addsource method', function () {
    let u;
    before((done) => {
        Scrapper.findOne({name: 'mockscrap'}, (error, scrapper) => {
            u = scrapper._id;
            done();
        });
    });
});
