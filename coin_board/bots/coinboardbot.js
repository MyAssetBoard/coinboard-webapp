/**
* @file Main runable executable for CoinBoardBot micro service
* @author based on telegraf module exemples and edited by Trevis Gulby
*/

const Telegraf = require( 'telegraf' );
const rf = require( './acts/refresh_act' );
const ls = require( './acts/showfiles_act' );

const bot = new Telegraf( process.env.BOT_TOKEN );
bot.start( ( ctx ) => {
        console.log( 'started:', ctx.from.id );
        return ctx.reply( 'Welcome!' );
} );
bot.command( 'help', ( ctx ) => ctx.reply( 'Try send a sticker!' ) );
bot.hears( 'hi', ( ctx ) => ctx.reply( 'Hey there!' ) );
bot.hears( /buy/i, ( ctx ) => ctx.reply( 'Buy-buy!' ) );
bot.on( 'sticker', ( ctx ) => ctx.reply( '👍' ) );

bot.hears( /\/(.+)/, ( ctx ) => {
        console.log( ctx.update );
        let msgusr = ctx.from.first_name + ' ';
        msgusr += ctx.from.last_name + '] ';
        const chatId = ctx.from.id;
        let cmd = ctx.message.text;
        let log = 'COINBOARD_BOT: Received command [' + cmd + ']';
        console.log( log );
        log = 'from [' + msgusr + ' id :';
        log += chatId;
        console.log( log );
        if ( chatId == 408942599 ) {
                if ( cmd == rf.id ) {
                        rf.func( function( d ) {
                                ctx.reply( d );
                        } );
                } else if ( cmd == ls.id ) {
                        ls.func( function( d ) {
                                ctx.reply( d );
                        } );
                } else {
                        let resp = '[' + cmd + '] : unknow command sorry';
                        ctx.reply( resp );
                }
        }
} );

// Listen for any kind of message. There are different kinds of
// messages.
bot.on( 'message', ( msg ) => {
        // const chatId = msg.chat.id;
        let usr = msg.from.first_name + ' ' + msg.from.last_name;
        console.log( 'COINBOARD_BOT: Received msg :' );
        console.log( 'from [' + usr + ']' );
        console.log( msg.text );
        // send a message to the chat acknowledging receipt of their message
        // bot.sendMessage( chatId, 'Received your message' );
} );

bot.startPolling();
