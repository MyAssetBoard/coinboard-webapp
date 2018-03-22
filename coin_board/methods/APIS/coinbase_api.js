const Client = require( 'coinbase' ).Client;
const KEY = process.env.CBK;
const SC = process.env.CBS;
const PAR = {
        'apiKey': KEY,
        'apiSecret': SC,
        'version': 'YYYY-MM-DD',
};

let cli = new Client( PAR );
let accid = '';

cli.getAccounts( {}, function( err, acs ) {
        // console.log( acs );
} );

client.getAccount( accid, function( err, accounts ) {
        console.log( accounts );
} );
