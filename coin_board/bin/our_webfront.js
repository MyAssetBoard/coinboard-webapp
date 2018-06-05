/**
 * @file Main runable executable for {@link module:cbview~CbView} service
 * @author Based on Express app and edited by Trevis Gulby
 * @license MIT
 */

/** A new CoinboardWebfront object / service
 * @class
 */
class CbView {
	/** @constructor */
	constructor() {
		let _this = this;
		/** Main {@link CbExpressApp} module import */
		this.app = require('../controllers/router_methods');
		/** debug function see [Morgan] */
		this.debug = require('debug')('coin-board:server');
		/** The essential one ;) */
		this.https = require('https');
		/** For Heroku staging deployment */
		this.http = require('http');
		/** Creds import */
		this.AppConfig = require('../controllers/config_methods');
		this.conf = new this.AppConfig();
		/** Get port from environment and store in Express. */
		this.port = process.env.PORT || '3000';
		this.app.set('port', _this.port);
		/** Create HTTPS server.*/
		if (process.env.HEROKU === 'ok') {
			this.server = this.http.createServer(_this.app);
		} else {
			this.server = this.https.createServer(_this.conf.httpsc(), _this.app);
		}
		/** Event listener for HTTP server */
		this.onListening = function () {
			let addr = _this.server.address();
			let bind = typeof addr === 'string' ?
				'pipe ' + addr :
				'port ' + addr.port;
			_this.debug('Listening on ' + bind);
		};
	}
}


/** Event listener for HTTP server "error" event.
 * @param {Object} error throwed error from pages
 */
CbView.prototype.onError = function (error) {
	if (error.syscall !== 'listen') {
		let log = 'On error catch !';
		process.env.NODE_ENV === 'development' ?
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

/** Main launcher function for coinboard view service
 * @property {function } server.listen listen on provided port,
 * on all network interfaces.
 */
CbView.prototype.lightmyfire = function () {
	let _this = this;
	let log = 'WEB_VIEW - coin_board view micro service started';
	process.env.NODE_ENV === 'development' ?
		console.log(log) :
		log;
	this.server.listen(_this.port, _this.addr, function () {
		let log = 'WEB_VIEW - server is listening on :\n';
		console.log(_this.server.address());
		log += 'addr: [' + _this.server.address().address +
			'], port ' + _this.port;
		process.env.NODE_ENV === 'development' ?
			console.log(log) :
			log;
	});
	this.server.on('error', this.onError);
	this.server.on('listening', this.onListening);
};

/** Main launcher for CbView service */
const miwebview = new CbView();
miwebview.lightmyfire();
/** ### Coin_Board Main view service
 * @module cbview
 */
