/**
 * @file Parser wordlist and tags for DataJunk module
 * @author Trevis Gulby
 * @see DataJunk
 */

/** ### Parsing method module for {@link module:datajunk~DataJunk} class
 * @namespace
 * @memberof module:datajunk~djunk
 * @property {Object} bull the bull tendance object
 * @property {Object} bull.sets the bull tendance wordlist (very bull 'a' > 'x')
 * @property {Array} bull.sets.a the 'max bull' flags word array
 * @property {function} bull.check try to tag the feed for subjects
 * @property {function} bull.res try to parse content for known word in sets
 * @property {Object} bear the bear tendance object
 * @property {Object} bear.sets the bear tendance wordlist (very bear 'a' > 'x')
 * @property {function} bear.check try to parse content for known word in sets
 */
const colors = {
    bull: {
        sets: {
            a: [
                'amazing',
                'exceptionnal',
                'bull run',
                'exponential',
                'opportunity',
                'moon',
                'first',
                'innovation',
                'begining',
                'increase',
                'rise',
                'growth',
                'partnership',
                'partners',
                'patent',
                'future',
                'use blockchain',
                'all-blockchain',
                'investing',
            ],
        },
        check: function (el) {
            let str = el.wh;
            let flag = el.wr;
            let tag = [
                'ico',
                'btc',
                'eth',
                'price',
                'markets',
                'medical',
                'bitcoin',
                'ethereum',
                'blockchain',
                'regulation',
                'real-estate',
                'intellectual property',
            ];
            for (l in tag) {
                if (tag[l] && str.match(tag[l])) {
                    el['tg'] += tag[l] + ',';
                }
            }
            return str.match(flag) ?
                true :
                false;
        },
        res: function (el) {
            for (let x in this.bull.sets) {
                if (this.bull.sets[x]) {
                    for (let y in this.bull.sets.x) {
                        if (el.match(this.bull.sets.x[y])) {}
                    }
                }
            }
        },
    },
    bear: {
        sets: {
            a: [
                'hack',
                'crash',
                'theft',
                'breach',
                'disaster',
                'bankrupcy',
                'fail',
                'drop',
                'sales',
                'doubt',
                'tumble',
                'fumble',
                'plunged',
                'fumbled',
                'plungeon',
                'decrease',
                'volatile',
                'uncertainty',
            ],
        },
        check: function (el) {
            let str = el.wh;
            let flag = el.wr;
            let tag = [
                'ico',
                'btc',
                'eth',
                'xmr',
                'price',
                'markets',
                'medical',
                'bitcoin',
                'ethereum',
                'blockchain',
                'regulation',
                'real-estate',
                'intellectual property',
            ];
            for (l in tag) {
                if (tag[l] && str.match(tag[l])) {
                    el['tg'] += tag[l] + ',';
                }
            }
            return str.match(flag) ?
                true :
                false;
        },
    },
};

module.exports = colors;
