/**
* @file N26 APIS requests definitions
* @author N26 node module and Trevis Gulby
*/

const N26 = require( 'n26' );

/**
* @param {Object} id
* @param {string} key
* @return {Object} res
*/
function gettrstats( id, key ) {
        return new Promise( ( resolve, reject ) => {
                const acc = new N26( id.usr, id.pw );
                let res = {
                        cred: key + ' credit : ',
                        char: key + ' charges : ',
                        tot: key + ' cost : ',
                };
                acc.then( function( account ) {
                        account.transactions( {text: key} ).then( ( tr ) => {
                                let sum = 0;
                                let min = 0;
                                let plus = 0;
                                for ( el in tr ) {
                                        if ( tr[el].amount ) {
                                                let y = tr[el].amount;
                                                min += y <= 0
                                                        ? y
                                                        : 0;
                                                plus += y >= 0
                                                        ? y
                                                        : 0;
                                                sum += y;
                                        }
                                }
                                res.cred += plus + ' €';
                                res.char += min + ' €';
                                res.tot += sum + ' €';
                                resolve( res );
                        } );
                } );
        } );
}

if ( process.env.LAUNCH_TASK == 'ask' ) {
        let id = {
                usr: '',
                pw: '',
        };
        gettrstats( id, 'coinbase' ).then( function( res ) {
                console.log( res );
        } );
}
