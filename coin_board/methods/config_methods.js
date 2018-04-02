const os = require( 'os' );
const ni = os.networkInterfaces();
const myip = process.env.SERV_ENV == 'local'
        ? ni.wlan0[0].address
        : ni.docker0[0].address;
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

const appconfig = {
        vaddr: appvurl,
        saddr: appsurl,
};

module.exports = appconfig;
