/**
* @file Signin view params
* @author Trevis Gulby
*/
/** Classic ip get method :*/
const os = require( 'os' );
const ni = os.networkInterfaces();
const myip = ni.eth0[0].address;
/** Onion addr get method :*/
const toraddr = {
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
const cdn1 = 'https://cdn.jsdelivr.net/npm/web3@0.19.0/dist/web3.min.js';

const param = {
        title: 'Signin',
        author: '© Copyright 2018 coin_board ;)',
        tsurl: appsurl,
        tvurl: appvurl,
        page: 'signin',
        scripts: {
                socketio: cdn,
                web3cdn: cdn1,
                myweb3: '/web3_checkaddress.js',
                mysocket: '/signin_socket.js',
        },
        blocks: {
                jumbo: 'blocks/all/my_jumbotron',
                topblock: 'blocks/signin/signin_block',
        },
};

module.exports = param;
