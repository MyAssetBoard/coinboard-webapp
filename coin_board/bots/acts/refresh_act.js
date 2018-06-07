/**
 * @file Refresh aka {@link module:cbbot~telegrambot.refresh}
 * bot method definition
 * @author Trevis Gulby
 * @license MIT
 */

const {
    spawn,
} = require('child_process');
/** The Telegram bot /refresh command object
 * @namespace
 * @memberof module:cbbot~telegrambot
 * @property {string} id telegram bot style command, '/ + cmd'
 * @property {function} func the actual command, here lanch data crawling task
 */
const refresh = {
    id: '/refresh',
    func: function (args, usr, callback) {
        process.env['NODE_LOG'] = 'djunk';
        process.env['SCRAPPERID'] = args.toString();
        process.env['LAUNCH_TASK'] = 'goeat';
        const fp = 'coin_board/controllers/datajunk_methods.js';
        const cmd = 'node';
        const exe = spawn(cmd, [fp]);
        exe.stdout.on('data', (data) => {
            let resp = data.toString();
            callback && callback(resp);
        });

        exe.stderr.on('data', (data) => {
            let resp = data.toString();
            callback && callback(resp);
        });

        exe.on('close', (code) => {
            let log = 'Refresh: "$ ' + cmd;
            log += '" child process exited with code [' + code + ']';
            process.env.NODE_ENV === 'development' ? console.log(log) : log;
            callback && callback(log);
        });
    },
};
module.exports = refresh;
