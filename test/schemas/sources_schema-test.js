/**
 * @file Unit test file for user schemas functions
 * @author edited by Trevis Gulby
 */

/* eslint no-invalid-this: 0 */
const expect = require('chai').expect;
const Source = require('../../coin_board/schemas/scrapper').Source;
const mocksource = {
    name: 'mocksource',
    url: 'https://mocksource.test',
    fname: 'mockfile',
    req: {
        host: 'mock.host.test',
        path: '/&param=foo&otherparam=bar',
    },
};

describe('Source schema', function () {
    it('should be invalid if name is empty', function (done) {
        let m = new Source();

        m.validate(function (err) {
            expect(err.errors.name).to.exist;
            done();
        });
    });
    it('should be invalid if url is empty', function (done) {
        let m = new Source();

        m.validate(function (err) {
            expect(err.errors.url).to.exist;
            done();
        });
    });
    it('should be valid if fname is empty', function (done) {
        let m = new Source();

        m.validate(function (err) {
            expect(err.errors.fname).not.exist;
            done();
        });
    });
    it('should be invalid if req object is empty', function (done) {
        let m = new Source();

        m.validate(function (err) {
            expect(err.errors.req).to.exist;
            done();
        });
    });
    it('should be valid if parse object is empty', function (done) {
        let m = new Source();

        m.validate(function (err) {
            expect(err.errors.parse).not.exist;
            done();
        });
    });
});

describe('Source schema creation', function () {
    let m = new Source(mocksource);
    console.log(m);
    it('should have a name property', function (done) {
        expect(m).to.have.property('name');
        expect(m.name).to.be.a('string');
        expect(m.name).to.be.deep.equal('mocksource');
        done();
    });
    it('should have a url property', function (done) {
        expect(m).to.have.property('url');
        expect(m.url).to.be.a('string');
        expect(m.url).to.be.deep.equal('https://mocksource.test');
        done();
    });
    it('should have a fname property with a custom setter', function (done) {
        expect(m).to.have.property('fname');
        expect(m.fname).to.be.a('string');
        expect(m.fname).to.contain('.json');
        done();
    });
});
