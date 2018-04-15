/**
 * @file {@link module:coinbase~CoinbaseApi} requests definitions
 * @author coinbase node module and Trevis Gulby
 */

/**
 * Coinbase API wrapper
 * @class
 */
class CoinbaseApi {
    /** @constructor */
    constructor() {
        /** See [here](https://developers.coinbase.com) for doc */
        this.Client = require('coinbase').Client;
        this.creds = require('../../../creds');
        this.Param = {};
        this.Param.apikey = this.creds.CoinbaseApi.key;
        this.Param.apiSecret = this.creds.CoinbaseApi.secret;
        this.Param.version = 'YYYY-MM-DD';
    }
}

CoinbaseApi.prototype.cbgetaccount = function() {
    this.client.getAccount(accid, function(err, accounts) {
        console.log(accounts);
    });
};

module.exports = CoinbaseApi;
/** ### Work In Progress module for [Coinbase](https://coinbase.com)
 * @module coinbaseapi
 */
