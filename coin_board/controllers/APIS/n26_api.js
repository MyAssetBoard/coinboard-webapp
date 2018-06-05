/**
 * @file {@link module:n26api~N26Api} requests definitions
 * @author N26 node module and Trevis Gulby
 * @license MIT
 */

/**
 * My N26api overload
 * @class
 */
class N26Api {
    /** @constructor */
    constructor () {
        /** Perfect module for perfect usage
         * click [here](https://github.com/PierrickP/n26) for doc
         */
        this.N26 = require('n26');
    }
}

N26Api.prototype.getsums = function (tr, key) {
    let sum = 0;
    let min = 0;
    let plus = 0;
    let res = {
        cred: key + ' credit : ',
        char: key + ' charges : ',
        tot: key + ' cost : ',
    };
    for (el in tr) {
        if (tr[el].amount) {
            let y = tr[el].amount;
            min += y <= 0 ? y : 0;
            plus += y >= 0 ? y : 0;
            sum += y;
        }
    }
    res.cred += plus + ' €';
    res.char += min + ' €';
    res.tot += sum + ' €';
    return res;
};

/** Give expense, credit and sold for a key elem
 * @param {Object} id usr + pw combo
 * @param {string} key the element to sum about
 * @return {Promise} res cred, deb and sum on string format if resolved
 */
N26Api.prototype.gettrstats = function (id, key) {
    let _this = this;
    return new Promise((resolve, reject) => {
        const acc = new _this.N26(id.usr.toString(), id.pw.toString());
        acc.then((account) => {
            account.transactions({
                text: key,
            }).then((tr) => {
                resolve(_this.getsums(tr, key));
            }).catch((err) => {
                reject(err);
            });
        });
    });
};

module.exports = N26Api;
/** ### Work In Progress module for [N26](https://my.n26.com) bank
 * @module n26api
 */
