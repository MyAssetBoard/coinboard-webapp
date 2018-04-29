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
        /** N26 API module dep */
        this.N26Api = require('./APIS/n26_api');
        this.n26 = new this.N26Api();
    }
}

/** Dummy helper function to fill new account model with user input
 * @param {Object} a new api account creds
 * @return {Object} res see todo
 * @TODO document this model !
 */
Apis.prototype.accmodel = function(a) {
    let res = {};
    res = {
        'id': a.apiid,
        'key': a.inputid,
        'secret': a.inputpw,
    };
    return res;
};

/** Dummy helper function tp check user submitted data for empty string :
 * @param {Object} a new api account creds to be checked
 * @return {boolean} False if empty string found, true otherwise
 * @TODO document this model !
 */
Apis.prototype.checksub = function(a) {
    for (el in a) {
        if (a[el].length === 0) {
            return false;
        }
    }
    return true;
};

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
    data.inputid = data.inputid.trim();
    /** Api secret must be alphanumeric */
    data.inputpw = data.inputpw.trim().replace(/[^0-9a-z]/gi, '');
    data.uid = this.crypt.isEncoded(data.uid) ?
        decodeURIComponent(data.uid) :
        null;
    data.uid = data.uid ? this.crypt.decryptuid(data.uid) : null;
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
        let insert = _this.accmodel(a);
        if (_this.checksub(insert)) {
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
 * @param {Object} usr a combo key pair to find user usrnmae socket id or
 * username telegramid if requested through bot
 * @return {Promise} the requested account details if success or a new Error
 */
Apis.prototype.getAccounts = function(usr) {
    let _this = this;
    usr = usr ? usr : {};
    return new Promise((resolve, reject) => {
        _this.crud.finduser(usr, (res, err) => {
            if (res) {
                let result = res && res.apisv2 ? res.apisv2 : [];
                resolve(result);
            } else {
                reject(new Error('failed to find account'));
            }
        });
    });
};

/** Gather all bank api informations
 * @param {Object} key the key elems to search forr
 * @param {Object} usr a combo key pair to find user
 * @return {Promise} current account sold if success reject else
 */
Apis.prototype.getbankposition = function(key, usr) {
    let _this = this;
    let id = {};
    return new Promise((resolve, reject) => {
        if (usr.apis.hasOwnProperty('Bank')) {
            // noinspection JSUnresolvedVariable
            for (let el in usr.apis.Bank) {
                if (usr.apis.Bank.hasOwnProperty(el) &&
                        usr.apis.Bank[el].id === 'n26') {
                    id['usr'] = usr.apis.Bank[el].key;
                    id['pw'] = usr.apis.Bank[el].secret;
                    _this.n26.gettrstats(id, key).then((res) => {
                        resolve(res);
                    }).catch((err) => {
                        reject(err);
                    });
                }
            }
        } else {
            reject(new Error('No banking api configured'));
        }
    });
};

/** check user supplied api account
 * @param {Object} data new client assets data to be recorded
 * @param {Object} socket the socket object to get the receiver id
 * @param {Object} io  the io object to send response
 * @return {bool} true if success false otherwise
 */
Apis.prototype.checkApiParamsData = function(data, socket, io) {
    if (data['apiid'] && data['inputid'] &&
        data['inputpw'] && data['apitype'] && data['uid']) {
        this.addAccount(data).then(function() {
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
