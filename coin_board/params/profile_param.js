/**
 * @file Profile view params
 * @author Trevis Gulby
 */

const AppConfig = require('../methods/config_methods');
const param = {
    title: 'Profile',
    author: '© Copyright 2018 coin_board ;)',
    tsurl: AppConfig.saddr,
    tvurl: AppConfig.vaddr,
    page: 'login',
    blocks:
    {
        jumbo: 'blocks/all/my_jumbotron',
        topblock: 'blocks/profile/my_profile',
    },
};

module.exports = param;
