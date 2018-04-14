/**
 * @file Main runable executable for {@link module:cbbot~CbBot} service
 * @author based on telegraf module exemples and edited by Trevis Gulby
 */

/** @class */
class CbBot {
    /** @constructor */
    constructor() {
        /** Import [telegraf](https://github.com/telegraf/telegraf)
         * module for easy bot management
         */
        this.Telegraf = require('telegraf');
        /** Import {@link refresh} bot function (aka fetch and store feeds )
         */
        this.rfrsh = require('./acts/refresh_act');
        /** Import {@link digest} bot function (aka parse feeds )
         */
        this.digst = require('./acts/datamine_act');
        /** Import {@link showfiles} bot function (aka tree DTAFOOD/ )
         */
        this.showf = require('./acts/showfiles_act');
        /** Import BOT_TOKEN from env
         */
        this.bottoken = process.env.BOT_TOKEN;
        /** Bot startup with new {@link Telegraf} object
         */
        this.bot = new this.Telegraf(this.bottoken);
    }
}

CbBot.prototype.runcommands = function(cmd, ctx) {
    let _this = this;
    switch (cmd) {
    case _this.rfrsh.id:
        _this.rfrsh.func(function(d) {
            ctx.reply(d);
        });
        break;
    case _this.showf.id:
        _this.showf.func(function(d) {
            ctx.reply(d);
        });
        break;
    case _this.digst.id:
        _this.digst.func(function(d) {
            ctx.reply(d);
        });
        break;
    default:
        let resp = '[' + cmd + '] : unknow command sorry';
        ctx.reply(resp);
    }
};

CbBot.prototype.logthiscmd = function(cmd, usr) {
    let log = 'COINBOARD_BOT: Received command [' + cmd + '] from ';
    log += '[' + usr.fname + ' ' + usr.lname + ']';
    log += ' ID: ' + usr.id;
    console.log(log);
};

CbBot.prototype.logthismsg = function() {
    let _this = this;
    _this.bot.on('message', (ctx) => {
        let usr = ctx.from.first_name + ' ' + ctx.from.last_name;
        console.log('COINBOARD_BOT: Received msg :');
        console.log('from [' + usr + ']');
        console.log(ctx.message.text);
    });
};

CbBot.prototype.getcommands = function() {
    let _this = this;
    /** Main bot listening command 'getter' function */
    _this.bot.hears(/\/(.+)/, (ctx) => {
        const chatId = ctx.from.id;
        let cmd = ctx.message.text;
        let usr = {
            fname: ctx.from.first_name,
            lname: ctx.from.last_name,
            id: chatId,
        };
        _this.logthiscmd(cmd, usr);
        /** If chat id is your servitor, exec some commands */
        if (chatId == 408942599) {
            _this.runcommands(cmd, ctx);
        }
    });
};
/** Main launcher method
 *  @property {function} bot.start answer Welcome when start
 *  @property {function} bot.command if help cmd answer 'Try send a sticker'
 *  @property {function} bot.hears other way to get a repli from bot
 */
CbBot.prototype.turnmeon = function() {
    let _this = this;
    _this.bot.start((ctx) => {
        console.log('started:', ctx.from.id);
        return ctx.reply('Welcome!');
    });
    _this.bot.hears(/hello/i, (ctx) => {
        let rep = 'Hello M.' + ctx.from.last_name + ', how can I help you ?';
        ctx.reply(rep);
    });
    /** listen for commands */
    _this.getcommands();
    /** Listen for any kind of messages */
    _this.logthismsg();
    /** Polling from telegram servers event */
    _this.bot.startPolling();
};

/** Launching bot !! */
const mibot = new CbBot();
mibot.turnmeon();
/** [Telegram](https://telegram.org) bot for coin_board
 * @see CbBot
 * @module cbbot
 */
/**
 * @namespace telegrambot
 */
