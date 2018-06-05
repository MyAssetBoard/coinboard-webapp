/**
 * @file Login page main route controller
 * @author based on express boilerplate and edited by Trevis Gulby
 */

/**  ### {@link login} page router overload definitions
 * @namespace login
 * @memberof Routes.page
 */
/** The Express module import
 * @memberof Routes.page.login
 * @property {Object} express the express object
 */
const express = require('express');
/** The Express router module import
 * @memberof Routes.page.login
 * @property {Object} router the express.Router object
 */

const router = new express.Router();
/** The {@link module:auth~Auth} import
 * @memberof Routes.page.login
 * @property {Object} Auth see Auth class
 */

/** @memberof Routes.page.login */
const param = require('../../params/def_params');
/** User mongoose model import
 * @memberof Routes.page.login
 */
const User = require('../../schemas/user');

/**
 * @param {Object} req
 * @param {Object} res
 * @param {Object} next
 * @memberof Routes.page.login
 */
router.get('*', function (req, res, next) {
    let chck = req.session;

    if (chck && chck.userId) {
        User.findById(chck.userId).exec(function (error, user) {
            if (error) {
                console.log('errr ..' + error);
                return res.render('page', param.login);
            } else if (user === null) {
                let err = new Error('Not authorized! Go back!');
                err.status = 400;
                console.log('errr ..');
                return res.render('page', param.login);
            } else {
                param.logco('LOGIN', chck);
                return res.redirect('/profile');
            }
        });
    } else {
        param.lognoco('LOGIN', chck);
        res.render('page', param.login);
    }
});

/**
 * @param {string} path
 * @param {function} callback
 * @memberof Routes.page.login
 */
router.post('/*', function (req, res, next) {
    if (req.body.logusername && req.body.logpassword) {
        User.authenticate(req.body.logusername, req.body.logpassword,
            function (error, user) {
                if (error || !user) {
                    let err = new Error('Wrong username or password.');
                    err.status = 401;
                    return res.redirect('/login');
                } else {
                    req.session.userId = user._id;
                    /** Browser user agent so browser response */
                    if (req.headers['user-agent'] &&
                        req.headers['user-agent'].length > 5) {
                        return res.redirect('/assets/dashboard');
                    } else {
                        /** Bot / ET / curl / wget / whatever code request */
                        let jsonresp = {token: req.session.userId};
                        return res.send(JSON.stringify(jsonresp));
                    }
                }
            });
    } else {
        let err = new Error('All fields required.');
        err.status = 400;
        return next(err);
    }
});

module.exports = router;
