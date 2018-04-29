/**
 * @file {@link Auth} methods definitions
 * @author Trevis Gulby
 */

/** Wow so much methods !
 * @class
 */
class Auth {
    /** @constructor */
    constructor() {
        /**
         * [Mongodb](https://mongodb.github.io/node-mongodb-native/index.html),
         *  [database object](https://bit.ly/2GJCpBY) constructor module import
         */
        this.ObjectID = require('mongodb').ObjectID;
        /** {@link Crypt} methods import */
        this.Crypt = require('../controllers/crypt_methods');
        /** New {@link Crypt} Object */
        this.crypt = new this.Crypt();
        /** {@link Crud} methods import */
        this.Crud = require('../controllers/mongo_crud');
        /** New {@link Crud} Object */
        this.crud = new this.Crud();
    }
}

/** try to decode uri component
 * @param {string} str the tested encoded string
 * @return {bool} is a valid encoded uri param
 */
Auth.prototype.isEncoded = function(str) {
    try {
        decodeURIComponent(str);
    } catch (e) {
        if (e) {
            return false;
        }
    }
    return true;
};

/** check if user supplied eth address is a valid one
 * @param {string} address ethereum address user supplied
 * @return {bool} true if is a valid address , false otherwise
 */
Auth.prototype.iscoinAddr = function(address) {
    let ticker;
    let match = false;
    let regex = {
        'ETH': /^0x.{40}$/,
    };
    for (ticker in regex) {
        if (regex.hasOwnProperty(ticker)) {
            if ((match = regex[ticker].test(address))) {
                break;
            }
        }
    }
    return match;
};

/** strip unecessary user data from db result as page request
 * @param {Object} d the db returned object to be trimed
 * @param {Object} path the requested page / path
 * @return {Object} stripped datas
 */
Auth.prototype.stripD = function(d, path) {
    let par = {};
    par['assets'] = ['_id', 'socketid'];
    par['profile'] = ['_id', 'socketid', 'assets'];
    par['index'] = ['_id', 'socketid', 'assets'];
    par['login'] = ['_id', 'socketid', 'assets'];
    par['logsock'] = ['socketid', 'username', 'useremail', 'ethaddr',
        'usercurrency',
        'assets',
    ];
    for (let el in par) {
        if (el === path) {
            for (let s in par[el]) {
                if (d.hasOwnProperty(par[el][s])) {
                    let todel = par[el][s];
                    delete d[todel];
                }
            }
            return d;
        }
    }
};

/** basically checking if a decrypted _id exist in user collection and
 * strip private fields from result
 * @param {Object} cuid encrypted userid
 * @param {string} path the requested path for stripD()
 * @return {Promise}
 */
Auth.prototype.checkUid = function(cuid, path) {
    let _this = this;
    return new Promise((resolve, reject) => {
        let who = new _this.ObjectID(cuid);
        _this.crud.finduser(who, function(res) {
            if (res) {
                _this.stripD(res, path);
                resolve(res);
            }
            reject(new Error('Bad Id'));
        });
    });
};

/** username /password checking method
 * @param {Object} data
 * @return {Promise}
 */
Auth.prototype.checkUsr = function(data) {
    let _this = this;
    return new Promise((resolve, reject) => {
        let value = data.iname.replace(/\W/g, '');
        let value1 = data.isocket;
        let toFind = {};
        toFind['username'] = value;
        toFind['socketid'] = value1;
        _this.crud.checkcred(toFind, function(result) {
            if (result) {
                _this.stripD(result, 'logsock');
                resolve(result);
            } else {
                reject(new Error('Bad user'));
            }
        });
    });
};

Auth.prototype.trimthisregfields = function(fields) {
    let _this = this;
    /** Name fields must be only alpha characters */
    fields.iname = fields.iname.replace(/\W/g, '');
    /** Email string must be better checked ! */
    fields.imail = fields.imail.trim();
    /** Telegram id must be only numeric */
    fields.iteleid = fields.iteleid ?
        fields.iteleid.replace('/\D/g,', '') :
        undefined;
    /** Email string must be better checked ! */
    fields.isocket = fields.isocket.trim();
    fields.ieth = _this.iscoinAddr(fields.ieth) ? fields.ieth : 'NONE';
    /** Final check !! */
    fields = fields.iname.length < 3 || fields.imail < 8 ?
        undefined : fields.isocket.length < 10 || fields.icurr.length !== 3 ?
        undefined : fields;
    return fields;
};

