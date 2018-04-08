/**
 * @file Login page main route controller
 * @author based on express boilerplate and edited by Trevis Gulby
 */

const express = require('express');
const router = express.Router();
const Auth = require('../../methods/auth_methods');
const param = require('../../params/login_param');

/**
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
 * @param {Object} req
 * @param {Object} res
 */
function setCookie(req, res) {
    let log = '';
    let setting = {
        maxAge: 900000,
        httpOnly: false,
    };
    res.cookie('uid', req.params.uid, setting);
    log = 'cookie successfully added';
    process.env.NODE_ENV == 'development' ?
        console.log(log) :
        log;
}

/**
 * @param {Object} req
 * @param {Object} res
 * @param {Object} next
 */
router.get('/', function(req, res, next) {
    let chck = req.cookies;
    let log = '';
    const auth = new Auth();

    if (chck && chck.uid && auth.isvaliduid(chck.uid)) {
        log = '/LOGIN-route : Auth user, session below\n[';
        log += JSON.stringify(chck) + ']';
        process.env.NODE_ENV == 'development' ?
            console.log(log) :
            log;
        auth.userisAuth(chck.uid, 'login').then(function(result) {
            let dup = param;
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
            res.render('page', param);
        });
    } else {
        log = 'login-route| NonAUth user, session below\n[';
        log += JSON.stringify(chck) + '] cookie ? [';
        log += JSON.stringify(req.cookies) + ']';
        process.env.NODE_ENV == 'development' ?
            console.log(log) :
            log;

        res.render('page', param);
    }
});

/**
 * @param {string} path
 * @param {function} callback
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
        setCookie(req, res, next);
        log = '\ncookies - sets' + JSON.stringify(req.cookies);
        process.env.NODE_ENV == 'development' ?
            console.log(log) :
            log;
        res.redirect(param.tvurl + 'assets/dashboard');
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
