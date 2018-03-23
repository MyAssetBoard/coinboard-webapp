/**
* @file Index view params
* @author Trevis Gulby
*/

/** Classic ip get method :*/
const os = require( 'os' );
const ni = os.networkInterfaces();
const myip = ni.eth0[0].address;
/** Onion addr get method :*/
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

const param = {
        title: 'Coin_Board',
        author: '© Copyright 2018 coin_board',
        tsurl: appsurl,
        tvurl: appvurl,
        page: 'index',
        blocks: {
                jumbo: 'blocks/all/my_jumbotron',
        },
};

module.exports = param;
