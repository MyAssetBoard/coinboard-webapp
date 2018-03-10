/**
* @file @Register_assets page route methods definitions
* @author based on express boilerplate and edited by Trevis Gulby
*/

const express = require( 'express' );
const router = express.Router();
const Auth = require( '../methods/auth_methods' );
const DataJunk = require( '../bin/data_junk' );
const auth = new Auth();
const data = new DataJunk();
const param = require( '../params/myassets_param' );

const roads = {
        a: {
                path: '/assets/dashboard',
                block: 'centerblock_dashboard',
                func: function( callback ) {
                        let xx = {
                                block: 'centerblock_dashboard',
                        };
                        callback && callback( res );
                },
        },
        b: {
                path: '/assets/infofeed',
                block: 'centerblock_infofeed',
                func: function( callback ) {
                        data.pukedata( {} ).then( function( r ) {
                                let xx = {
                                        block: 'centerblock_infofeed',
                                        feed: r[0].feed,
                                };
                                callback && callback( xx );
                        } );
                },
        },
        c: {
                path: '/assets/pricefeed',
                block: 'centerblock_pricefeed',
                func: function( callback ) {
                        let xx = {
                                block: 'centerblock_pricefeed',
                        };
                        callback && callback( res );
                },
        },
        d: {
                path: '/assets/trade',
                block: 'centerblock_pricefeed',
                func: function( callback ) {
                        let xx = {
                                block: 'centerblock_pricefeed',
                        };
                        callback && callback( res );
                },
        },
        e: {
                path: '/assets/api/param',
                block: 'centerblock_pricefeed',
                func: function( callback ) {
                        let xx = {
                                block: 'centerblock_pricefeed',
                        };
                        callback && callback( res );
                },
        },
        f: {
                path: '/assets/trade/reports/currm',
                block: 'centerblock_pricefeed',
                func: function( callback ) {
                        let xx = {
                                block: 'centerblock_pricefeed',
                        };
                        callback && callback( res );
                },
        },
        g: {
                path: '/assets/trade/reports/currquart',
                block: 'centerblock_pricefeed',
                func: function( callback ) {
                        let xx = {
                                block: 'centerblock_pricefeed',
                        };
                        callback && callback( res );
                },
        },
        h: {
                path: '/assets/trade/reports/crowddata',
                block: 'centerblock_pricefeed',
                func: function( callback ) {
                        let xx = {
                                block: 'centerblock_pricefeed',
                        };
                        callback && callback( res );
                },
        },
};

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
