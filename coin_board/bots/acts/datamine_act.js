/**
 * @file Datamine (aka /{@link digest}) bot method definition
 * @author Trevis Gulby
 */

/** for launching unix process */
const
{
    spawn,
} = require('child_process');
/** The Telegram bot /digest command object
 *@namespace
 * @property {string} id telegram bot style command, '/ + cmd'
 * @property {function} func the actual command, here lanch data analyse task
 */
const digest = {
    id: '/digest',
    func: function(callback) {
        process.env['NODE_ENV'] = 'development';
        process.env['NODE_LOG'] = 'djunk';
        process.env['LAUNCH_TASK'] = 'markme';
        const fp = 'coin_board/methods/datajunk_methods.js';
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
