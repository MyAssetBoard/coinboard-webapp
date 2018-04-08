/**
* @file Assets methods definition (use crud module)
* @author Trevis Gulby
*/

/** Crud methods import */
const Crud = require( '../methods/mongo_crud' );
/** Crypt methods import */
const Crypt = require( '../methods/crypt_methods' );

/** check if
* @param {string} str is an encoded param
* @return {bool} true if true false if not ;)
*/
function isEncoded( str ) {
        try {
                decodeURIComponent( str );
        } catch ( e ) {
                if ( e ) {
                        return false;
                }
        }
        return true;
}

/**
 * A new Asset object
 * @class
 * @constructor
 */
function Assets() {}

/** Add assets to a user
* @param {Object} a new client assets data to be recorded
* @return {Promise} result if success new Error otherwise
*/
Assets.prototype.addAssets = function( a ) {
        return new Promise( ( resolve, reject ) => {
                let crypt = new Crypt();
                a.ticker = a.ticker.replace( /\W/g, '' );
                a.qtt = typeof a.qtt === 'string'
                        ? a.qtt.replace( '(\\d)+\\.(\\d+)', '' )
                        : a.qtt;
                a.qtt = a.qtt
                        ? parseFloat( a.qtt )
                        : 0.00;
                a.id = isEncoded( a.id )
                        ? decodeURIComponent( a.id )
                        : null;
                a.id = a.id
                        ? crypt.decryptuid( a.id )
                        : null;

                let data = {
                        'symbol': a.ticker,
                        'qtt': a.qtt,
                };
                if ( a.id && a.qtt ) {
                        let crud = new Crud( 'test2', 'r_users' );
                        crud.update( a.id, 'assets', data, function( result ) {
                                if ( result ) {
                                        resolve( result );
                                }
                                reject( new Error( 'Db Error' ) );
                        } );
                } else if ( !a.qtt ) {
                        reject( new Error( 'Invalid quantity' ) );
                } else {
                        reject( new Error( 'Wrong request' ) );
                }
        } );
};

/** check user supplied assets
* @param {Object} data new client assets data to be recorded
* @param {Objet} socket the socket object to get the receiver id
* @param {Object} io  the io object to send response
* @return {bool} true if success false otherwise
*/
Assets.prototype.checkAssetData = function( data, socket, io ) {
        if ( data['ticker'] && data['qtt'] && data['id'] ) {
                let asset = new Assets();
                asset.addAssets( data ).then( function( res ) {
                        let nm = {};
                        nm.msg = data.ticker + ' successfully added';
                        io.of( '/assets' ).to( socket.id ).emit( 'nm', nm );
                        return true;
                } ).catch( function( rej, err ) {
                        console.error( rej.message );
                        let emsg = {};
                        emsg.errcode = 23;
                        emsg.msg = rej.message;
                        io.of( '/assets' ).to( socket.id ).emit( 'em', emsg );
                        if ( err ) {
                                throw ( err );
                        }
                        return false;
                } );
        }
        return false;
};

/** Asset Module
* @module Assets
*/
module.exports = Assets;
