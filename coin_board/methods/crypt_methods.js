/**
* @file @Crypt methods definitions
* @author based on express boilerplate and edited by Trevis Gulby
*/

/** dep import */
const CryptoJS = require( 'crypto-js' );

/**
*@brief Crypt class contructor
*/
function Crypt() {}

/**
* @param {string} p
* @return {string}
*/
function dcryptParams( p ) {
        let plaintext = null;
        if ( p ) {
                /** @TODO lolilol to be randomized */
                let enckey = 'yolo 123';
                let bytes = CryptoJS.AES.decrypt( p, enckey );
                plaintext = bytes.toString( CryptoJS.enc.Utf8 );
                let log = 'auth_methods.js|dcryptParams()\n';
                log += '==== (TODO :update enckey)\n plaintext if succeed [ ';
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
        /** @TODO lolilol to be randomized */
        let enckey = 'yolo 123';
        let toenc = p._id.toString();
        let citxt = CryptoJS.AES.encrypt( toenc, enckey );
        let enc = citxt.toString();
        let log = 'auth_methods.js|encryptParams(p)\n';
        log += '==== (TODO :update enckey)\n => enc str if succeed [ ';
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

module.exports = Crypt;
