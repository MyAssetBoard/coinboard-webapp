/**
 * @file {@link Routes.page.signin} Router overload definitions
 * @author based on express boilerplate and edited by Trevis Gulby
 */

/**  ### {@link signin} page router overload definitions
 * @namespace signin
 * @memberof Routes.page
 */
/** The Express module import
 * @memberof Routes.page.signin
 * @property {Object} express the express object
 */
const express = require('express');
/** The Express router module import
 * @memberof Routes.page.signin
 * @property {Object} router the express.Router object
 */
const router = express.Router();
/** The {@link module:auth~Auth} import
 * @memberof Routes.page.signin
 * @property {Object} Auth see Auth class
 */
const Auth = require('../../controllers/auth_methods');
/** The new auth object
 * @memberof Routes.page.signin
 * @property {Object} auth see {@link module:auth~Auth()} class
 */
const auth = new Auth();
/** @memberof Routes.page.signin */
const param = require('../../params/def_params');

/** GET signin page
 * @memberof Routes.page.signin
 */
router.get('/', function(req, res, next) {
    let chck = req.session;

    if (chck && chck.uid && auth.isvaliduid(chck.uid)) {
        param.logco('SIGNIN', chck);
        auth.userisAuth(chck.uid, 'profile').then((userdata) => {
            const dup = param.signin;
            let log = 'signin| push user info in params \n[';
            res.locals.data = userdata;
            log += JSON.stringify(res.locals.data) + ']';
            /* istanbul ignore next */
            process.env.NODE_ENV == 'development' ? console.log(log) : log;
            res.render('page', dup);
        }).catch((err) => {
            next(err);
        });
    } else {
        param.lognoco('SIGNIN', chck);
        res.render('page', param.signin);
    }
});

module.exports = router;
