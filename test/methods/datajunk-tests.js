const chai = require( 'chai' );
const assert = chai.assert;
const chaiAsPromised = require( 'chai-as-promised' );
chai.use( chaiAsPromised );
const DataJunk = require( '../../coin_board/methods/datajunk_methods' );
const djunk = new DataJunk();
let toeat = [
        {
                feed: [
                        {
                                'title': 'Breaking: Trustee Of Infamous Mt. Gox Denies BTC, BCH Sales Affected Crypto Markets',
                                'link': 'https://cointelegraph.com/news/breaking-trustee-of-infamous-mt-gox-denies-btc-bch-sales-affected-crypto-markets',
                                'description': 'Mt. Gox trustee blamed for crypto market crash says all coins were sold without ‘affecting the market price’ #NEWS',
                        },
                ],
        },
];
let res = [
        {
                'title': 'breaking: trustee of infamous mt. gox denies btc, bch sales affected crypto markets',
                'subject': 'btc,markets,',
                'type': 'bear',
                'flag': 'sales',
        },
];

let desc = 'Test eat function for good parsing';
describe( desc, function() {
        desc = 'It return an object with keys : title, subject, type, flag';
        it( desc, function() {
                let tst = djunk.eat( toeat );
                return assert.deepEqual( tst[0], res[0] );
        } );
} );
