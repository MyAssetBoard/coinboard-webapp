/**
 * @file Route module overload definitions, own routes import
 * @author Trevis Gulby
 */

let Routes = {};
/** index router overloads import */
Routes.index = require('./index');
/** assets router overloads import */
Routes.assets = require('./assets');
/** login router overloads import */
Routes.login = require('./login');
/** signin router overloads import */
Routes.signin = require('./signin');
/** profile router overloads import */
Routes.profile = require('./profile');
/** livestream router overloads import */
Routes.livestream = require('./livestream');

module.exports = Routes;
