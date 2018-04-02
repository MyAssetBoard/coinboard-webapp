/**
* @file Error view params
* @author Trevis Gulby
*/

/** Classic ip get method :*/
const os = require( 'os' );
const ni = os.networkInterfaces();
const myip = process.env.SERV_ENV == 'local'
        ? ni.wlan0[0].address
        : ni.docker[0].address;
/** Onion addr get method :*/
const fs = require( 'fs' );
let toraddr = {
        view: function() {
                let buff = new Buffer( 22 );
                let fn = '/var/lib/tor/hidnview/hostname';
                buff = fs.readFileSync( fn, 'ascii' );
                let ret = buff.toString().replace( /\s+/g, ' ' ).trim();
                return ret;
        },
        socks: function() {
                let buff = new Buffer( 22 );
                let fn = '/var/lib/tor/hidnws/hostname';
                buff = fs.readFileSync( fn, 'ascii' );
                let ret = buff.toString().replace( /\s+/g, ' ' ).trim();
                return ret += ':124';
        },
};

const appvurl = process.env.SERV_ENV == 'onion'
        ? toraddr.view()
        : 'http://' + myip + ':3000/';
const appsurl = process.env.SERV_ENV == 'onion'
        ? toraddr.socks()
        : 'http://' + myip + ':3001/';

const param = {
        title: 'Coin_B. => ItsA(NastyBUG)',
        author: '© Copyright 2018 coin_board x)',
        tsurl: appsurl,
        tvurl: appvurl,
        page: 'error',
        scripts: {
                reload: '/to_homepage.js',
        },
        blocks: {
                jumbo: 'blocks/all/my_jumbotron',
        },
};

module.exports = param;
