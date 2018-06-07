/**
 * @file {@link config} module unit testing file
 * @author Trevis Gulby
 */

const expect = require('chai').expect;
const Config = require('../../coin_board/controllers/config_methods');

describe('Config options', function () {
    it('it have srvkey and it\'s string', function (done) {
        let conf = new Config();
        let exp = 'coin_board/params/server.key';
        expect(conf).to.have.property('srvkey');
        expect(conf.srvkey).to.be.a('string');
        expect(conf.srvkey).to.be.deep.equal(exp);
        done();
    });
    it('it have srvcert and it\'s string', function (done) {
        let conf = new Config();
        let exp = 'coin_board/params/server.pem';
        expect(conf).to.have.property('srvcert');
        expect(conf.srvcert).to.be.a('string');
        expect(conf.srvcert).to.be.deep.equal(exp);
        done();
    });
    it('it should set vaddr depending on envaar', function (done) {
        process.env['HEROKU'] = 'ok';
        let conf = new Config();
        expect(conf).to.have.property('vaddr');
        expect(conf.vaddr).to.be.a('string');
        let exp = 'https://coin-board.herokuapp.com';
        expect(conf.vaddr).to.be.deep.equal(exp);
        delete process.env['HEROKU'];
        exp = 'https://localhost/';
        conf = new Config();
        expect(conf).to.have.property('vaddr');
        expect(conf.vaddr).to.be.a('string');
        expect(conf.vaddr).to.be.deep.equal(exp);
        done();
    });
    it('it should set saddr depending on envaar', function (done) {
        process.env['HEROKU'] = 'ok';
        let conf = new Config();
        expect(conf).to.have.property('saddr');
        expect(conf.saddr).to.be.a('string');
        let exp = 'wss://coin-boardws.herokuapp.com';
        expect(conf.saddr).to.be.deep.equal(exp);
        delete process.env['HEROKU'];
        exp = 'wss://localhost/3001';
        conf = new Config();
        expect(conf).to.have.property('saddr');
        expect(conf.saddr).to.be.a('string');
        expect(conf.saddr).to.be.deep.equal(exp);
        done();
    });
    it('it should have a runningaddrs object', function (done) {
        let conf = new Config();
        expect(conf).to.have.property('runningaddrs');
        expect(conf.runningaddrs).to.be.an('object');
        done();
    });
    it('runningaddrs should have appvurl property', function (done) {
        delete process.env['SERV_ENV'];
        let conf = new Config();
        expect(conf.runningaddrs).to.have.property('appvurl');
        expect(conf.runningaddrs.appvurl).to.be.a('string');
        expect(conf.runningaddrs.appvurl).to.be.deep.equal(conf.vaddr);
        done();
    });
    it('runningaddrs should have an appsurl property', function (done) {
        delete process.env['SERV_ENV'];
        let conf = new Config();
        expect(conf.runningaddrs).to.have.property('appsurl');
        expect(conf.runningaddrs.appsurl).to.be.a('string');
        expect(conf.runningaddrs.appsurl).to.be.deep.equal(conf.saddr);
        done();
    });
    it('it should have an httpopts object', function (done) {
        let conf = new Config();
        let exp = {
            'X-Content-Type-Options': 'nosniff',
            'X-Frame-Options': 'DENY',
            'X-XSS-Protection': '1; mode=block',
            'etag': 'false',
        };
        expect(conf).to.have.property('httpopts');
        expect(conf.httpopts).to.be.an('object');
        expect(conf.httpopts).to.be.deep.equal(exp);
        done();
    });
    it('it should have a favopts object', function (done) {
        let conf = new Config();
        let exp = {
            dotfiles: 'ignore',
            etag: false,
            extensions: [
                'htm', 'html',
            ],
            index: false,
            maxAge: '1d',
            redirect: false,
        };
        expect(conf).to.have.property('favopts');
        expect(conf.favopts).to.be.an('object');
        expect(conf.favopts).to.be.deep.equal(exp);
        done();
    });
});

describe('Config methods', function () {
    it('it should have a gettorhostnames method', function (done) {
        let conf = new Config();
        expect(conf).to.have.property('gettorhostnames');
        expect(conf.gettorhostnames).to.be.a('function');
        done();
    });
    it('Gettorhostnames method should return an object', function (done) {
        process.env['TEST'] = 'ok';
        let conf = new Config();
        let fs = require('fs');
        fs.writeFileSync('testonion', 'onionaddr');
        expect(conf.gettorhostnames()).to.be.an('object');
        done();
    });
    it('Gettorhostnames rt should have view and socks properties', (done) => {
        process.env['TEST'] = 'ok';
        let conf = new Config();
        let fs = require('fs');
        fs.writeFileSync('testonion', 'onionaddr');
        expect(conf.gettorhostnames()).to.have.property('view');
        expect(conf.gettorhostnames()).to.have.property('socks');
        done();
    });
    it('Gettorhostnames() return testing view() method', (done) => {
        process.env['TEST'] = 'ok';
        let conf = new Config();
        let fs = require('fs');
        let exp = 'http://onionaddr/';
        fs.writeFileSync('testonion', 'onionaddr');
        expect(conf.gettorhostnames().view).to.be.a('function');
        expect(conf.gettorhostnames().view()).to.be.deep.equal(exp);
        done();
    });
    it('Gettorhostnames() return testing socks() method', (done) => {
        process.env['TEST'] = 'ok';
        let conf = new Config();
        let fs = require('fs');
        let exp = 'http://onionaddr:124/';
        fs.writeFileSync('testonion', 'onionaddr');
        expect(conf.gettorhostnames().socks).to.be.a('function');
        expect(conf.gettorhostnames().socks()).to.be.deep.equal(exp);
        done();
    });
    it('it should have a httpsc method', function (done) {
        let conf = new Config();
        expect(conf).to.have.property('httpsc');
        expect(conf.httpsc).to.be.a('function');
        done();
    });
    it('Httpsc method should return an object with tested props', (done) => {
        let conf = new Config();
        expect(conf.httpsc()).to.be.an('object');
        expect(conf.httpsc()).to.have.property('key');
        expect(conf.httpsc()).to.have.property('cert');
        expect(conf.httpsc()).to.have.property('requestCert');
        expect(conf.httpsc()).to.have.property('rejectUnauthorized');
        done();
    });
    after(() => {
        let fs = require('fs');
        fs.unlinkSync('testonion');
    });
});
