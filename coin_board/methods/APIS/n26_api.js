/**
 * @file N26 APIS requests definitions
 * @author N26 node module and Trevis Gulby
 */

/**
 * My N26api overload
 * @class
 */
class n26Api {
    /** @constructor */
    constructor() {
        /** Perfect module for perfect usage */
        this.N26 = require('n26');
    }
}
/** Give expense, credit and sold for a key elem
 * @param {Object} id usr + psswd combo
 * @param {string} key the element to sum about
 * @return {Promise} res cred, deb and sum on string format if resolved
 */
n26Api.prototype.gettrstats = function(id, key) {
    let _this = this;
    return new Promise((resolve, reject) => {
        const acc = new _this.N26(id.usr, id.pw);
        let res = {
            cred: key + ' credit : ',
            char: key + ' charges : ',
            tot: key + ' cost : ',
        };
        acc.then(function(account) {
            account.transactions(
            {
                text: key,
            }).then((tr) => {
                let sum = 0;
                let min = 0;
                let plus = 0;
                for (el in tr) {
                    if (tr[el].amount) {
                        let y = tr[el].amount;
                        min += y <= 0 ?
                            y :
                            0;
                        plus += y >= 0 ?
                            y :
                            0;
                        sum += y;
                    }
                }
                res.cred += plus + ' €';
                res.char += min + ' €';
                res.tot += sum + ' €';
                resolve(res);
            });
        });
    });
};
