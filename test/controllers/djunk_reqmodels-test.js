/**
 * @file Unit test file for reqmodels var and functs
 * @author Trevis Gulby
 */

const expect = require('chai').expect;
const reqs = require('../../coin_board/controllers/djunk/reqmodels');

describe('MOQREQUEST properties test', function () {
    it('should have a ctaf property', function (done) {
        expect(reqs).to.have.property('ctaf');
        expect(reqs.ctaf).to.be.an('object');
        done();
    });
    it('should have a crnews property', function (done) {
        expect(reqs).to.have.property('crnews');
        expect(reqs.crnews).to.be.an('object');
        done();
    });
    it('should have a crcomp property', function (done) {
        expect(reqs).to.have.property('crcomp');
        expect(reqs.crcomp).to.be.an('object');
        done();
    });
});

describe('MOQREQUEST.ctaf properties test', function () {
    it('should have an id property', function (done) {
        let exp = 'n.ctaf';
        expect(reqs.ctaf).to.have.property('id');
        expect(reqs.ctaf.id).to.be.a('string');
        expect(reqs.ctaf.id).to.be.deep.equal(exp);
        done();
    });
    it('should have an url property', function (done) {
        let exp = 'https://cointelegraph.com/rss';
        expect(reqs.ctaf).to.have.property('url');
        expect(reqs.ctaf.url).to.be.a('string');
        expect(reqs.ctaf.url).to.be.deep.equal(exp);
        done();
    });
    it('should have a req property', function (done) {
        expect(reqs.ctaf).to.have.property('req');
        expect(reqs.ctaf.req).to.be.an('object');
        expect(reqs.ctaf.req).to.have.property('host');
        expect(reqs.ctaf.req).to.have.property('path');
        done();
    });
    it('should have an fname property', function (done) {
        let exp = './DTAFOOD/news/ctaf-';
        expect(reqs.ctaf).to.have.property('fname');
        expect(reqs.ctaf.fname).to.be.a('string');
        expect(reqs.ctaf.fname).to.contain(exp);
        done();
    });
    it('should have a clean property', function (done) {
        expect(reqs.ctaf).to.have.property('clean');
        expect(reqs.ctaf.clean).to.be.a('function');
        done();
    });
    it('should have a get property', function (done) {
        expect(reqs.ctaf).to.have.property('get');
        expect(reqs.ctaf.get).to.be.a('function');
        done();
    });
});
