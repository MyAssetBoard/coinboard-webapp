/**
 * @file Unit test file for user schemas functions
 * @author edited by Trevis Gulby
 */

const expect = require('chai').expect;
const Asset = require('../../coin_board/schemas/user').Assets;
let mockasset = {
    name: 'MockAsset',
    ticker: 'MOCK',
    qtt: 33.33,
};

describe('Asset schema validation', function () {
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

describe('Asset schema creation', function () {
    let m = new Asset(mockasset);
    it('should have a name', function (done) {
        let exp = 'MockAsset';
        expect(m).to.have.property('name');
        expect(m.name).to.be.a('string');
        expect(m.name).to.be.deep.equal(exp);
        done();
    });
    it('should have a ticker', function (done) {
        let exp = 'MOCK';
        expect(m).to.have.property('ticker');
        expect(m.ticker).to.be.a('string');
        expect(m.ticker).to.be.deep.equal(exp);
        done();
    });
    it('should have a qtt', function (done) {
        let exp = 33.33;
        expect(m).to.have.property('qtt');
        expect(m.qtt).to.be.a('number');
        expect(m.qtt).to.be.deep.equal(exp);
        done();
    });
    it('should be invalid if qtt is not a number', function (done) {
        mockasset.qtt = 'invalid';
        m = new Asset(mockasset);
        expect(m.qtt).to.be.an('undefined');
        done();
    });
});
