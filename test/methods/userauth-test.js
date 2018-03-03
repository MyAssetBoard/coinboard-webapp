/**
* @file Unit test file for index route functions
* @author base on Express app and edited by Trevis Gulby
*/

const request = require( 'supertest' );
const app = require( '../../coin_board/app' );
const encuid = 'U2FsdGVkX19Qw8U0ksGrlaBPe5iKKhzTIoMewLn3L3sCneFkaeycy09%2Fnp2uB6cz';
const base_url = '/login/id/';
const test_rdurl = base_url + 'R26536536565NDOMM';
const test_valrul = base_url + encuid;
let Cookies;

describe( 'Simple GET ' + test_valrul, function() {
        it( 'it respond with 403', function( done ) {
                request( app ).get( test_valrul ).set( 'Accept', 'application/json' ).expect( 403 ).end( function( err ) {
                        if ( err ) {
                                return done( err );
                        }
                        done();
                } );
        } );
        it( 'it respond with 200 and have cookies', function( done ) {
                let req = request( app ).get( '/login' );
                req.cookies = Cookies;
                req.set( 'Accept', 'application/json' ).expect( 200 ).end( function( err ) {
                        let log = 'SUPERTEST== Cookies set ?\n';
                        log += JSON.stringify( req.cookies );
                        process.env.NODE_ENV == 'development'
                                ? console.log( log )
                                : log;
                        if ( err ) {
                                return done( err );
                        }
                        done();
                } );
        } );
} );
describe( 'Simple GET ' + test_rdurl, function() {
        it( 'respond with 403', function( done ) {
                let req = request( app ).get( test_rdurl );
                req.set( 'Accept', 'application/json' ).expect( 403 ).end( function( err ) {
                        if ( err ) {
                                return done( err );
                        }
                        done();
                } );
        } );
} );
