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

/** @memberof Routes.page.signin */
const param = require('../../params/def_params');
/** User mongoose Schemas import */
const User = require('../../Schemas/user');

/** GET signin page
 * @memberof Routes.page.signin
 */
router.get('/', function(req, res, next) {
    let chck = req.session;

    if (chck && chck.userId) {
        User.findById(chck.userId).exec(function(error, user) {
            if (error) {
                console.log('errr ..' + error);
                return res.redirect('/');
            } else if (user === null) {
                let err = new Error('Not authorized! Go back!');
                err.status = 400;
                console.log('errr ..');
                return res.redirect('/');
            } else {
                param.logco('SIGNIN', chck);
                return res.redirect('/profile');
            }
        });
    } else {
        param.lognoco('SIGNIN', chck);
        res.render('page', param.signin);
    }
});

/**
 * @param {string} path
 * @param {function} callback
 * @memberof Routes.page.signin
 */
router.post('/', function(req, res, next) {
    if (req.body.password !== req.body.passwordConf) {
        let err = new Error('Passwords do not match.');
        err.status = 400;
        console.log('password dont match');
        res.send('passwords dont match');
        return res.redirect('/signin');
    }

    if (req.body.email &&
        req.body.username &&
        req.body.usercurrency &&
        req.body.password &&
        req.body.passwordConf) {
        let userData = {
            email: req.body.email,
            username: req.body.username,
            usercurrency: req.body.usercurrency,
            ethaddr: req.body.ethaddr ? req.body.ethaddr : 'NONE',
            telegramid: req.body.telegramid ? req.body.telegramid : 'NONE',
            password: req.body.password,
        };

        User.create(userData, (error, user) => {
            if (error) {
                return next(error);
            } else {
                req.session.userId = user._id;
                return res.redirect(param.assets.tvurl + 'assets/dashboard');
            }
        });
    } else {
        let err = new Error('All fields required.');
        err.status = 400;
        console.log('err...');
        return res.redirect('/signin');
    }
});

module.exports = router;
