/**
 * @file {@link module:api~Apis} methods definition
 * (use {@link module:crud} and {@link module:crypt})
 * @author Trevis Gulby
 */

/** Wow so much methods !
 * @class
 */
class Apis {
    /** @constructor */
    constructor() {
        /** {@link Crud} methods import */
        this.Crud = require('../controllers/mongo_crud');
        /** New {@link Crud} Object */
        this.crud = new this.Crud('test2', 'r_users');
        /** {@link Crypt} methods import */
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

/** Parse user submitted new api account fields
 * @param {Object} data new api account creds to be trimed
 * @return {Object} The trimed data
 * @TODO document this model !
 */
Apis.prototype.trimnewaccount = function(data) {
    /** Api id must be only alphanum */
    data.apiid = data.apiid.trim().replace(/[^0-9a-z]/gi, '');
    /** Api type must be Bank, Crypto, or Market */
    data.apitype = data.apitype.trim().replace(/[^0-9a-z]/gi, '');
    /** Api key must be alphanum */
    data.inputid = data.inputid.trim().replace(/[^0-9a-z]/gi, '');
    /** Api secret must be alphanum */
    data.inputpw = data.inputpw.trim().replace(/[^0-9a-z]/gi, '');
    data.uid = _this.isEncoded(data.uid) ?
        decodeURIComponent(data.uid) :
        null;
    data.uid = data.uid ? _this.crypt.decryptuid(data.uid) : null;
    return (data);
};

/** Add api account to a user
 * @param {Object} a new api account creds to be recorded
 * @return {Promise} result if success new Error otherwise
 * @TODO document this model !
 */
Apis.prototype.addAccount = function(a) {
    let _this = this;
    return new Promise((resolve, reject) => {
        a = _this.trimnewaccount(a);
        let where = 'apisv2' + '.' + a.apitype;
        let insert = {
            'id': a.apiid,
            'key': a.inputid,
            'secret': a.inputpw,
        };
        if (insert.id.length && insert.key.length &&
            insert.secret.length) {
            _this.crud.update(a.uid, where, insert, (result, err) => {
                if (result) {
                    resolve(result);
                }
                reject(err ?
                    new Error('Db Error \n' + JSON.stringify(err)) :
                    new Error('something failed with db..'));
            });
        } else {
            reject(new Error('Wrong request'));
        }
    });
};

/** Return a filtered request on user api collection for template rendering
 * @param {Object} what the filter for results
 * @return {Promise} result if success new Error otherwise
 */
Apis.prototype.getAccounts = function(what) {
    let _this = this;
    what ? what :
    {};
    return new Promise((resolve, reject) => {
        _this.crud.find(what, (res, err) => {
            if (res) {
                let result = res[0] && res[0].apis ? res[0].apis : [];
                resolve(result);
            } else {
                reject(new Error('failed to find'));
            }
        });
    });
};
/** check user supplied api account
 * @param {Object} data new client assets data to be recorded
 * @param {Objet} socket the socket object to get the receiver id
 * @param {Object} io  the io object to send response
 * @return {bool} true if success false otherwise
 */
Apis.prototype.checkApiParamsData = function(data, socket, io) {
    if (data['apiid'] && data['inputid'] &&
        data['inputpw'] && data['apitype'] && data['uid']) {
        this.addAccount(data).then(function(res) {
            let nm = {};
            nm.msg = data.apiid + ' account successfully added';
            io.of('/api/param').to(socket.id).emit('nm', nm);
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

module.exports = Apis;
/** ### {@link module:api~Apis} class definition
 * @module api
 */
