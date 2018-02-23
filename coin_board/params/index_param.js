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
		jumbo		: 'blocks/my_jumbotron',
		ticker		: 'blocks/ticker_panel',
		livestream	: 'blocks/tradestream'
	}
};

module.exports = param;
