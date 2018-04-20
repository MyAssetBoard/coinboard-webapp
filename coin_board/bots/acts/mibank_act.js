/**
 * @file Datamine aka {@link module:cbbot~telegrambot.mibank}
 * bot method definition
 * @author Trevis Gulby
 * @license MIT
 */

const Apis = require('../../controllers/api_methods');
const apis = new Apis();

/** The Telegram bot /mibank command object
 * @namespace
 * @memberof module:cbbot~telegrambot
 * @property {string} id telegram bot style command, '/ + cmd'
 * @property {function} func the actual command, here lanch get bank account
 * balance per param element
 */
const mibank = {
    id: '/mibank',
    func: function(args, usr, callback) {
        apis.getbankposition(args, usr).then((res) => {
            return callback && callback(res);
        });
    },
};

module.exports = mibank;
