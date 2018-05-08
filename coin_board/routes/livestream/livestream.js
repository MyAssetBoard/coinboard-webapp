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

/** @memberof Routes.page.livestream */
const param = require('../../params/def_params');

/** User mongoose model import
 * @memberof Routes.page.livestream
 */
const User = require('../../Schemas/user');

/** GET livestream page
 * @memberof Routes.page.livestream
 */
router.get('/', function(req, res, next) {
    let chck = req.session;

    if (chck && chck.userId) {
        User.findById(chck.userId).exec(function(error, user) {
            if (error) {
                console.log('errr ..' + error);
                return res.render('page', param.livestream);
            } else if (user === null) {
                let err = new Error('Not authorized! Go back!');
                err.status = 400;
                console.log('errr ..');
                return res.render('page', param.livestream);
            } else {
                dup = param.livestream;
                res.locals.data = user;
                param.logco('LIVESTREAM', chck);
                return res.render('page', dup);
            }
        });
    } else {
        param.lognoco('LIVESTREAM', chck);
        res.render('page', param.livestream);
    }
});

module.exports = router;
