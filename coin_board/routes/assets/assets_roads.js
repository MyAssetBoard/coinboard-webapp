/**
 * @file Assets routes params and paths definitions (use datajunk module)
 * @author Trevis Gulby
 */

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
            let rt = {};
            rt['blocks'] = ['cb_ifeed', 'cb_dmfeed'];
            callback && callback(rt);
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
    apiparams: {
        path: '/assets/api/param',
        getd: function (callback) {
            let xx = {
                blocks: ['api_param'],
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
};

module.exports = roads;
