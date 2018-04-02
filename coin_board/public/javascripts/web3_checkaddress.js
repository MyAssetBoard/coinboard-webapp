/* global Web3:false */

/**
* @param {function} callback
*/
function getWeb3( callback ) {
        if ( typeof window.web3 === 'undefined' ) {
                /** no web3, use fallback */
                console.error( 'Please use a web3 browser' );
        } else {
                /** window.web3 == web3 most of the time.
                * Don't override the provided, web3, just wrap it in your Web3.
                */
                let myWeb3 = new Web3( window.web3.currentProvider );

                /** the default account doesn't seem to be persisted,
                * copy it to our new instance
                */
                myWeb3.eth.defaultAccount = window.web3.eth.defaultAccount;

                callback( myWeb3 );
        }
}

/**
* @param {Object} web3
*/
function startApp( web3 ) {
        let yolo = web3.currentProvider;
        let account = web3.eth.defaultAccount;
        // if (yolo == )
        console.log( '== Connected to Metamask ==' );
        web3.version.getNetwork( ( err, netId ) => {
                switch ( netId ) {
                        case '1':
                                console.log( ' > This is mainnet' );
                                break;
                        case '2':
                                console.log( '> This is the (!!depre) Morden network.' );
                                break;
                        case '3':
                                console.log( '> This is the ropsten test network.' );
                                break;
                        case '4':
                                console.log( '> This is the Rinkeby test network.' );
                                break;
                        case '42':
                                console.log( '> This is the Kovan test network.' );
                                break;
                        default:
                                console.log( ' >> This is an unknown network. <<' );
                }
        } );
        console.log( yolo );
        console.log( account );
        $( '#InputEthaddr' ).val( account );
}

window.addEventListener( 'load', function() {
        /** Load WEB3 */
        getWeb3( startApp );
} );
