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

const User = require('../../Schemas/user');

/** @memberof Routes.page.profile */
const param = require('../../params/def_params');

/** GET profile page
 * @memberof Routes.page.profile
 */
router.get('/', function(req, res, next) {
    let chck = req.session;

    if (chck && chck.userId) {
        User.findById(chck.userId).exec(function(error, user) {
            param.logco('PROFILE', chck);
            if (error) {
                return next(error);
            } else {
                if (user === null) {
                    let err = new Error('Not authorized! Go back!');
                    err.status = 400;
                    return next(err);
                } else {
                    dup = param.profile;
                    res.locals.data = user;
                    return res.render('page', dup);
                }
            }
        });
    } else {
        param.lognoco('PROFILE', chck);
        res.render('page', param.profile);
    }
});

module.exports = router;
