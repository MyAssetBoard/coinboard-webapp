/**
 * @file {@link module:UserAssets} methods definition
 * (use {@link module:crud})
 * @author Trevis Gulby
 */

/** Wow so much methods !
 * @class
 */
class Assets {
    /** @constructor */
    constructor() {
        /** {@link Crud} methods import */
        this.Crud = require('../controllers/mongo_crud');
        /** New {@link Crud} Object */
        this.crud = new this.Crud('test2', 'r_users');
        /** {@link Crypt} controllers import */
        this.Crypt = require('../controllers/crypt_methods');
        /** New {@link Crypt} Object */
        this.crypt = new this.Crypt();
        /** check if
         * @param {string} str is an encoded param
         * @return {bool} true if true false if not ;)
         */
        this.isEncoded = function(str) {
            try {
                decodeURIComponent(str);
            } catch (e) {
                if (e) {
                    return false;
                }
            }
            return true;
        };
    }
}

/** Add assets to a user
 * @param {Object} a new client assets data to be recorded
 * @return {Promise} result if success new Error otherwise
 */
Assets.prototype.addAssets = function(a) {
    let _this = this;
    return new Promise((resolve, reject) => {
        a.ticker = a.ticker.replace(/\W/g, '');
        a.qtt = typeof a.qtt === 'string' ?
            a.qtt.replace('(\\d)+\\.(\\d+)', '') :
            a.qtt;
        a.qtt = a.qtt ? parseFloat(a.qtt) : 0.00;
        a.id = _this.isEncoded(a.id) ? decodeURIComponent(a.id) : null;
        a.id = a.id ? _this.crypt.decryptuid(a.id) : null;
        let data = {
            'symbol': a.ticker,
            'qtt': a.qtt,
        };
        if (a.id && a.qtt) {
            _this.crud.update(a.id, 'assets', data, function(res, err) {
                res ? resolve(res) : reject(new Error('Db Error' + err));
            });
        } else {
            reject(new Error('Wrong request'));
        }
    });
};

/** check user supplied assets
 * @param {Object} data new client assets data to be recorded
 * @param {Objet} socket the socket object to get the receiver id
 * @param {Object} io  the io object to send response
 * @return {bool} true if success false otherwise
 */
Assets.prototype.checkAssetData = function(data, socket, io) {
    if (data['ticker'] && data['qtt'] && data['id']) {
        this.addAssets(data).then(function(res) {
            let nm = {};
            nm.msg = data.ticker + ' successfully added';
            io.of('/assets').to(socket.id).emit('nm', nm);
            return true;
        }).catch(function(rej, err) {
            console.error(rej.message);
            let emsg = {};
            emsg.errcode = 23;
            emsg.msg = rej.message;
            io.of('/assets').to(socket.id).emit('em', emsg);
            if (err) {
                throw (err);
            }
            return false;
        });
    }
    return false;
};

module.exports = Assets;
/** ### Registered User asset managements methods
 * @module UserAssets
 */
