/**
 * @file {@link module:coinbaseapi~CoinbaseApi} requests definitions
 * @author Coinbase node module samples and Trevis Gulby
 * @license MIT
 */

/** Coinbase API wrapper
 * @class
 */
class CoinbaseApi {
    /** @constructor */
    constructor() {
        /** See [here](https://developers.coinbase.com) for doc */
        this.Client = require('coinbase').Client;
        this.creds = process.env.RUN_MODE == 'priv' ? require('../../creds') :
            require('../../dev_creds');
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
