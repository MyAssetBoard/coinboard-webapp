/**
* @file Livestream view params
* @author Trevis Gulby
*/

const appvurl = process.env.SERV_ENV == 'onion'
        ? 'http://xu6ylq4kzadh7bcm.onion/'
        : 'http://localhost:3000/';
const appsurl = process.env.SERV_ENV == 'onion'
        ? 'http://q4s3a47gunuo5tie.onion:124/'
        : 'http://localhost:3001/';
const cdn = 'https://cdnjs.cloudflare.com/ajax/libs/socket.io/2.0.4/socket.io.js';

const param = {
        title: 'Live trading charts',
        author: '© Copyright 2018 coin_board',
        tsurl: appsurl,
        tvurl: appvurl,
        page: 'livestream',
        scripts: {
                socket: cdn,
                trade: '/tradestream.js',
        },
        blocks: {
                jumbo: 'blocks/all/my_jumbotron',
                ticker: 'blocks/index/ticker_panel',
                livestream: 'blocks/index/tradestream',
        },
};

module.exports = param;
