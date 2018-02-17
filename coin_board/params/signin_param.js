/**
* @file signin view params
* @author Trevis Gulby
*/

var cdn = 'https://cdnjs.cloudflare.com/ajax/libs/socket.io/2.0.4/socket.io.js';
var cdn1 = 'https://cdn.jsdelivr.net/npm/web3@0.19.0/dist/web3.min.js';


const param = {
	title	: 'Signin',
	author	: '© Copyright 2018 coin_board ;)',
	page	: 'signin',
	scripts	: {
		socketio	: cdn,
		web3cdn		: cdn1,
		myweb3		: 'web3_checkaddress.js',
		mysocket	: 'signin_socket.js'
	},
	blocks : {
		jumbo		: 'blocks/my_jumbotron',
		topblock	: 'blocks/signin_block'
	}
};

module.exports = param;
