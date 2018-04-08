/**
* @file Crypt methods definitions
* @author Trevis Gulby
*/

/** CryptoJS dependency import for AES usage */
const CryptoJS = require( 'crypto-js' );
/** fs dep import for reding and writing encryption secret */
const fs = require( 'fs' );

/** Crypt module , handle all the encrypt / infosec tasks
* @module Crypt
*/
/** module::Crypt~Crypt  Crypt module constructor */
function Crypt() {}

/** Pretty much self explanatory */
function cleartmp() {
        ROOT_APP_PATH = fs.realpathSync( '.' );
        fs.unlink( 'log.txt', ( err ) => {
                if ( err ) {
                        throw err;
                }
                let log = 'Delete old cookie secret';
                process.env.NODE_ENV == 'development'
                        ? console.log( log )
                        : log;
        } );
}

/**
* Read tmp for new random key
* @return {string} the readed buffer
*/
function readtmp() {
        let buff = new Buffer( 22 );
        buff = fs.readFileSync( 'log.txt', 'ascii' );
        let log = 'Read cookie secret : [';
        log += buff.toString().trim() + ']';
        process.env.NODE_ENV == 'infosec'
                ? console.log( log )
                : log;
        return buff.toString();
}

/**
* Write tmp
* @param {string} res encryption secret
*/
function writetmp( res ) {
        ROOT_APP_PATH = fs.realpathSync( '.' );
        fs.writeFile( 'log.txt', res + '\n', function( err ) {
                if ( err ) {
                        return console.log( err );
                }
                let log = 'Write new cookie secret';
                process.env.NODE_ENV == 'infosec'
                        ? console.log( log )
                        : log;
        } );
}

/**
* Extract 85 char buffer from host /dev/urandom
* @param {function} callback
* @return {string} 22 bytes of 85 bytes random chars buffer
*/
function getRandom( callback ) {
        return new Promise( ( resolve, reject ) => {
                fs.open( '/dev/urandom', 'r', function( status, fd ) {
                        if ( status ) {
                                console.log( status.message );
                                reject( new Error( 'file reading failed' ) );
                        }
                        let buff = new Buffer( 85 );
                        fs.read( fd, buff, 0, 85, 0, function( err, res ) {
                                let randstr = buff.toString( 'ascii', 0, res );
                                randstr = randstr.replace( /\W/g, '' );
                                randstr = randstr.length > 22
                                        ? randstr.substring( 0, 22 )
                                        : randstr;
                                callback && callback( randstr );
                                resolve( randstr );
                        } );
                } );
        } );
}

/**
* Take a string p, and try decryption with 'log.txt' secret
* @param {string} p the string to be decrypted
* @return {string} plaintext, the decrypted p param
*/
function dcryptParams( p ) {
        let plaintext = null;
        if ( p ) {
                let enckey = readtmp();
                try {
                        let bytes = CryptoJS.AES.decrypt( p, enckey );
                        plaintext = bytes.toString( CryptoJS.enc.Utf8 );
                } catch ( err ) {
                        return plaintext;
                }
                let log = 'auth_methods.js|dcryptParams()\n';
                log += '====Plaintext if succeed [ ';
                log += plaintext + ' ]';
                process.env.NODE_ENV == 'infosec'
                        ? console.log( log )
                        : log;
        }
        return plaintext;
}

/**
* Take a p plaintext string and encrypt it with AES
* and the 'log.txt' secret
* @param {string} p the string to be encrypt (the user db uuid mostly)
* @return {string} the encrypted string
*/
function encryptParams( p ) {
        let enckey = readtmp();
        let toenc = p._id.toString();
        let citxt = CryptoJS.AES.encrypt( toenc, enckey );
        let enc = citxt.toString();
        let log = 'auth_methods.js|encryptParams(p)\n';
        log += '=====> enc str if succeed [ ';
        log += enc + ' ]';
        process.env.NODE_ENV == 'infosec'
                ? console.log( log )
                : log;
        return enc;
}

Crypt.prototype.isvaliduid = function( eUid ) {
        let test = dcryptParams( eUid );
        return test
                ? true
                : false;
};

Crypt.prototype.decryptuid = function( eUId ) {
        let ctext = dcryptParams( eUId );
        return ctext;
};

Crypt.prototype.encryptuid = function( cUId ) {
        let etext = encryptParams( cUId );
        return etext;
};

Crypt.prototype.genrandomtocken = function() {
        cleartmp();
        getRandom().then( function( res ) {
                if ( res ) {
                        writetmp( res );
                        return res;
                }
        } ).catch( function( rej, err ) {
                if ( err || rej ) {
                        throw err;
                }
        } );
};

module.exports = Crypt;
