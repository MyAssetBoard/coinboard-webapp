/**
* @file Error view params
* @author Trevis Gulby
*/

const os = require( 'os' );
const ni = os.networkInterfaces();
const myip = ni.eth0[0].address;

const appvurl = process.env.SERV_ENV == 'onion'
        ? 'http://xu6ylq4kzadh7bcm.onion/'
        : 'http://' + myip + ':3000/';
const appsurl = process.env.SERV_ENV == 'onion'
        ? 'http://q4s3a47gunuo5tie.onion:124/'
        : 'http://' + myip + ':3001/';

const param = {
        title: 'Coin_B. => ItsA(NastyBUG)',
        author: '© Copyright 2018 coin_board x)',
        tsurl: appsurl,
        tvurl: appvurl,
        page: 'error',
        scripts: {
                reload: '/to_homepage.js',
        },
        blocks: {
                jumbo: 'blocks/all/my_jumbotron',
        },
};

module.exports = param;
