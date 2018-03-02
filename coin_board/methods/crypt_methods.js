/**
* @file @Crypt methods definitions
* @author based on express boilerplate and edited by Trevis Gulby
*/

/** dep import */
const CryptoJS = require( 'crypto-js' );
const fs = require( 'fs' );

/**
*@brief Crypt class contructor
*/
function Crypt() {}

/** self explanatory
*/
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

/** Read tmp for new random key
* @return {string}
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

/** write tmp
*@param {string} res
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
/** Extract buffer from dev.urandom
* @param {function} callback
* @return {string} 85 byte of random char
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
* @param {string} p
* @return {string}
*/
function dcryptParams( p ) {
        let plaintext = null;
        if ( p ) {
                let enckey = readtmp();
                let bytes = CryptoJS.AES.decrypt( p, enckey );
                plaintext = bytes.toString( CryptoJS.enc.Utf8 );
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
* @param {string} p
* @return {string}
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
