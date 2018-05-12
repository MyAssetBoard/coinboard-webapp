/**
 * @file Datamine aka {@link module:cbbot~telegrambot.digest}
 * bot method definition
 * @author Trevis Gulby
 * @license MIT
 */

const {
    spawn,
} = require('child_process');
/** The Telegram bot /digest command object
 * @namespace
 * @memberof module:cbbot~telegrambot
 * @property {string} id telegram bot style command, '/ + cmd'
 * @property {function} func the actual command, launch data analyse task
 */
const digest = {
    id: '/digest',
    func: function(args, usr, callback) {
        process.env['NODE_LOG'] = 'djunk';
        process.env['LAUNCH_TASK'] = 'gomine';
        const fp = 'coin_board/controllers/datajunk_methods.js';
        const exe = spawn('node', [fp]);
        exe.stdout.on('data', (data) => {
            let r = data.toString();
            callback && callback(r);
        });

        exe.stderr.on('data', (data) => {
            let r = data.toString();
            callback && callback(r);
        });

        exe.on('close', (code) => {
            let r = 'Chid process exited with code [' + code + ']';
            callback && callback(r);
        });
    },
};
module.exports = digest;
