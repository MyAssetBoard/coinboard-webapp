const DataJunk = require( '../../bin/data_junk' );
const data = new DataJunk();
const roads = {
        a: {
                path: '/assets/dashboard',
                getd: function( callback ) {
                        let xx = {
                                blocks: ['cb_db'],
                        };
                        callback && callback( xx );
                },
        },
        b: {
                path: '/assets/infofeed',
                getd: function( callback ) {
                        data.pukedata( {} ).then( function( res ) {
                                let mine = data.eat( res );
                                let rt = {};
                                let fd = [];
                                for ( el in res ) {
                                        if ( res[el].feed ) {
                                                fd = fd.concat( res[el].feed );
                                        }
                                }
                                rt['blocks'] = ['cb_ifeed', 'cb_dmfeed.ejs'];
                                rt['feed'] = fd;
                                rt['dm'] = mine;
                                callback && callback( rt );
                        } );
                },
        },
        c: {
                path: '/assets/pricefeed',
                getd: function( callback ) {
                        let xx = {
                                blocks: ['cb_pfeed'],
                        };
                        callback && callback( xx );
                },
        },
        d: {
                path: '/assets/trade',
                getd: function( callback ) {
                        let xx = {
                                blocks: ['cb_pfeed'],
                        };
                        callback && callback( xx );
                },
        },
        e: {
                path: '/assets/api/param',
                getd: function( callback ) {
                        let xx = {
                                blocks: ['cb_pfeed'],
                        };
                        callback && callback( xx );
                },
        },
        f: {
                path: '/assets/trade/reports/currm',
                getd: function( callback ) {
                        let xx = {
                                blocks: ['cb_pfeed'],
                        };
                        callback && callback( xx );
                },
        },
        g: {
                path: '/assets/trade/reports/currquart',
                getd: function( callback ) {
                        let xx = {
                                blocks: ['cb_pfeed'],
                        };
                        callback && callback( xx );
                },
        },
        h: {
                path: '/assets/trade/reports/crowddata',
                getd: function( callback ) {
                        let xx = {
                                blocks: ['cb_pfeed'],
                        };
                        callback && callback( xx );
                },
        },
};

module.exports = roads;
