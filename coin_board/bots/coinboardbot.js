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
        /** Commands array */
        this.cmds = [this.rfrsh, this.digst, this.showf];
        /** Import BOT_TOKEN from env
         */
        this.bottoken = process.env.BOT_TOKEN;
        /** Bot startup with new {@link Telegraf} object
         */
        this.bot = new this.Telegraf(this.bottoken);
        /** For checking if user is registered */
        this.Crud = require('../controllers/mongo_crud');
        this.crud = new this.Crud('test2', 'r_users');
    }
}

CbBot.prototype.authme = function(cmd, user, ctx) {
    let _this = this;
    let who = {
        telegramid: user.id.toString(),
    };
    this.crud.finduser(who, (res) => {
        if (res && res.username) {
            _this.runcommands(cmd, ctx);
        } else {
            ctx.reply('Sorry, you must be registered to use bot functions');
        }
    });
};

CbBot.prototype.runcommands = function(cmd, ctx) {
    let _this = this;
    let exec = 0;
    for (let el in this.cmds) {
        if (this.cmds[el] && this.cmds[el].id == cmd) {
            exec += 1;
            _this.cmds[el].func((d) => {
                ctx.reply(d);
            });
        }
    }
    if (!exec) {
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
        _this.authme(cmd, usr, ctx);
    });
};
/** Main launcher method
 *  @property {function} bot.start answer Welcome when start
 *  @property {function} bot.hello if hello cmd answer with Welcome message
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
