/**
 * @file Showfile (aka /tree {@link showfiles}) bot method definition
 * @author Trevis Gulby
 */

/** for launching unix process */
const
{
    spawn,
} = require('child_process');
/** The Telegram bot /tree command object
 * @namespace
 * @property {string} id telegram bot style command, '/ + $cmd'
 * @property {function} func the actual command, here lanch 'tree $datadir' cmd
 */
const showfiles = {
    id: '/tree',
    func: function(callback) {
        const fp = './DTAFOOD/';
        const ls = spawn('tree', [fp]);
        ls.stdout.on('data', (data) => {
            resp = data.toString();
            callback && callback(resp);
        });

        ls.stderr.on('data', (data) => {
            resp = 'ERROR : \n';
            resp += data.toString();
            callback && callback(resp);
        });

        ls.on('close', (code) => {
            let log = 'child process exited with code ' + code;
            console.log(log);
        });
    },
};
module.exports = showfiles;
