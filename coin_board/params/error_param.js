/**
 * @file Error view params
 * @author Trevis Gulby
 */

const AppConfig = require('../methods/config_methods');
const param = {
    title: 'Coin_B. => ItsA(NastyBUG)',
    author: '© Copyright 2018 coin_board x)',
    tsurl: AppConfig.saddr,
    tvurl: AppConfig.vaddr,
    page: 'error',
    scripts:
    {
        reload: '/to_homepage.js',
    },
    blocks:
    {
        jumbo: 'blocks/all/my_jumbotron',
    },
};

module.exports = param;
