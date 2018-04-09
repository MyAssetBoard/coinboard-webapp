/**
 * @file Coinbase APIS requests definitions
 * @author coinbase node module and Trevis Gulby
 */

/**
 * Coinbase API wrapper
 * @class
 */
class coinbaseApi {
    /** @constructor */
    constructor() {
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

coinbaseApi.prototype.cbgetaccount = function() {
    this.client.getAccount(accid, function(err, accounts) {
        console.log(accounts);
    });
};
