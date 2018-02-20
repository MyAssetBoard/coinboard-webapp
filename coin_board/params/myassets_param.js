/**
* @file My assets view params
* @author Trevis Gulby
*/

var iocdn = 'https://cdnjs.cloudflare.com/ajax/libs/socket.io/2.0.4/socket.io.js';
var chartcdn = 'https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.7.1/Chart.min.js';
var tickers = require('../../tmpdata/tickers');

const param = {
	title	: 'My assets',
	author	: '© Copyright 2018 coin_board',
	page	: 'assets',
	scripts	: {
		socketio: iocdn,
		chartio: chartcdn,
		manage	: 'assets_management.js'
	},
	blocks : {
		jumbo	: 'blocks/my_jumbotron',
		assets	: 'blocks/my_assets'
	},
	symb	: tickers
};

module.exports = param;
