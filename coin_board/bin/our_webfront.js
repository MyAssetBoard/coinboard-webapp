/**
* @file Main runable executable for app
* @author base on Express app and edited by Trevis Gulby
*/

/** Module dependencies.*/
var app;
var debug;
var http;

app = require('../app');
debug = require('debug')('coin-board:server');
http = require('http');

/** Get port from environment and store in Express. */
var port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

/** Create HTTP server.*/

var server = http.createServer(app);
var log = 'WEB_VIEW - coin_board micro service started';
process.env.NODE_ENV == 'development' ? console.log(log) : log;


/** Listen on provided port, on all network interfaces. */
server.listen(port, "192.168.0.11", function () {
	var log = 'WEB_VIEW - server is listening';
	process.env.NODE_ENV == 'development' ? console.log(log) : log;
});
server.on('error', onError);
server.on('listening', onListening);


/** Normalize a port into a number, string, or false.*/
function normalizePort(val) {
	var port = parseInt(val, 10);

	if (isNaN(port)) {
		// named pipe
		return val;
	}

	if (port >= 0) {
		// port number
		return port;
	}

	return false;
}

/** Event listener for HTTP server "error" event.*/
function onError(error) {
	if (error.syscall !== 'listen') {
		var log = 'On error catch !';
		process.env.NODE_ENV == 'development' ? console.log(log) : log;
		throw error;
	}

	var bind = typeof port === 'string'
		? 'Pipe ' + port
		: 'Port ' + port;

	// handle specific listen errors with friendly messages
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
}

/** Event listener for HTTP server "listening" event. */
function onListening() {
	var addr = server.address();
	var bind = typeof addr === 'string'
		? 'pipe ' + addr
		: 'port ' + addr.port;
	debug('Listening on ' + bind);
}

module.exports = app;
