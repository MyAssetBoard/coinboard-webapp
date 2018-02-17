var cdn = 'https://cdnjs.cloudflare.com/ajax/libs/socket.io/2.0.4/socket.io.js';

const param = {
	title	: 'Login',
	author	: '© Copyright 2018 coin_board ;)',
	page	: 'login',
	scripts	: {
		socketio	: cdn,
		mysocket	: 'auth_socket.js'
	},
	blocks : {
		jumbo		: 'blocks/my_jumbotron',
		topblock	: 'blocks/login_block'
	}
};

module.exports = param;
