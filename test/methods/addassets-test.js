/**
 * @file Unit test file for index route functions
 * @author base on Express app and edited by Trevis Gulby
 */

let chai = require('chai');
let assert = chai.assert;
let chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
const AssetsMod = require('../../coin_board/controllers/assets_methods');
let ekey = 'U2FsdGVkX19Qw8U0ksGrlaBPe5iKKhzTIoMewLn3L3sCneFkaeycy09%2Fnp2uB6cz';
let assets = new AssetsMod();
let mockVdata = {
    ticker: 'ETH',
    qtt: 0.01,
    id: ekey,
};

let mockCdata = {
    ticker: 'ETH',
    qtt: 'yolostringnonum',
    id: 'ltioitoitoi+',
};

let desc = 'Add assets [' + JSON.stringify(mockVdata) + '] for user maintest';
describe(desc, function() {
    it('It return resolved promise', function() {
        // let exp = 'Wrong request';
        return assert.isRejected(assets.addAssets(mockVdata));
    });
});

desc = 'Add assets [' + JSON.stringify(mockCdata) + '] for user maintest';
describe(desc, function() {
    it('It reject promise with error : Invalid quantity', function() {
        return assert.isRejected(assets.addAssets(mockCdata), 'Wrong request');
    });
});

describe('Test checkcoData', function() {
    it('It return false', function() {
        let rt = assets.checkAssetData(
        {
            ticker: 'toto',
            datas: 'tata',
        });
        return assert.equal(rt, false);
    });
});
