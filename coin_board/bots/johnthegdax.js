const factpath = 'gdax-trading-toolkit/build/src/factories/';
const gdaxfactpath = factpath + 'gdaxFactories';
const creds = process.env.RUN_MODE == 'priv' ? require('../../creds') :
    require('../../dev_creds');

/** WIP class for gdax trading */
class JohnBot {
    /** @constructor */
    constructor () {
        this.fact = require(gdaxfactpath);
        this.gdax = new this.fact.DefaultAPI(null);
    }
}

JohnBot.prototype.midmarketprice = function () {
    let _this = this;
    process.env.GDAX_KEY = process.env.GDAX_KEY ?
        process.env.GDAX_KEY : creds.GDAXAPI.GDAX_KEY;
    process.env.GDAX_SECRET = process.env.GDAX_SECRET ?
        process.env.GDAX_SECRET : creds.GDAXAPI.GDAX_SECRET;
    process.env.GDAX_PASSPHRASE = process.env.GDAX_PASSPHRASE ?
        process.env.GDAX_PASSPHRASE : creds.GDAXAPI.GDAX_PASSPHRASE;
    return new Promise((resolve, reject) => {
        _this.gdax.loadMidMarketPrice('ETH-EUR').then((price) => {
            resolve(price);
        });
    });
};

JohnBot.prototype.myaccount = function () {
    let _this = this;
    process.env.GDAX_KEY = process.env.GDAX_KEY ?
        process.env.GDAX_KEY : creds.GDAXAPI.GDAX_KEY;
    process.env.GDAX_SECRET = process.env.GDAX_SECRET ?
        process.env.GDAX_SECRET : creds.GDAXAPI.GDAX_SECRET;
    process.env.GDAX_PASSPHRASE = process.env.GDAX_PASSPHRASE ?
        process.env.GDAX_PASSPHRASE : creds.GDAXAPI.GDAX_PASSPHRASE;
    return new Promise((resolve, reject) => {
        _this.gdax.loadCoinbaseAccounts(null).then((accounts) => {
            resolve(accounts);
        }).catch((error) => {
            throw new Error('Failed to load account' + error);
        });
    });
};


module.exports = JohnBot;
