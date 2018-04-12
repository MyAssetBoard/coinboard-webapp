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
const Auth = require('../../methods/auth_methods');
/** The new auth object
 * @memberof Routes.page.signin
 * @property {Object} auth see {@link module:auth~Auth()} class
 */
const auth = new Auth();
/** @memberof Routes.page.signin */
const param = require('../../params/signin_param');

/** GET signin page
 * @memberof Routes.page.signin
 */
router.get('/', function(req, res, next) {
    let chck = req.cookies;

    if (chck && chck.uid && auth.isvaliduid(chck.uid)) {
        let log = 'signin-route : Auth user | session below\n[';
        log += JSON.stringify(chck) + ']';
        process.env.NODE_ENV == 'development' ?
            console.log(log) :
            log;
        auth.userisAuth(chck.uid, 'profile').then(function(ud) {
            const dup = param;
            let log = 'signin| push user info in params \n[';
            res.locals.data = ud;
            log += JSON.stringify(res.locals.data) + ']';
            /* istanbul ignore next */
            process.env.NODE_ENV == 'development' ?
                console.log(log) :
                log;
            res.render('page', dup);
        }).catch(function(err) {
            if (err) {
                throw err;
            }
            next(err);
        });
    } else {
        log = 'signin-route| NonAUth user, session below\n[';
        log += JSON.stringify(chck) + '] cookie ? [';
        log += JSON.stringify(req.cookies) + ']';
        process.env.NODE_ENV == 'development' ?
            console.log(log) :
            log;
        res.render('page', param);
    }
});

module.exports = router;
