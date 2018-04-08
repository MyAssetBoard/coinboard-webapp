/**
 * @file CreditAgricole APIS requests definitions
 * @author Trevis Gulby
 */

/** use of capser scrapper module */
const casper = require( 'casper' ).create();
/** url to be scrapped */
const url = 'https://www.ca-aquitaine.fr/';

/** Scrape the links from top-right nav of the website
* @return {string} all links elements
*/
function getLinks() {
        let links = document.querySelectorAll( 'ul.navigation li a' );
        return Array.prototype.map.call( links, function( e ) {
                return e.getAttribute( 'href' );
        } );
}

/** Opens credit agricole homepage */
casper.start( url );

casper.then( function( res ) {
        let links = this.evaluate( getLinks );
        console.log( JSON.stringify( res ) );
        for ( let i in links ) {
                if ( links[i] ) {
                        console.log( links[i] );
                }
        }
} );

casper.run();
