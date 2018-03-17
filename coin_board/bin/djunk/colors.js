const colors = {
        bull: {
                sets: {
                        l1: [
                                'amazing',
                                'exceptionnal',
                                'bull run',
                                'exponential',
                                'opportunity',
                                'moon',
                        ],
                        l2: [
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
                        l3: ['recover', 'support'],
                },
                check: function( el ) {
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
                        for ( l in tag ) {
                                if ( tag[l] && str.match( tag[l] ) ) {
                                        el['tg'] += tag[l] + ',';
                                }
                        }
                        return str.match( flag )
                                ? true
                                : false;
                },
        },
        bear: {
                sets: {
                        l1: [
                                'hack',
                                'crash',
                                'theft',
                                'breach',
                                'disaster',
                                'bankrupcy',
                        ],
                        l2: [
                                'fail',
                                'drop',
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
                check: function( el ) {
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
                        for ( l in tag ) {
                                if ( tag[l] && str.match( tag[l] ) ) {
                                        el['tg'] += tag[l] + ',';
                                }
                        }
                        return str.match( flag )
                                ? true
                                : false;
                },
        },
};

module.exports = colors;
