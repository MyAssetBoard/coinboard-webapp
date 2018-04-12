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
const Auth = require('../../methods/auth_methods');
/** The new auth object
 * @memberof Routes.page.index
 * @property {Object} auth see {@link module:auth~Auth()} class
 */
const auth = new Auth();
/** @memberof Routes.page.index */
const param = require('../../params/index_param');

/** GET index page
 * @memberof Routes.page.index
 */
router.get('/', function(req, res, next) {
    let chck = req.cookies;

    if (chck && chck.uid && auth.isvaliduid(chck.uid)) {
        let log = '/INDEX-route| Auth user, session below\n[';
        log += JSON.stringify(chck) + ']';
        process.env.NODE_ENV == 'development' ?
            console.log(log) :
            log;
        auth.userisAuth(chck.uid, 'index').then(function(result) {
            const dup = param;
            let log = 'index| push user info in params \n[';
            res.locals.data = result;
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
            res.render('page', param);
        });
    } else {
        log = 'index-route| NonAUth user, session below\n[';
        log += JSON.stringify(chck) + '] cookie ? [';
        log += JSON.stringify(req.cookies) + ']';
        /* istanbul ignore next */
        process.env.NODE_ENV == 'development' ?
            console.log(log) :
            log;
        res.render('page', param);
    }
});

module.exports = router;
