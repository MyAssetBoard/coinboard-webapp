var cdn = 'https://cdnjs.cloudflare.com/ajax/libs/socket.io/2.0.4/socket.io.js';

const param = {
	title	: 'Signin',
	author	: '© Copyright 2018 coin_board ;)',
	page	: 'signin',
	scripts	: {
		socketio	: cdn,
		mysocket	: 'register_socket.js'
	},
	blocks : {
		jumbo		: 'blocks/my_jumbotron',
		topblock	: 'blocks/signin_block'
	}
};

module.exports = param;
