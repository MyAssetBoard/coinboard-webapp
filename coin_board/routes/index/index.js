/**
 * @file Index page main route controller
 * @author Based on express boilerplate and edited by Trevis Gulby
 */

/** WIP REACT */
// const React = require('react');
// const myComponent = require('../../HelloComponent');
// const ReactComponent = React.createFactory(myComponent);


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

/** @memberof Routes.page.index */
const param = require('../../params/def_params');

const User = require('../../Schemas/user');
/** GET index page
 * @memberof Routes.page.index
 */
router.get('/', function(req, res, next) {
    let chck = req.session;

    if (chck && chck.userId) {
        User.findById(chck.userId).exec(function(error, user) {
            if (error) {
                console.log('errr ..' + error);
                return res.render('page', param.index);
            } else if (user === null) {
                let err = new Error('Not authorized! Go back!');
                err.status = 400;
                console.log('errr ..');
                return res.render('page', param.index);
            } else {
                param.logco('INDEX', chck);
                dup = param.index;
                res.locals.data = user;
                return res.render('page', dup);
            }
        });
    } else {
        param.lognoco('INDEX', chck);
        res.render('page', param.index);
    }
});

module.exports = router;
