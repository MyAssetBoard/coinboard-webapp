/**
 * @file Crypt methods definitions
 * @author Trevis Gulby
 */

/**
 * A new Crypt object
 * @class
 * @constructor
 */
function Crypt() {
    /** CryptoJS dependency import for AES usage */
    this.CryptoJS = require('crypto-js');
    /** fs dep import for reding and writing encryption secret */
    this.fs = require('fs');
}

/** Pretty much self explanatory */
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
 * Read tmp for new random key
 * @return {string} the readed buffer
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
 * Write tmp
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
 * Extract 85 char buffer from host /dev/urandom
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
 * Take a string p, and try decryption with 'log.txt' secret
 * @param {string} p the string to be decrypted
 * @return {string} plaintext, the decrypted p param
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
 * Take a p plaintext string and encrypt it with AES
 * and the 'log.txt' secret
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

Crypt.prototype.isvaliduid = function(eUid) {
    let test = this.dcryptParams(eUid);
    return test ?
        true :
        false;
};

Crypt.prototype.decryptuid = function(eUId) {
    let ctext = this.dcryptParams(eUId);
    return ctext;
};

Crypt.prototype.encryptuid = function(cUId) {
    let etext = this.encryptParams(cUId);
    return etext;
};

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
