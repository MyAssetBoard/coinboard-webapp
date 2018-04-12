/**
 * @file {@link AppConfig} module for listening address and more
 * @author Trevis Gulby
 */

/** os dep to get network interface */
const os = require('os');
/** network interface import */
const ni = os.networkInterfaces();
/** what ip should i get ? */
const myip = ni.wlan0[0].address;
/** fs module import */
const fs = require('fs');
/** check tor hostname if onion service set */
let toraddr = {
    view: function() {
        let buff = new Buffer(22);
        let fn = '/var/lib/tor/hidnview/hostname';
        buff = fs.readFileSync(fn, 'ascii');
        let ret = 'http://' + buff.toString().replace(/\s+/g, ' ').trim();
        ret += '/';
        return ret;
    },
    socks: function() {
        let buff = new Buffer(22);
        let fn = '/var/lib/tor/hidnws/hostname';
        buff = fs.readFileSync(fn, 'ascii');
        let ret = 'http://' + buff.toString().replace(/\s+/g, ' ').trim();
        return ret += ':124/';
    },
};
/** final app view url for reference in template */
const appvurl = process.env.SERV_ENV == 'onion' ?
    toraddr.view() :
    'http://' + myip + ':3000/';
/** final app socket url for reference in template */
const appsurl = process.env.SERV_ENV == 'onion' ?
    toraddr.socks() :
    'http://' + myip + ':3001/';

/** @namespace
 * @property {string} vaddr view address string
 * @property {string} saddr socket address string
 */
const AppConfig = {
    vaddr: appvurl,
    saddr: appsurl,
};

module.exports = AppConfig;
/** App config module containing  listening addresses, hostnames and much more
 * @module config
 */
