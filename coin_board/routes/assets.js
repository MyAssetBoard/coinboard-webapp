/**
* @file @Register_assets page route methods definitions
* @author based on express boilerplate and edited by Trevis Gulby
*/

const express = require( 'express' );
const router = express.Router();
const Auth = require( '../methods/auth_methods' );
const param = require( '../params/myassets_param' );

/* GET assets page. */
router.get( '/', function( req, res, next ) {
        let chck = req.cookies;

        if ( chck && chck.uid ) {
                let log = '/MYASSETS-route : Auth user, session below\n[';
                log += JSON.stringify( chck ) + ']';
                process.env.NODE_ENV == 'development'
                        ? console.log( log )
                        : log;
                const auth = new Auth();
                auth.userisAuth( chck.uid, 'assets' ).then( function( result ) {
                        let dup = param;
                        let log = 'myassets| push user info in params\n[';
                        res.locals.data = result;
                        /* istanbul ignore next */
                        log += JSON.stringify( res.locals.data ) + ']';
                        /* istanbul ignore next */
                        process.env.NODE_ENV == 'development'
                                ? console.log( log )
                                : log;
                        res.render( 'page', dup );
                } ).catch( function( err ) {
                        if ( err ) {
                                throw err;
                        }
                        next( err );
                } );
        } else {
                /* istanbul ignore next */
                log = 'myassets-route| NonAUth user, session below\n[';
                log += JSON.stringify( chck ) + '] cookie ? [';
                log += JSON.stringify( req.cookies ) + ']';
                /* istanbul ignore next */
                process.env.NODE_ENV == 'development'
                        ? console.log( log )
                        : log;
                res.render( 'page', param );
        }
} );

module.exports = router;
