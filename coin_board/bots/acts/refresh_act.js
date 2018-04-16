/**
 * @file Refresh aka {@link module:cbbot~telegrambot.refresh}
 * bot method definition
 * @author Trevis Gulby
 */

const
{
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
    func: function(args, usr, callback) {
        process.env['NODE_ENV'] = 'development';
        process.env['NODE_LOG'] = 'djunk';
        process.env['LAUNCH_TASK'] = 'goeat';
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
            r = 'Child process exited with code [' + code + ']';
            callback && callback(r);
        });
    },
};
module.exports = refresh;
