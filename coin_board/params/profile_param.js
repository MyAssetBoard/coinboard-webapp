/**
* @file Profile view params
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
const toraddr = {
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
        title: 'Profile',
        author: '© Copyright 2018 coin_board ;)',
        tsurl: appsurl,
        tvurl: appvurl,
        page: 'login',
        blocks: {
                jumbo: 'blocks/all/my_jumbotron',
                topblock: 'blocks/profile/my_profile',
        },
};

module.exports = param;
