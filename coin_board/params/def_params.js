/**
 * @file All {@link pages} default view engine params
 * @author Trevis Gulby
 */

const Myconf = require('../controllers/config_methods');

const settings = require('../settings');

const confell = new Myconf();

const tickers = require('./tickers');

let cdns = {
    socket: 'https://cdnjs.cloudflare.com/ajax/libs/' + 'socket.io/2.0.4/socket.io.js',
    chartjs: 'https://cdnjs.cloudflare.com/ajax/libs/' + 'Chart.js/2.7.1/Chart.min.js',
    cryptojs: 'https://cdnjs.cloudflare.com/ajax/libs/' + 'crypto-js/3.1.9-1/crypto-js.min.js',
    web3: 'https://cdn.jsdelivr.net/npm/web3@0.19.0/dist/web3.min.js',
};

let param = {
    logco: function(pagename, chck) {
        log = '/' + pagename + '-route : Auth user, cookies below\n[';
        log += JSON.stringify(chck) + ']';
        process.env.NODE_ENV == 'development' ? console.log(log) : log;
    },
    lognoco: function(pagename, chck) {
        log = '/' + pagename + '-route : NonAuth user, cookies below\n[';
        log += JSON.stringify(chck) + ']';
        process.env.NODE_ENV == 'development' ? console.log(log) : log;
    },
    assets:
    {
        app: settings.apptitle,
        title: 'My assets',
        author: settings.appcopyrights,
        tsurl: confell.runningaddrs.appsurl,
        tvurl: confell.runningaddrs.appvurl,
        page: 'index',
        page: 'assets',
        scripts:
        {
            socketio: cdns.socket,
            chartcdn: cdns.chartjs,
            commons: '/common.js',
        },
        blocks:
        {
            jumbo: 'blocks/all/my_jumbotron',
            centerblock: 'blocks/assets/my_assets',
        },
        symb: tickers,
    },
    index:
    {
        app: settings.apptitle,
        title: settings.apptitle,
        author: settings.appcopyrights,
        tsurl: confell.runningaddrs.appsurl,
        tvurl: confell.runningaddrs.appvurl,
        page: 'index',
        blocks:
        {
            jumbo: 'blocks/all/my_jumbotron',
        },
    },
    livestream:
    {
        app: settings.apptitle,
        title: 'Live trading charts',
        author: settings.appcopyrights,
        tsurl: confell.runningaddrs.appsurl,
        tvurl: confell.runningaddrs.appvurl,
        page: 'livestream',
        scripts:
        {
            socket: cdns.socket,
            commons: '/common.js',
            trade: '/tradestream.js',
        },
        blocks:
        {
            jumbo: 'blocks/all/my_jumbotron',
            ticker: 'blocks/index/ticker_panel',
            livestream: 'blocks/index/tradestream',
        },
    },
    login:
    {
        app: settings.apptitle,
        title: 'Login',
        author: settings.appcopyrights,
        tsurl: confell.runningaddrs.appsurl,
        tvurl: confell.runningaddrs.appvurl,
        page: 'login',
        scripts:
        {
            socketio: cdns.socket,
            cryptojs: cdns.cryptojs,
            commons: '/common.js',
            mysocket: '/auth_socket.js',
        },
        blocks:
        {
            jumbo: 'blocks/all/my_jumbotron',
            topblock: 'blocks/login/login_block',
        },
    },
    profile:
    {
        app: settings.apptitle,
        title: 'Profile',
        author: settings.appcopyrights,
        tsurl: confell.runningaddrs.appsurl,
        tvurl: confell.runningaddrs.appvurl,
        page: 'profile',
        blocks:
        {
            jumbo: 'blocks/all/my_jumbotron',
            topblock: 'blocks/profile/my_profile',
        },
    },
    signin:
    {
        app: settings.apptitle,
        title: 'Signin',
        author: settings.appcopyrights,
        tsurl: confell.runningaddrs.appsurl,
        tvurl: confell.runningaddrs.appvurl,
        page: 'signin',
        scripts:
        {
            socketio: cdns.socket,
            web3cdn: cdns.web3,
            commons: '/common.js',
            myweb3: '/web3_checkaddress.js',
            mysocket: '/signin_socket.js',
        },
        blocks:
        {
            jumbo: 'blocks/all/my_jumbotron',
            topblock: 'blocks/signin/signin_block',
        },
    },
    error:
    {
        app: settings.apptitle,
        title: 'ItsA(NOtFound)Here ;)',
        author: settings.appcopyrights,
        tsurl: confell.runningaddrs.appsurl,
        tvurl: confell.runningaddrs.appvurl,
        page: 'error',
        scripts:
        {
            reload: '/to_homepage.js',
        },
        blocks:
        {
            jumbo: 'blocks/all/my_jumbotron',
        },
    },
};

module.exports = param;
