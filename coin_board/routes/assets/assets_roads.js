/**
 * @file Assets routes params and paths definitions (use datajunk module)
 * @author Trevis Gulby
 */

const Apis = require('../../methods/api_methods');
const api = new Apis();
const DataJunk = require('../../methods/datajunk_methods');
const data = new DataJunk();
const roads = {
    a:
    {
        path: '/assets/dashboard',
        getd: function(callback) {
            let xx = {
                blocks: ['cb_db'],
                scripts: ['/assets_management.js'],
            };
            callback && callback(xx);
        },
        stripd: function(d) {
            if (d.hasOwnProperty('apisv2')) {
                let todel = 'apisv2';
                delete d[todel];
            }
        },
    },
    b:
    {
        path: '/assets/infofeed',
        getd: function(callback) {
            data.pukedata(
            {}).then(function(res) {
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
        stripd: function(d) {
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
    c:
    {
        path: '/assets/pricefeed',
        getd: function(callback) {
            let xx = {
                blocks: ['cb_pfeed'],
            };
            callback && callback(xx);
        },
        stripd: function(d) {
            if (d.hasOwnProperty('apisv2')) {
                let todel = 'apisv2';
                delete d[todel];
            }
        },
    },
    d:
    {
        path: '/assets/trade',
        getd: function(callback) {
            let xx = {
                blocks: ['cb_pfeed'],
            };
            callback && callback(xx);
        },
        stripd: function(d) {},
    },
    e:
    {
        path: '/assets/api/param',
        getd: function(callback) {
            api.getAccounts(
            {}).then(function(res, err) {
                let xx = {
                    blocks: ['api_param'],
                    scripts: ['/api_settings.js'],
                    userapi: res,
                };
                callback && callback(xx);
            });
        },
        stripd: function(d) {
            if (d.hasOwnProperty('assets')) {
                let todel = 'assets';
                delete d[todel];
            }
        },
    },
    f:
    {
        path: '/assets/trade/reports/currm',
        getd: function(callback) {
            let xx = {
                blocks: ['cb_pfeed'],
            };
            callback && callback(xx);
        },
    },
    g:
    {
        path: '/assets/trade/reports/currquart',
        getd: function(callback) {
            let xx = {
                blocks: ['cb_pfeed'],
            };
            callback && callback(xx);
        },
    },
    h:
    {
        path: '/assets/trade/reports/crowddata',
        getd: function(callback) {
            let xx = {
                blocks: ['cb_pfeed'],
            };
            callback && callback(xx);
        },
    },
};

module.exports = roads;
