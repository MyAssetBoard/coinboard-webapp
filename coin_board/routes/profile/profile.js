/**
 * @file Profile page main route controller
 * @author based on express boilerplate and edited by Trevis Gulby
 */

/**  ### {@link profile} page router overload definitions
 * @namespace profile
 * @memberof Routes.page
 */
/** The Express module import
 * @memberof Routes.page.profile
 * @property {Object} express the express object
 */
const express = require('express');
/** The Express router module import
 * @memberof Routes.page.profile
 * @property {Object} router the express.Router object
 */
const router = express.Router();
/** The {@link module:auth~Auth} import
 * @memberof Routes.page.profile
 * @property {Object} Auth see Auth class
 */
const Auth = require('../../controllers/auth_methods');
/** The new auth object
 * @memberof Routes.page.profile
 * @property {Object} auth see {@link module:auth~Auth()} class
 */
const auth = new Auth();
/** @memberof Routes.page.profile */
const param = require('../../params/def_params');

/** GET profile page
 * @memberof Routes.page.profile
 */
router.get('/', function(req, res, next) {
    let chck = req.cookies;

    if (chck && chck.uid && auth.isvaliduid(chck.uid)) {
        let log = '/PROFIlE-route| Auth user, session below\n[';
        log += JSON.stringify(chck) + ']';
        process.env.NODE_ENV == 'development' ?
            console.log(log) :
            log;
        auth.userisAuth(chck.uid, 'profile').then(function(ud) {
            const dup = param.profile;
            let log = 'profile| push user info in params \n[';
            res.locals.data = ud;
            /* istanbul ignore next */
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
        log = 'profile-route| NonAUth user, session below\n[';
        log += JSON.stringify(chck) + '] cookie ? [';
        log += JSON.stringify(req.cookies) + ']';
        /* istanbul ignore next */
        process.env.NODE_ENV == 'development' ?
            console.log(log) :
            log;
        res.render('page', param.profile);
    }
});

module.exports = router;
