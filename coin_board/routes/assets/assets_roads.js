/**
 * @file Assets routes params and paths definitions (use datajunk module)
 * @author Trevis Gulby
 */

const DataJunk = require('../../controllers/datajunk_methods');
const data = new DataJunk();
/** ### Parsing method module for {@link module:router~Routes.assets} elem
 * @namespace
 * @memberof Routes.page.assets
 * @property {Object} dashboard an element in roads object
 * @property {string} dashboard.path the path string
 * @property {function} dashboard.getd the get page data method
 * @property {function} dashboard.stripd the remove unusued userdata from page
 * @property {Object} infofeed an element in roads object
 * @property {string} infofeed.path the path string
 * @property {function} infofeed.getd the get page data method
 * @property {function} infofeed.stripd the remove unusued userdata from page
 * @property {Object} pricefeed an element in roads object
 * @property {string} pricefeed.path the path string
 * @property {function} pricefeed.getd the get page data method
 * @property {function} pricefeed.stripd the remove unusued userdata from page
 */
const roads = {
    dashboard: {
        path: '/assets/dashboard',
        getd: function (callback) {
            let xx = {
                blocks: ['cb_db'],
            };
            callback && callback(xx);
        },
        stripd: function (d) {
            if (d.hasOwnProperty('apisv2')) {
                let todel = 'apisv2';
                delete d[todel];
            }
        },
    },
    infofeed: {
        path: '/assets/infofeed',
        getd: function (callback) {
            data.pukedata({}).then(function (res) {
                let mine = data.eat(res);
                let rt = {};
                let fd = [];
                for (el in res) {
                    if (res[el].feed) {
                        fd = fd.concat(res[el].feed);
                    }
                }
                rt['blocks'] = ['cb_ifeed', 'cb_dmfeed.ejs'];
                rt['feed'] = fd;
                rt['dm'] = mine;
                callback && callback(rt);
            });
        },
        stripd: function (d) {
            if (d.hasOwnProperty('apisv2')) {
                let todel = 'apisv2';
                delete d[todel];
            }
            if (d.hasOwnProperty('assets')) {
                let todel = 'assets';
                delete d[todel];
            }
        },
    },
    pricefeed: {
        path: '/assets/pricefeed',
        getd: function (callback) {
            let xx = {
                blocks: ['cb_pfeed'],
            };
            callback && callback(xx);
        },
        stripd: function (d) {
            if (d.hasOwnProperty('apisv2')) {
                let todel = 'apisv2';
                delete d[todel];
            }
        },
    },
    trade: {
        path: '/assets/trade',
        getd: function (callback) {
            let xx = {
                blocks: ['cb_pfeed'],
            };
            callback && callback(xx);
        },
        stripd: function (d) {},
    },
    apiparams: {
        path: '/assets/api/param',
        getd: function (callback) {
            let xx = {
                blocks: ['api_param'],
                scripts: ['/api_settings.js'],
            };
            callback && callback(xx);
        },
        stripd: function (d) {
            if (d.hasOwnProperty('assets')) {
                let todel = 'assets';
                delete d[todel];
            }
        },
    },
    reportmonth: {
        path: '/assets/trade/reports/currm',
        getd: function (callback) {
            let xx = {
                blocks: ['cb_pfeed'],
            };
            callback && callback(xx);
        },
    },
    reportthreemonths: {
        path: '/assets/trade/reports/currquart',
        getd: function (callback) {
            let xx = {
                blocks: ['cb_pfeed'],
            };
            callback && callback(xx);
        },
    },
    crowddata: {
        path: '/assets/trade/reports/crowddata',
        getd: function (callback) {
            let xx = {
                blocks: ['cb_pfeed'],
            };
            callback && callback(xx);
        },
    },
};

module.exports = roads;
