/**
 * @file Main runable executable for CoinBoardBot micro service
 * @author based on telegraf module exemples and edited by Trevis Gulby
 */

/** @class */
class CbBot {
    /** @constructor */
    constructor() {
        /** Import telegraf module for bot management */
        this.Telegraf = require('telegraf');
        /** Import refresh bot function (aka fetch and store feeds ) */
        this.rf = require('./acts/refresh_act');
        /** Import datamine bot function (aka parse feeds ) */
        this.dm = require('./acts/datamine_act');
        /** Import tree bot function (aka tree DTAFOOD/ ) */
        this.ls = require('./acts/showfiles_act');
        /** Import BOT_TOKEN from env */
        this.bottoken = process.env.BOT_TOKEN;
        /** Bot startup */
        this.bot = new this.Telegraf(this.bottoken);
    }
}

/** Main launcher method */
CbBot.prototype.turnmeon = function() {
    let _this = this;
    _this.bot.start((ctx) => {
        console.log('started:', ctx.from.id);
        return ctx.reply('Welcome!');
    });
    _this.bot.command('help', (ctx) => ctx.reply('Try send a sticker!'));
    _this.bot.hears(/hi/i, (ctx) => ctx.reply('Hey there!'));
    _this.bot.hears(/hello/i, (ctx) => ctx.reply('Hey there!'));
    _this.bot.hears(/buy/i, (ctx) => ctx.reply('Buy-buy! Money-Money!'));
    _this.bot.on('sticker', (ctx) => ctx.reply('👍'));
    /** Main bot listening command 'getter' function */
    _this.bot.hears(/\/(.+)/, (ctx) => {
        console.log(ctx.update);
        let msgusr = ctx.from.first_name + ' ';
        msgusr += ctx.from.last_name + '] ';
        const chatId = ctx.from.id;
        let cmd = ctx.message.text;
        let log = 'COINBOARD_BOT: Received command [' + cmd + ']';
        console.log(log);
        log = 'from [' + msgusr + ' id :';
        log += chatId;
        console.log(log);
        /** If chat id is your servitor, exec some commands */
        if (chatId == 408942599) {
            if (cmd == _this.rf.id) {
                _this.rf.func(function(d) {
                    ctx.reply(d);
                });
            } else if (cmd == _this.ls.id) {
                _this.ls.func(function(d) {
                    ctx.reply(d);
                });
            } else if (cmd == _this.dm.id) {
                _this.dm.func(function(d) {
                    ctx.reply(d);
                });
            } else {
                let resp = '[' + cmd + '] : unknow command sorry';
                ctx.reply(resp);
            }
        }
    });

    /** Listen for any kind of messages */
    _this.bot.on('message', (ctx) => {
        let usr = ctx.from.first_name + ' ' + ctx.from.last_name;
        console.log('COINBOARD_BOT: Received msg :');
        console.log('from [' + usr + ']');
        console.log(ctx.message.text);
    });

    /** Polling from telegram servers event */
    _this.bot.startPolling();
};

/** Launching bot !! */
const mibot = new CbBot();
mibot.turnmeon();
/** Telegram bot for coin_board
 * @see CbBot
 * @module CbBot
 */
