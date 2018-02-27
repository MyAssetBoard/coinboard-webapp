const chai = require( 'chai' );
const assert = chai.assert;
const chaiAsPromised = require( 'chai-as-promised' );
chai.use( chaiAsPromised );
const Auth = require( '../../coin_board/methods/auth_methods' );
const auth = new Auth();

const vmock = {
        iname: 'footest',
        imail: 'footest@footes.eu',
        isocket: 'xxxxXXXXXX',
        ieth: 'NONE',
        icurr: 'EUR',
};
const resvmock = {
        ok: 1,
        nb: 1,
};

const emock = {
        iname: 'fo',
        imail: 'fozzu',
        isocket: 'aaaa',
        ieth: 'NO^ẑzzz\nE',
        icurr: 'EURz',
};
let resemock = 'Invalid data submitted';

let desc = 'Test register new valid user [' + JSON.stringify( vmock ) + ']';
describe( desc, function() {
        it( 'It return promise [' + JSON.stringify( resvmock ) + ']', function() {
                return assert.isFulfilled( auth.registerUsr( vmock ), resvmock );
        } );
} );

desc = 'Test register new corrupt user :[' + JSON.stringify( emock ) + ']';
describe( desc, function() {
        it( 'It reject promise [' + resemock + ']', function() {
                return assert.isRejected( auth.registerUsr( emock ), resemock );
        } );
} );

desc = 'Test userisAuth with corrupt euid: ldkldkldlkldk';
describe( desc, function() {
        let res = 'user not found';
        it( 'It reject promise [' + res + ']', function() {
                return assert.isRejected( auth.userisAuth( 'ldkldkldlkldk' ), res );
        } );
} );

desc = 'Test userisAuth with valid euid';
describe( desc, function() {
        let res = 'ok user foobar';
        let euid = decodeURIComponent( 'U2FsdGVkX19Qw8U0ksGrlaBPe5iKKhzTIoMewLn3L3sCneFkaeycy09%2Fnp2uB6cz' );
        it( 'It resove promise [' + res + ']', function() {
                return assert.isFulfilled( auth.userisAuth( euid ), res );
        } );
} );

desc = 'Test checkcoData with new corrupt user [inputName: kjkj, yolo: oio]';
describe( desc, function() {
        let res = false;
        let req = {
                inputName: 'kjkj',
                yolo: 'oio',
        };
        it( 'It reject promise [' + res + ']', function() {
                return assert.equal( auth.checkcoData( req ), res );
        } );
} );
