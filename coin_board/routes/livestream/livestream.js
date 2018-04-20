/**
 * @file Livestream page
 * @author Trevis Gulby
 */

/**  ### {@link livestream} page router overload definitions
 * @namespace livestream
 * @memberof Routes.page
 */
/** The Express module import
 * @memberof Routes.page.livestream
 * @property {Object} express the express object
 */
const express = require('express');
/** The Express router module import
 * @memberof Routes.page.livestream
 * @property {Object} router the express.Router object
 */
const router = express.Router();
/** The {@link module:auth~Auth} import
 * @memberof Routes.page.livestream
 * @property {Object} Auth see Auth class
 */
const Auth = require('../../controllers/auth_methods');
/** The new auth object
 * @memberof Routes.page.livestream
 * @property {Object} auth see {@link module:auth~Auth()} class
 */
const auth = new Auth();
/** @memberof Routes.page.livestream */
const param = require('../../params/def_params');

/** GET livestream page
 * @memberof Routes.page.livestream
 */
router.get('/', function(req, res, next) {
    let chck = req.session;

    if (chck && chck.uid && auth.isvaliduid(chck.uid)) {
        param.logco('LIVESTREAM', chck);
        auth.userisAuth(chck.uid, 'livestream').then((userdata) => {
            let dup = param.livestream;
            let log = 'livestream| push user info in params \n[';
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
        param.lognoco('LIVESTREAM', chck);
        /* istanbul ignore next */
        process.env.NODE_ENV == 'development' ? console.log(log) : log;
        res.render('page', param.livestream);
    }
});

module.exports = router;
