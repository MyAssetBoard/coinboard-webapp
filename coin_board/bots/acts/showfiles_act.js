/**
 * @file Showfiles aka {@link module:cbbot~telegrambot.showfiles}
 * bot method definition
 * @author Trevis Gulby
 * @license MIT
 */

const {
    spawn,
} = require('child_process');
/** The Telegram bot /tree command object
 * @namespace
 * @memberof module:cbbot~telegrambot
 * @property {string} id telegram bot style command, '/ + $cmd'
 * @property {function} func the actual command, here lanch 'tree $datadir' cmd
 */
const showfiles = {
    id: '/tree',
    func: function (args, usr, callback) {
        const fp = process.env.HEROKU == 'ok' ? '-R DTAFOOD' : './DTAFOOD/';
        const cmd = process.env.HEROKU == 'ok' ? 'ls' : 'tree';
        const tree = spawn(cmd, [fp]);
        tree.stdout.on('data', (data) => {
            resp = data.toString();
            callback && callback(resp);
        });

        tree.stderr.on('data', (data) => {
            resp = 'ERROR : \n';
            resp += data.toString();
            callback && callback(resp);
        });

        tree.on('close', (rt) => {
            let log = 'Showfiles: "$ ' + cmd;
            log += '" child process exited with code [' + rt + ']';
            process.env.NODE_ENV === 'development' ? console.log(log) : log;
            callback && callback(log);
        });
    },
};
module.exports = showfiles;
