/**
* @file My assets view params
* @author Trevis Gulby
*/

const appvurl = process.env.SERV_ENV == 'onion'
        ? 'http://xu6ylq4kzadh7bcm.onion/'
        : 'http://localhost:3000/';
const appsurl = process.env.SERV_ENV == 'onion'
        ? 'http://q4s3a47gunuo5tie.onion:124/assets'
        : 'http://localhost:3001/assets';
const cdn = 'https://cdnjs.cloudflare.com/ajax/libs/socket.io/2.0.4/socket.io.js';
const cdn1 = 'https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.7.1/Chart.min.js';
const tickers = require( './tickers' );

const param = {
        title: 'My assets',
        author: '© Copyright 2018 coin_board',
        tsurl: appsurl,
        tvurl: appvurl,
        page: 'assets',
        scripts: {
                socketio: cdn,
                chartcdn: cdn1,
                manage: 'assets_management.js',
        },
        blocks: {
                jumbo: 'blocks/all/my_jumbotron',
                centerblock: 'blocks/assets/my_assets',
        },
        symb: tickers,
};

module.exports = param;
