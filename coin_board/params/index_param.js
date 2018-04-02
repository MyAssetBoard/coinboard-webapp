/**
* @file Index view params
* @author Trevis Gulby
*/
const appconfig = require( '../methods/config_methods' );
const param = {
        title: 'Coin_Board',
        author: '© Copyright 2018 coin_board',
        tsurl: appconfig.saddr,
        tvurl: appconfig.vaddr,
        page: 'index',
        blocks: {
                jumbo: 'blocks/all/my_jumbotron'
        },
};

module.exports = param;
