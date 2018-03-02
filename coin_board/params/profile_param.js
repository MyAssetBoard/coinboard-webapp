/**
* @file Profile view params
* @author Trevis Gulby
*/

const appvurl = process.env.SERV_ENV == 'onion'
        ? 'http://xu6ylq4kzadh7bcm.onion/'
        : 'http://localhost:3000/';
const appsurl = process.env.SERV_ENV == 'onion'
        ? 'http://q4s3a47gunuo5tie.onion:124/'
        : 'http://localhost:3001/';

const param = {
        title: 'Profile',
        author: '© Copyright 2018 coin_board ;)',
        tsurl: appsurl,
        tvurl: appvurl,
        page: 'login',
        blocks: {
                jumbo: 'blocks/all/my_jumbotron',
                topblock: 'blocks/profile/my_profile',
        },
};

module.exports = param;
