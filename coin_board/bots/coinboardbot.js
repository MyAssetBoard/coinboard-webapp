const readline = require( 'readline' );
const request = require( 'request' );
const interf = {
        input: process.stdin,
        output: process.stdout,
};
const rl = readline.createInterface( interf );

/**
* @classdesc Bot : telegram bot
* to control crawler requests and responses
*/
class Bot {
        /**
        * @param {string} TOKEN
        * @return {Promise}
        */
        init( TOKEN ) {
                return new Promise( ( resolve, reject ) => {
                        let url = `https://api.telegram.org/bot${ TOKEN }/getMe`;
                        request( url, ( error, r, body ) => {
                                const response = JSON.parse( body ).result;
                                if ( error ) {
                                        return;
                                }
                                if ( !response ) {
                                        return;
                                }
                                this.id = response.id || '';
                                this.first_name = response.first_name || '';
                                this.last_name = response.last_name || '';
                                this.username = response.username || '';
                                this.language_code = response.language_code || '';
                                resolve();
                        } );
                } );
        }

        /**
        * @return {string}
        */
        getName() {
                if ( this.last_name ) {
                        return `${ this.first_name} ${ this.last_name }`;
                } else {
                        return `${ this.first_name }`;
                }
        }

        /**
        * get bot name
        */
        introduceYourself() {
                let res = 'Hello, my name is ' + this.getName();
                res += '\nYou can talk to me through my username:';
                res += this.username;
                console.log( res );
        }

        /**
        * get bot name
        */
        talktoMe() {
                rl.question( 'EnterCMD> ', function( res ) {
                        console.log( res );
                        rl.close();
                } );
        }
}

module.exports = Bot;
