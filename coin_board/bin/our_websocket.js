/**
* @file Main runable executable for websocket micro service
* @author based on socket.io doc app and edited by Trevis Gulby
*/

/** PORT to connect to */
const port = process.env.WSPORT || '3001';
const os = require( 'os' );
const ni = os.networkInterfaces();
const addr = ni.eth0[0].address;
/** SOCKET serv startup */
const http = require( 'http' );
const server = http.createServer();
server.listen( port, addr );
const io = require( 'socket.io' )( server );

/** NUMBER of connected sesion on each room */
let authco = 0;
let regco = 0;
let assetco = 0;

let log = 'WEBSOCKET - Runnnig';
process.env.NODE_ENV == 'development'
        ? console.log( log )
        : log;

/** dep import */
const Asset = require( '../methods/assets_methods' );
const Auth = require( '../methods/auth_methods' );

io.of( '/auth' ).on( 'connection', function( socket ) {
        let log;
        authco += 1;
        log = socket.id.replace( /\/auth#/g, 'User : ' );
        log += ' connected to [/auth] route | Connected : ' + authco;
        process.env.NODE_ENV == 'development'
                ? console.log( log )
                : log;
        let usrtmp = 'welcome ' + socket.id.replace( /\/auth#/g, 'user ' );
        let scktid = socket.id.replace( /\/auth#/g, '' );
        let comsg = {
                'msg': usrtmp,
                'scktid': scktid,
                'tot': authco,
        };
        let u = socket.id;
        io.of( '/auth' ).to( u ).emit( 'nm', comsg );
        socket.on( 'user login', function( data ) {
                const auth = new Auth();
                auth.checkcoData( data, socket, io );
        } );
        socket.on( 'disconnect', function() {
                authco -= 1;
        } );
} );

io.of( '/register' ).on( 'connection', function( socket ) {
        regco += 1;
        let log = socket.id.replace( /\/register#/g, 'User : ' );
        log += ' connected to [/register] route| Connected : ' + regco;
        process.env.NODE_ENV == 'development'
                ? console.log( log )
                : log;
        let scktid = socket.id.replace( /\/register#/g, '' );
        let comsg = {
                'scktid': scktid,
        };
        io.of( '/register' ).to( socket.id ).emit( 'nm', comsg );
        socket.on( 'user signin', function( data ) {
                let auth = new Auth();
                let log = 'received : \n' + JSON.stringify( data );
                process.env.NODE_ENV == 'development'
                        ? console.log( log )
                        : log;
                auth.checkRegData( data, socket, io );
        } );
        socket.on( 'disconnect', function() {
                regco -= 1;
        } );
} );

io.of( '/assets' ).on( 'connection', function( socket ) {
        let log = socket.id.replace( /\/register#/g, 'User : ' );
        assetco += 1;
        log += ' connected to [/assets] route| Connected : ' + assetco;
        process.env.NODE_ENV == 'development'
                ? console.log( log )
                : log;
        socket.on( 'add asset', function( d ) {
                let asset = new Asset();
                let log = 'add asset data returned :\n' + JSON.stringify( d );
                process.env.NODE_ENV == 'development'
                        ? console.log( log )
                        : log;
                asset.checkAssetData( d, socket, io );
        } );
        socket.on( 'disconnect', function() {
                assetco -= 1;
        } );
} );
