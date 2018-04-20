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

const router = express.Router();
/** The {@link module:auth~Auth} import
 * @memberof Routes.page.login
 * @property {Object} Auth see Auth class
 */
const Auth = require('../../controllers/auth_methods');
/** @memberof Routes.page.login */
const param = require('../../params/def_params');

/**
 * @memberof Routes.page.login
 * @param {Object} req
 * @param {Object} res
 */
function render403(req, res) {
    'use strict';
    let response = '\n\tTry this : ":(){ :|:& }:"\n';
    response += '\t& go rtfm :)\n';
    res.status(403).send(response);
}

router.post('/', render403);

/**
 * Set cookie with uid value for authentification
 * on other pages
 * @memberof Routes.page.login
 * @param {Object} req
 * @param {Object} res
 */
function setCookie(req, res) {
    let log = '';
    req.session.uid = req.params.uid;
    log = 'cookie successfully added';
    process.env.NODE_ENV == 'development' ?
        console.log(log) :
        log;
}

/**
 * @param {Object} req
 * @param {Object} res
 * @param {Object} next
 * @memberof Routes.page.login
 */
router.get('/', function(req, res, next) {
    let chck = req.session;
    const auth = new Auth();

    if (chck && chck.uid && auth.isvaliduid(chck.uid)) {
        param.logco('LOGIN', chck);
        auth.userisAuth(chck.uid, 'login').then((result) => {
            let dup = param.login;
            let log = 'login| push user info in params\n[';
            /** Expose data to ejs template */
            res.locals.data = result;
            log += JSON.stringify(res.locals.data) + ']';
            process.env.NODE_ENV == 'development' ?
                console.log(log) :
                log;
            res.render('page', dup);
        }).catch(function(rej, err) {
            console.log('error user check');
            res.render('page', param.error);
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
router.get('/id/:uid', function(req, res, next) {
    const auth = new Auth();
    let log = '';
    if (auth.isvaliduid(req.params.uid)) {
        log = 'received id request with value :\n';
        log += JSON.stringify(req.params);
        log += '\nSession dump bellow\n[';
        log += JSON.stringify(req.session) + ']';
        process.env.NODE_ENV == 'development' ?
            console.log(log) :
            log;
        setCookie(req, res);
        log = '\ncookies - sets' + JSON.stringify(req.session);
        process.env.NODE_ENV == 'development' ?
            console.log(log) :
            log;
        res.redirect(param.assets.tvurl + 'assets/dashboard');
    } else {
        log = ('invalid uid');
        process.env.NODE_ENV == 'development' ?
            console.log(log) :
            log;
        let err = new Error('Bad request');
        err.status = 403;
        next(err);
    }
});

module.exports = router;
