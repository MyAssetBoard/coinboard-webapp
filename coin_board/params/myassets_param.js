/**
* @file My assets view params
* @author Trevis Gulby
*/

/** Classic ip get method :*/
const os = require( 'os' );
const ni = os.networkInterfaces();
const myip = ni.eth0[0].address;
/** Onion addr get method :*/
const fs = require( 'fs' );
let toraddr = {
        view: function() {
                let buff = new Buffer( 22 );
                let fn = '/var/lib/tor/hidnview/hostname';
                buff = fs.readFileSync( fn, 'ascii' );
                return buff.toString().replace( /\s+/g, ' ' ).trim();
        },
        socks: function() {
                let buff = new Buffer( 22 );
                let fn = '/var/lib/tor/hidnws/hostname';
                buff = fs.readFileSync( fn, 'ascii' );
                return buff.toString().replace( /\s+/g, ' ' ).trim();
        },
};

const appvurl = process.env.SERV_ENV == 'onion'
        ? toraddr.view()
        : 'http://' + myip + ':3000/';
const appsurl = process.env.SERV_ENV == 'onion'
        ? toraddr.socks()
        : 'http://' + myip + ':3001/';

const cdn = 'https://cdnjs.cloudflare.com/ajax/libs/socket.io/2.0.4/socket.io.js';
const cdn1 = 'https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.7.1/Chart.min.js';
const tickers = require( './tickers' );

const param = {
        title: 'My assets',
        author: '© Copyright 2018 coin_board',
        tsurl: appsurl,
        tvurl: appvurl,
        page: 'assets',
        scripts: {
                socketio: cdn,
                chartcdn: cdn1,
                manage: '/assets_management.js',
        },
        blocks: {
                jumbo: 'blocks/all/my_jumbotron',
                centerblock: 'blocks/assets/my_assets',
        },
        symb: tickers,
};

module.exports = param;
