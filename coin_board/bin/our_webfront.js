/**
* @file Main runable executable for webview micro service
* @author base on Express app and edited by Trevis Gulby
*/

/** Module dependencies.*/
const app = require( '../app' );
const debug = require( 'debug' )( 'coin-board:server' );
const http = require( 'http' );

/**  listening address definition */
const os = require( 'os' );
const ni = os.networkInterfaces();
const addr = ni.eth0[0].address;
/** Get port from environment and store in Express. */
const port = normalizePort( process.env.PORT || '3000' );
app.set( 'port', port );

/** Create HTTP server.*/

const server = http.createServer( app );
let log = 'WEB_VIEW - coin_board view micro service started';
process.env.NODE_ENV == 'development'
        ? console.log( log )
        : log;

/** Listen on provided port, on all network interfaces. */
server.listen( port, addr, function() {
        let log = 'WEB_VIEW - server is listening on :\n';
        log += 'addr: [' + addr + '], port ' + port;
        process.env.NODE_ENV == 'development'
                ? console.log( log )
                : log;
} );
server.on( 'error', onError );
server.on( 'listening', onListening );

/**
* Normalize a port into a number, string, or false.
* @param {number} val
* @return {number} val
*/
function normalizePort( val ) {
        let port = parseInt( val, 10 );

        if ( isNaN( port ) ) {
                // named pipe
                return val;
        }

        if ( port >= 0 ) {
                // port number
                return port;
        }

        return false;
}

/**
*Event listener for HTTP server "error" event.
* @param {Object} error
*/
function onError( error ) {
        if ( error.syscall !== 'listen' ) {
                let log = 'On error catch !';
                process.env.NODE_ENV == 'development'
                        ? console.log( log )
                        : log;
                throw error;
        }

        let bind = typeof port === 'string'
                ? 'Pipe ' + port
                : 'Port ' + port;

        // handle specific listen errors with friendly messages
        switch ( error.code ) {
                case 'EACCES':
                        console.error( bind + ' requires elevated privileges' );
                        process.exit( 1 );
                        break;
                case 'EADDRINUSE':
                        console.error( bind + ' is already in use' );
                        process.exit( 1 );
                        break;
                default:
                        throw error;
        }
}

/** Event listener for HTTP server "listening" event. */
function onListening() {
        let addr = server.address();
        let bind = typeof addr === 'string'
                ? 'pipe ' + addr
                : 'port ' + addr.port;
        debug( 'Listening on ' + bind );
}

module.exports = app;
