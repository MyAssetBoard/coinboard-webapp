/**
* @file Login view params
* @author Trevis Gulby
*/

const cdn = 'https://cdnjs.cloudflare.com/ajax/libs/socket.io/2.0.4/socket.io.js';
const cdn1 = 'https://cdnjs.cloudflare.com/ajax/libs/crypto-js/3.1.9-1/crypto-js.min.js';

const param = {
        title: 'Login',
        author: '© Copyright 2018 coin_board ;)',
        page: 'login',
        scripts: {
                socketio: cdn,
                cryptojs: cdn1,
                mysocket: 'auth_socket.js',
        },
        blocks: {
                jumbo: 'blocks/all/my_jumbotron',
                topblock: 'blocks/login/login_block',
        },
};

module.exports = param;
