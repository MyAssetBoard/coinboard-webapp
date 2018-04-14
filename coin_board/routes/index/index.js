/**
 * @file Index page main route controller
 * @author based on express boilerplate and edited by Trevis Gulby
 */

/**  ### {@link index} page router overload definitions
 * @namespace index
 * @memberof Routes.page
 */
/** The Express module import
 * @memberof Routes.page.index
 * @property {Object} express the express object
 */
const express = require('express');
/** The Express router module import
 * @memberof Routes.page.index
 * @property {Object} router the express.Router object
 */
const router = express.Router();
/** The {@link module:auth~Auth} import
 * @memberof Routes.page.index
 * @property {Object} Auth see Auth class
 */
const Auth = require('../../controllers/auth_methods');
/** The new auth object
 * @memberof Routes.page.index
 * @property {Object} auth see {@link module:auth~Auth()} class
 */
const auth = new Auth();
/** @memberof Routes.page.index */
const param = require('../../params/def_params');

/** GET index page
 * @memberof Routes.page.index
 */
router.get('/', function(req, res, next) {
    let chck = req.cookies;

    if (chck && chck.uid && auth.isvaliduid(chck.uid)) {
        param.logco('INDEX', chck);
        auth.userisAuth(chck.uid, 'index').then((userdata) => {
            const dup = param.index;
            let log = 'index| push user info in params \n[';
            res.locals.data = userdata;
            /* istanbul ignore next */
            log += JSON.stringify(res.locals.data) + ']';
            /* istanbul ignore next */
            process.env.NODE_ENV == 'development' ? console.log(log) : log;
            res.render('page', dup);
        }).catch((err) => {
            next(err);
        });
    } else {
        param.lognoco('INDEX', chck);
        res.render('page', param.index);
    }
});

module.exports = router;
