/**
* @file Index view params
* @author Trevis Gulby
*/

var cdn = 'https://cdnjs.cloudflare.com/ajax/libs/socket.io/2.0.4/socket.io.js';
const param = {
	title	: 'Coin_Board',
	author	: '© Copyright 2018 coin_board',
	page	: 'index',
	scripts	: {
		socket	: cdn,
		trade 	: 'tradestream.js'
	},
	blocks : {
		jumbo		: 'blocks/all/my_jumbotron',
		ticker		: 'blocks/index/ticker_panel',
		livestream	: 'blocks/index/tradestream'
	}
};

module.exports = param;
