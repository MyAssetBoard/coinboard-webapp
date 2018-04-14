/**
 * @file Crawler helper functions methods for {@link module:datajunk}
 * @author Trevis Gulby
 */

/** The other parsing helper Object see {@link module:datajunk~DataJunk#eatd}
 * @namespace
 * @memberof module:datajunk~djunk
 * @property {function} checkwhat identify news subject
 * @property {function} checkstyle identify news type (bearish or bullish)
 * @property {function} checkwrd check feed against wordlist to get intensity
 * @property {function} getres return a new clean object for db insertion
 * @property {function} getparsed pre-parse news json from web scrapping
 */
const eatdiner = {
    /**
     * @param {object} obj the parsed object composed of ...
     * @param {number} a the parent process parser order
     */
    checkwhat: function(obj, a) {
        let what = obj[a].toLowerCase();
        let log = 'Elem n°: [' + a;
        log += '], content: [' + what + ']';
        if (process.env.NODE_LOG == 'djunk') {
            console.log(log);
        }
    },
    /** @param {string} b the parent process parser type  */
    checkstyle: function(b) {
        let log = 'Testing [' + b + '] type';
        if (process.env.NODE_LOG == 'djunk') {
            console.log(log);
        }
    },
    /**
     * @param {number} wrd the word in {@link colors} array's
     * @param {string} str the string to parse
     */
    checkwrd: function(wrd, str) {
        let log = 'Is there any [' + wrd + '] ?';
        log += str.match(wrd) ?
            ' YES' :
            ' NO';
        if (process.env.NODE_LOG == 'djunk') {
            console.log(log);
        }
    },
    getres: function(obj, ts) {
        let res = {};
        res['title'] = obj.wh;
        res['subject'] = obj.tg;
        if (obj.cmp && res['title'] == obj.cmp['title']) {
            obj.cmp['type'] += ',' + obj.id;
            obj.cmp['flag'] += ',' + obj.wr;
        } else {
            res['type'] = obj.id;
            res['flag'] = obj.wr;
            ts.val += 1;
            return res;
        }
    },
    getparsed: function(dset, ts) {
        let rt = [];
        for (let el in dset) {
            if (dset[el]) {
                for (let k in dset[el].feed) {
                    if (dset[el].feed[k]) {
                        let id = dset[el].feed[k].title;
                        rt[ts.nb += 1] = id;
                    }
                }
            }
        }
        if (process.env.NODE_LOG == 'development') {
            let log = '\n[[DATAJUNK:\t=> Ready to check [';
            log += ts.nb + ']';
            log += ' elems !]]';
            console.log(log);
        }
        return rt;
    },
};

module.exports = eatdiner;
