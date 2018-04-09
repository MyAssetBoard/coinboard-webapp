/**
 * @file Crypt methods definitions
 * @author Trevis Gulby
 */

/** Wow so much methods !
 * @class
 */
class Crypt {
    /** @constructor */
    constructor() {
        /**
         * [CryptoJS](https://github.com/brix/crypto-js) module import
         * for AES usage
         */
        this.CryptoJS = require('crypto-js');
        /**
         *[Fs](https://nodejs.org/api/fs.html) module import
         * for reading and writing encryption secret
         */
        this.fs = require('fs');
    }
}

/** Pretty much self explanatory, delete old generated key if any */
Crypt.prototype.cleartmp = function() {
    ROOT_APP_PATH = this.fs.realpathSync('.');
    this.fs.unlink('log.txt', (err) => {
        if (err) {
            throw err;
        }
        let log = 'Delete old cookie secret';
        process.env.NODE_ENV == 'development' ?
            console.log(log) :
            log;
    });
};

/**
 * Read ./log.txt for new random key
 * @return {string} the readed buffer, 22 bytes long
 */
Crypt.prototype.readtmp = function() {
    let buff = new Buffer(22);
    buff = this.fs.readFileSync('log.txt', 'ascii');
    let log = 'Read cookie secret : [';
    log += buff.toString().trim() + ']';
    process.env.NODE_ENV == 'infosec' ?
        console.log(log) :
        log;
    return buff.toString();
};

/**
 * Write res buffer to temp location (for now as './log.txt')
 * @param {string} res encryption secret
 */
Crypt.prototype.writetmp = function(res) {
    ROOT_APP_PATH = this.fs.realpathSync('.');
    this.fs.writeFile('log.txt', res + '\n', function(err) {
        if (err) {
            return console.log(err);
        }
        let log = 'Write new cookie secret';
        process.env.NODE_ENV == 'infosec' ?
            console.log(log) :
            log;
    });
};

/**
 * Extract 85 char buffer from host /dev/urandom thanks to
 * {@link Crypt#fs} imported module
 * @param {function} callback
 * @return {string} 22 bytes of 85 bytes random chars buffer
 */
Crypt.prototype.getRandom = function(callback) {
    let _this = this;
    return new Promise((resolve, reject) => {
        _this.fs.open('/dev/urandom', 'r', function(status, fd) {
            if (status) {
                console.log(status.message);
                reject(new Error('file reading failed'));
            }
            let buff = new Buffer(85);
            _this.fs.read(fd, buff, 0, 85, 0, function(err, res) {
                let randstr = buff.toString('ascii', 0, res);
                randstr = randstr.replace(/\W/g, '');
                randstr = randstr.length > 22 ?
                    randstr.substring(0, 22) :
                    randstr;
                callback && callback(randstr);
                resolve(randstr);
            });
        });
    });
};

/**
 * Take a string p, and try Aes decryption with 'log.txt' secret
 * @param {string} p the string to be decrypted
 * @return {string} the decrypted p param as a cleartext string
 */
Crypt.prototype.dcryptParams = function(p) {
    let plaintext = null;
    if (p) {
        let enckey = this.readtmp();
        try {
            let bytes = this.CryptoJS.AES.decrypt(p, enckey);
            plaintext = bytes.toString(this.CryptoJS.enc.Utf8);
        } catch (err) {
            return plaintext;
        }
        let log = 'auth_methods.js|dcryptParams()\n';
        log += '====Plaintext if succeed [ ';
        log += plaintext + ' ]';
        process.env.NODE_ENV == 'infosec' ?
            console.log(log) :
            log;
    }
    return plaintext;
};

/**
 * Take a p plaintext string read the 'log.txt' encryption secret with
 * {@link Crypt#readtmp} method, encrypt-it thanks to {@link Crypt#CryptoJS}
 * imported module and finally put the result to string before returning it.
 * @param {string} p the string to be encrypt (the user db uuid mostly)
 * @return {string} the encrypted string
 */
Crypt.prototype.encryptParams = function(p) {
    let enckey = this.readtmp();
    let toenc = p._id.toString();
    let citxt = this.CryptoJS.AES.encrypt(toenc, enckey);
    let enc = citxt.toString();
    let log = 'auth_methods.js|encryptParams(p)\n';
    log += '=====> enc str if succeed [ ';
    log += enc + ' ]';
    process.env.NODE_ENV == 'infosec' ?
        console.log(log) :
        log;
    return enc;
};

/** Simple helper function around {@link Crypt#dcryptParams} method
 * @param {string} eUid the string to be checked
 * @return {bool} true if valid euid false otherwise
 */
Crypt.prototype.isvaliduid = function(eUid) {
    let test = this.dcryptParams(eUid);
    return test ?
        true :
        false;
};

/** Decrypt and AES encrypted user id with {@link Crypt#dcryptParams} method
 * @param {string} eUId the string to be decrypted
 * @return {string} the decrypted user id
 * @see Crypt#dcryptParams
 */
Crypt.prototype.decryptuid = function(eUId) {
    let ctext = this.dcryptParams(eUId);
    return ctext;
};

/** Aes encrypt a user id with {@link Crypt#encryptParams} method
 * @param {string} cUId the string to be encrypted
 * @return {string} the encrypted user id
 * @see Crypt#encryptParams
 */
Crypt.prototype.encryptuid = function(cUId) {
    let etext = this.encryptParams(cUId);
    return etext;
};

/**
 * Clear any old generated key with {@link Crypt#cleartmp} if any,
 * generate a new random string for Aes secret in {@link Crypt#getRandom} ,
 * and finally write as 'log.txt' file in current directory thanks to
 * {@link Crypt#writetmp}
 */
Crypt.prototype.genrandomtocken = function() {
    let _this = this;
    this.cleartmp();
    this.getRandom().then(function(res) {
        if (res) {
            _this.writetmp(res);
            return res;
        }
    }).catch(function(rej, err) {
        if (err || rej) {
            throw err;
        }
    });
};

module.exports = Crypt;
/** All crypto related methods
 * @module Crypt
 */
