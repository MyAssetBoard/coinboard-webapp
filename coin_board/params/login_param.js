/**
* @file Login view params
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

const cdn = 'https://cdnjs.cloudflare.com/ajax/libs/socket.io/2.0.4/socket.io.js';
const cdn1 = 'https://cdnjs.cloudflare.com/ajax/libs/crypto-js/3.1.9-1/crypto-js.min.js';

const param = {
        title: 'Login',
        author: '© Copyright 2018 coin_board ;)',
        tsurl: appsurl,
        tvurl: appvurl,
        page: 'login',
        scripts: {
                socketio: cdn,
                cryptojs: cdn1,
                mysocket: '/auth_socket.js',
        },
        blocks: {
                jumbo: 'blocks/all/my_jumbotron',
                topblock: 'blocks/login/login_block',
        },
};

module.exports = param;