/**
 * @param {Object} d the client sent object
 * @return {Object} the checked object if valid or undefined otherwise
 */
Auth.prototype.checkRegFields = function(d) {
    if (!d.iname || !d.imail || !d.isocket) {
        return undefined;
    } else {
        d = this.trimthisregfields(d);
    }
    return d;
};

/** register a new user based on a toregister format
 * @param {Object} data
 * @return {Promise} result
 * @TODO : Make toRegister stick with r_usermodel
 */
Auth.prototype.registerUsr = function(data) {
    return new Promise((resolve, reject) => {
        let chk = this.checkRegFields(data);
        if (chk !== undefined) {
            let nu = {
                'username': chk.iname,
                'useremail': chk.imail,
                'telegramid': chk.iteleid,
                'socketid': chk.isocket,
                'ethaddr': chk.ieth,
                'usercurrency': chk.icurr,
            };
            this.crud.insert('r_users', nu, function(result, err) {
                if (result) {
                    resolve(result);
                }
                reject(err ?
                    new Error('Db Error \n' + JSON.stringify(err)) :
                    new Error('something failed with db..'));
            });
        } else {
            reject(new Error('Invalid data submitted'));
        }
    });
};

/** check user submitted registering data object
 * @param {Object} data the user submitted datas
 * @param {Object} socket the socket object to get socket id
 * @param {Object} io the io object to send response to client
 */
Auth.prototype.checkRegData = function(data, socket, io) {
    if (data && data.iname && data.imail && data.isocket) {
        if (data.ieth && data.icurr) {
            this.registerUsr(data).then((res) => {
                let u = socket.id;
                let nmsg = {
                    msg: 'Ok redirecting you to login page',
                };
                io.of('/register').to(u).emit('nm', nmsg);
                return true;
            }).catch((rej, err) => {
                let log = rej.message;
                process.env.NODE_ENV === 'development' ? console.log(log) : log;
                let emsg = {
                    msg: rej.message,
                };
                let u = socket.id;
                io.of('/register').to(u).emit('em', emsg);
                return false;
            });
        }
    }
};

/** check user submitted login data object
 * @param {Object} data the user submitted datas
 * @param {Object} socket the socket object to get socket id
 * @param {Object} io the io object to send response to client
 * @return {bool}
 */
Auth.prototype.checkcoData = function(data, socket, io) {
    let _this = this;
    if (data['iname'] && data['isocket']) {
        _this.checkUsr(data).then(function(res) {
            let enc = _this.crypt.encryptuid(res);
            enc = encodeURIComponent(enc);
            let resp = {
                _id: enc,
            };
            process.env.NODE_ENV === 'development' ? console.log(resp) : resp;
            io.of('/auth').to(socket.id).emit('nm', resp);
            return true;
        }).catch(function(rej, err) {
            console.error(rej);
            let emsg = {
                errmsg: rej.message,
            };
            io.of('/auth').to(socket.id).emit('em', emsg);
            return false;
        });
    }
    return false;
};

/** check if eUid is a valid encrypted uid
 * @param {string} eUid the user submitted datas
 * @param {string} page the requested page for trimming accordingly by
 * {@link Auth#stripD}
 * @see Crypt
 * @return {Promise} parsed user info if sucess new Error otherwise
 */
Auth.prototype.userisAuth = function(eUid, page) {
    let cuid;
    let _this = this;
    eUid = this.isEncoded(eUid) ? decodeURIComponent(eUid) : eUid;
    cuid = eUid ? this.crypt.decryptuid(eUid) : undefined;
    return new Promise((resolve, reject) => {
        if (cuid === undefined) {
            reject(new Error('user not found'));
        } else {
            _this.checkUid(cuid, page).then((res) => {
                resolve(res);
            }).catch((rej, err) => {
                if (err) {
                    throw err;
                }
                reject(new Error('user not found'));
            });
        }
    });
};

/** Check an encrypted Uid for validity
 * @param {string} eUid
 * @return {boolean} true if true , false if false ;)
 */
Auth.prototype.isvaliduid = function(eUid) {
    let _this = this;
    eUid = _this.isEncoded(eUid) ? decodeURIComponent(eUid) : null;
    if (eUid != null) {
        return !!_this.crypt.decryptuid(eUid);
    } else {
        return false;
    }
};

module.exports = Auth;
/** Login and register account methods
 * @module auth
 */
