/**
* @file My assets view params
* @author Trevis Gulby
*/

const cdn = 'https://cdnjs.cloudflare.com/ajax/libs/socket.io/2.0.4/socket.io.js';
const cdn1 = 'https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.7.1/Chart.min.js';
const tickers = require( './tickers' );

const param = {
        title: 'My assets',
        author: '© Copyright 2018 coin_board',
        page: 'assets',
        scripts: {
                socketio: cdn,
                chartcdn: cdn1,
                manage: 'assets_management.js',
                test: 'draw_chart.js',
        },
        blocks: {
                jumbo: 'blocks/all/my_jumbotron',
                assets: 'blocks/assets/my_assets',
        },
        symb: tickers,
};

module.exports = param;
