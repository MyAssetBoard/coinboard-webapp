/**
 * @file Route module overload definitions, own routes import
 * @author Trevis Gulby
 */

/** @property {Object} Routes  router pages module
 * @constructor
 */
const Routes = {};
/** @property {Object} Routes.index page router overloads import */
Routes.index = require('./index/index');
/** @property {Object} assets page router overloads import */
Routes.assets = require('./assets/assets');
/** @property {Object} login page router overloads import */
Routes.login = require('./login/login');
/** @property {Object} signin page router overloads import */
Routes.signin = require('./signin/signin');
/** @property {Object} profile page router overloads import */
Routes.profile = require('./profile/profile');
/** @property {Object} livestream page router overloads import */
Routes.livestream = require('./livestream/livestream');
/** @property {Object} datajunk page router submodule */
Routes.datajunk = require('./datajunk/datajunk');

module.exports = Routes;
/** ### Contains all this webapp pages
 * @namespace page
 * @memberof Routes
 */
