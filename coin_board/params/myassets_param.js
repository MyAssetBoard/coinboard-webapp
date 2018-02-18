/**
* @file My assets view params
* @author Trevis Gulby
*/

var cdn = 'https://cdnjs.cloudflare.com/ajax/libs/socket.io/2.0.4/socket.io.js';

const param = {
	title	: 'My assets',
	author	: '© Copyright 2018 coin_board',
	page	: 'assets',
	scripts	: {
		socketio: cdn,
		manage	: 'assets_management.js'
	},
	blocks : {
		jumbo	: 'blocks/my_jumbotron',
		assets	: 'blocks/my_assets'
	}
};

module.exports = param;
