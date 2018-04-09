/**
 * @file Crawler feeds and pre-parsing methods for DajaJunk module
 * @author Trevis Gulby
 */

/** For timestamp */
const date = new Date();
/** cointelegraph request url with yahoo api (rss to json) */
let ctafjson = '/v1/public/yql?q=select%20title%2Clink%2Cdescription';
ctafjson += '%20from%20rss%20' + 'where%20url';
ctafjson += '%3D%22https%3A%2F%2Fcointelegraph.com%2Frss%3Fformat%3Dxml%22';
ctafjson += '&format=json&diagnostics=true&callback=';
/** cryptonews request url with yahoo api (rss to json) */
let cryptonewsjson = '/v1/public/yql?q=select%20title%2Clink%2Cdescription';
cryptonewsjson += '%20from%20rss%20' + 'where%20url';
cryptonewsjson += '%3D%22https%3A%2F%2Fcryptocurrencynews.com%2F';
cryptonewsjson += 'feed%2F%3Fformat%3Dxml%22';
cryptonewsjson += '&format=json&diagnostics=true&callback=';
/** the actual timestamp on format $source-DDMMYEAR_H-M.json*/
let tmpst = (date.getDate() + 1) < 10 ?
    '0' + (date.getDate() + 1) :
    date.getDate() + 1;
tmpst += (date.getMonth() + 1) < 10 ?
    '0' + (date.getMonth() + 1) :
    date.getMonth() + 1;
tmpst += date.getFullYear();
tmpst += '_' + date.getHours() + '-';
tmpst += date.getMinutes() < 10 ?
    '0' + date.getMinutes() + '.json' :
    date.getMinutes() + '.json';

/** The DataJunk data crawling feeds parameters
 * @namespace
 * @property {Object} ctaf cointelegraph newsfeed methods
 * @property {function} ctaf.clean return only paragraph html elements
 * @property {function} ctaf.get return a clean array
 * @property {Object} crnews cryptocurrencynews feed methods
 * @property {function} crnews.clean remove lots of unwanted elements
 * @property {function} crnews.get return a clean array
 */
const reqmodels = {
    ctaf:
    {
        id: 'n.ctaf',
        url: 'https://cointelegraph.com/rss',
        req:
        {
            host: 'query.yahooapis.com',
            path: ctafjson,
        },
        fname: './DTAFOOD/news/ctaf-' + tmpst,
        clean: function(mess) {
            let clean = mess.match(/<p>(.*?)<\/p>/g);
            clean = !clean ?
                'PARSING-ERROR' :
                clean.toString().replace(/<\/?p>/g, '');
            return clean;
        },
        get: function(r, clean) {
            for (it in r.item) {
                if (r.item[it]) {
                    let elem = r.item[it];
                    let d = elem.description;
                    let dsc = this.clean(d);
                    elem.description = dsc;
                    clean[it] = elem;
                }
            }
            return clean;
        },
    },
    crnews:
    {
        id: 'n.crnews',
        url: 'https://cryptocurrencynews.com/feed/',
        req:
        {
            host: 'query.yahooapis.com',
            path: cryptonewsjson,
        },
        fname: './DTAFOOD/news/crnews-' + tmpst,
        clean: function(mess) {
            let rgx1 = /(<([^>]+)>)/ig;
            let rgx2 = /[`~@#%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi;
            let rt = mess.replace(rgx1, '');
            rt = rt.replace(rgx2, ' ');
            rt = !rt || !rt.length ?
                'PARSING-ERROR' :
                rt.toString().split('Read The Full')[0];
            return rt;
        },
        get: function(r, clean) {
            for (it in r.item) {
                if (r.item[it]) {
                    let elem = r.item[it];
                    let d = this.clean(elem.description);
                    elem.description = d;
                    clean[it] = elem;
                }
            }
            return clean;
        },
    },
    crcomp:
    {
        id: 'p.crccomp',
        url: 'https://min-api.cryptocompare.com',
        req:
        {
            host: 'min-api.cryptocompare.com',
            path: '/data/price?fsym=BTC&tsyms=USD,JPY,EUR',
        },
        fname: './DTAFOOD/prices/crcomp-btc.usd.jpy.eur-' + tmpst,
        get: function(r, clean) {
            return clean;
        },
    },
};

module.exports = reqmodels;
/** ### All cryto news / price feeds methods
 * @module reqmodels
 */
