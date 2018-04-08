/**
 * @file Signin page main route controller
 * @author based on express boilerplate and edited by Trevis Gulby
 */

const express = require('express');
const router = express.Router();
const Auth = require('../../methods/auth_methods');
const auth = new Auth();
const param = require('../../params/signin_param');

/* GET home page. */
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
