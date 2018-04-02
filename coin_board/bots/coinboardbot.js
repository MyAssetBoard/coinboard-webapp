/**
* @file Main runable executable for CoinBoardBot micro service
* @author based on telegraf module exemples and edited by Trevis Gulby
*/

/** Import telegraf module for bot management */
const Telegraf = require( 'telegraf' );
/** Import refresh bot function (aka fetch and store feeds ) */
const rf = require( './acts/refresh_act' );
/** Import datamine bot function (aka parse feeds ) */
const dm = require( './acts/datamine_act' );
/** Import tree bot function (aka $ tree DTAFOOD ) */
const ls = require( './acts/showfiles_act' );
/** telegraf module init */
const bot = new Telegraf( process.env.BOT_TOKEN );
bot.start( ( ctx ) => {
        console.log( 'started:', ctx.from.id );
        return ctx.reply( 'Welcome!' );
} );
bot.command( 'help', ( ctx ) => ctx.reply( 'Try send a sticker!' ) );
bot.hears( /hi/i, ( ctx ) => ctx.reply( 'Hey there!' ) );
bot.hears( /hello/i, ( ctx ) => ctx.reply( 'Hey there!' ) );
bot.hears( /buy/i, ( ctx ) => ctx.reply( 'Buy-buy! Money-Money!' ) );
bot.on( 'sticker', ( ctx ) => ctx.reply( '👍' ) );
/** Main bot listening command 'getter' function */
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
        /** If chat id is your servitor, exec some commands */
        if ( chatId == 408942599 ) {
                if ( cmd == rf.id ) {
                        rf.func( function( d ) {
                                ctx.reply( d );
                        } );
                } else if ( cmd == ls.id ) {
                        ls.func( function( d ) {
                                ctx.reply( d );
                        } );
                } else if ( cmd == dm.id ) {
                        dm.func( function( d ) {
                                ctx.reply( d );
                        } );
                } else {
                        let resp = '[' + cmd + '] : unknow command sorry';
                        ctx.reply( resp );
                }
        }
} );

/** Listen for any kind of messages */
bot.on( 'message', ( ctx ) => {
        let usr = ctx.from.first_name + ' ' + ctx.from.last_name;
        console.log( 'COINBOARD_BOT: Received msg :' );
        console.log( 'from [' + usr + ']' );
        console.log( ctx.message.text );
} );

/** Polling from telegram servers event */
bot.startPolling();
