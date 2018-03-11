/**
* @file @Register_assets page route methods definitions
* @author based on express boilerplate and edited by Trevis Gulby
*/

const express = require( 'express' );
const router = express.Router();
const Auth = require( '../methods/auth_methods' );
const param = require( '../params/myassets_param' );
const roads = require( './assets/assets_roads' );
const auth = new Auth();

function setpagecontent( req ) {
        return new Promise( ( resolve, reject ) => {
                let res = {};
                for ( let property in roads ) {
                        if ( roads[property].path == req.originalUrl ) {
                                if ( roads[property].func ) {
                                        res.fn = roads[property].func;
                                }
                        }
                }
                if ( res.fn ) {
                        res.fn( function( r ) {
                                if ( r ) {
                                        resolve( r );
                                }
                        } );
                } else {
                        resolve( 'nop' );
                }
        } );
}

/* GET assets page. */
router.get( '/*', function( req, res, next ) {
        let chck = req.cookies;

        if ( chck && chck.uid && auth.isvaliduid( chck.uid ) ) {
                let log = req.originalUrl + '-route : Auth user, session below\n[';
                log += JSON.stringify( chck ) + ']';
                process.env.NODE_ENV == 'development'
                        ? console.log( log )
                        : log;
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
                        setpagecontent( req ).then( function( d ) {
                                if ( d != 'nop' ) {
                                        res.locals.routes = {
                                                a: d.block,
                                        };
                                        if ( d.feed ) {
                                                res.locals.news = d.feed;
                                        }
                                }
                                res.render( 'page', dup );
                        } ).catch( function( rej, err ) {
                                if ( err ) {
                                        reject( err );
                                        throw err;
                                }
                        } );
                } ).catch( function( rej, err ) {
                        next( err );
                } );
        } else {
                /* istanbul ignore next */
                log = req.originalUrl + '-route| NonAUth user, session below\n[';
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
