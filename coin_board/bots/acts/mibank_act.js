/** The Telegram bot /digest command object
 * @namespace
 * @memberof module:cbbot~telegrambot
 * @property {string} id telegram bot style command, '/ + cmd'
 * @property {function} func the actual command, here lanch data analyse task
 */

const Apis = require('../../controllers/api_methods');
const apis = new Apis();

const mibank = {
    id: '/mibank',
    func: function(args, usr, callback) {
        apis.getbankposition(args, usr).then((res) => {
            return callback && callback(res);
        });
    },
};

module.exports = mibank;
