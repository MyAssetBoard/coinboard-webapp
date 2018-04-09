/**
 * @file Main runable executable for webview micro service
 * @author based on Express app and edited by Trevis Gulby
 */

/**
 * A new CoinboardWebfront object / service
 * @class
 */
class CbView {
    /** @constructor */
    constructor() {
        let _this = this;
        /** Module dependencies.*/
        this.app = require('../app');
        this.debug = require('debug')('coin-board:server');
        this.http = require('http');

        /**  listening address definition */
        this.os = require('os');
        this.ni = this.os.networkInterfaces();
        this.addr = process.env.SERV_ENV == 'local' ?
            this.ni.wlan0[0].address :
            this.ni.docker0[0].address;
        /** Get port from environment and store in Express. */
        this.port = process.env.PORT || '3000';
        this.app.set('port', this.port);
        /** Create HTTP server.*/
        this.server = this.http.createServer(this.app);
        /**
         * Event listener for HTTP server "error" event.
         * @param {Object} error throwed error from pages
         */
        this.onError = function(error) {
            if (error.syscall !== 'listen') {
                let log = 'On error catch !';
                process.env.NODE_ENV == 'development' ?
                    console.log(log) :
                    log;
                throw error;
            }

            let bind = typeof port === 'string' ?
                'Pipe ' + port :
                'Port ' + port;

            /** handle specific listen errors with friendly messages */
            switch (error.code) {
            case 'EACCES':
                console.error(bind + ' requires elevated privileges');
                process.exit(1);
                break;
            case 'EADDRINUSE':
                console.error(bind + ' is already in use');
                process.exit(1);
                break;
            default:
                throw error;
            }
        };
        /** Event listener for HTTP server */
        this.onListening = function() {
            let addr = _this.server.address();
            let bind = typeof addr === 'string' ?
                'pipe ' + addr :
                'port ' + addr.port;
            _this.debug('Listening on ' + bind);
        };
        let log = 'WEB_VIEW - coin_board view micro service started';
        process.env.NODE_ENV == 'development' ?
            console.log(log) :
            log;
        /** Listen on provided port, on all network interfaces. */
        this.server.listen(this.port, this.addr, function() {
            let log = 'WEB_VIEW - server is listening on :\n';
            log += 'addr: [' + _this.addr + '], port ' + _this.port;
            process.env.NODE_ENV == 'development' ?
                console.log(log) :
                log;
        });
        this.server.on('error', this.onError);
        this.server.on('listening', this.onListening);
    }
}

const miwebview = new CbView();
module.exports = miwebview.app;
