/**
 * @file Route module overload definitions, own routes import
 * @author Trevis Gulby
 */

let Routes = {};
/** index router overloads import */
Routes.index = require('./index/index');
/** assets router overloads import */
Routes.assets = require('./assets/assets');
/** login router overloads import */
Routes.login = require('./login/login');
/** signin router overloads import */
Routes.signin = require('./signin/signin');
/** profile router overloads import */
Routes.profile = require('./profile/profile');
/** livestream router overloads import */
Routes.livestream = require('./livestream/livestream');

module.exports = Routes;
