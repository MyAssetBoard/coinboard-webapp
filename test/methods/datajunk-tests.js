const chai = require( 'chai' );
const assert = chai.assert;
const chaiAsPromised = require( 'chai-as-promised' );
chai.use( chaiAsPromised );
const DataJunk = require( '../../coin_board/methods/datajunk_methods' );
const djunk = new DataJunk();
let toeat = {
        feed: [
                {
                        'title': 'Breaking: Trustee Of Infamous Mt. Gox Denies BTC, BCH Sales Affected Crypto Markets',
                        'link': 'https://cointelegraph.com/news/breaking-trustee-of-infamous-mt-gox-denies-btc-bch-sales-affected-crypto-markets',
                        'description': 'Mt. Gox trustee blamed for crypto market crash says all coins were sold without ‘affecting the market price’ #NEWS',
                },
        ],
};
let res = [
        {
                title: 'Breaking: Trustee Of Infamous Mt. Gox Denies BTC, BCH Sales Affected Crypto Markets',
                subject: 'btc,markets',
                type: '',
                flag: '',
        },
];

let desc = 'Test eat function for good parsing';
describe( desc, function() {
        desc = 'It return an object with keys : title, subject, type, flag';
        it( desc, function() {
                return assert.equal( djunk.eat( toeat ), res );
        } );
} );
