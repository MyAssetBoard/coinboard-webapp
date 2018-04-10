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
        this.KEY = process.env.CBK;
        this.SC = process.env.CBS;
        this.Param = {
            'apiKey': KEY,
            'apiSecret': SC,
            'version': 'YYYY-MM-DD',
        };
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
