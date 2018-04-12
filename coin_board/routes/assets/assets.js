/**
 * @file Assets page main route controller
 * @author based on express boilerplate and edited by Trevis Gulby
 */

const express = require('express');
const router = express.Router();
const Auth = require('../../methods/auth_methods');
const param = require('../../params/myassets_param');
const roads = require('./assets_roads');
const auth = new Auth();

/** Dummy loggin' function
 * @param {string} req the requested page
 * @param {Object} sess the user cookie session
 * @TODO Use express session rather than that
 */
function logthisusr(req, sess) {
    let log = req + '-route : Auth user, session \n[';
    log += JSON.stringify(sess) + ']';
    process.env.NODE_ENV == 'development' ?
        console.log(log) :
        log;
}

/** Take the req original url and make it match with the right methods
 * in {@link module:router}
 * @param {string} req the requested route / methods
 * @param {Object} pageparam a copy of the original page template engine vars
 * @param {Object} dbr the user data to strip
 * @property {Object} res used to carry the roads component methods and vars
 * @return {Promise} the requested page /content or 'nope' string if any
 */
function setpagecontent(req, pageparam, dbr) {
    return new Promise((resolve, reject) => {
        let res = {};
        for (let paths in roads) {
            if (roads.hasOwnProperty(paths) &&
                roads[paths].path == req) {
                if (roads[paths].getd) {
                    res.getcontent = roads[paths].getd;
                }
                if (roads[paths].stripd) {
                    res.stripud = roads[paths].stripd;
                }
                break;
            }
        }
        if (res.getcontent) {
            res.getcontent(function(rt) {
                if (rt && rt.blocks) {
                    if (rt.scripts) {
                        pageparam.scripts['foo'] = rt.scripts[0];
                    }
                    if (res.stripud) {
                        res.stripud(dbr);
                    }
                    resolve(rt);
                }
            });
        } else {
            resolve('nop');
        }
    });
}

/* GET assets page. */
router.get('/*', function(req, res, next) {
    let chck = req.cookies;

    if (chck &&
        chck.uid &&
        auth.isvaliduid(chck.uid)) {
        logthisusr(req.originalUrl, chck);
        auth.userisAuth(chck.uid, 'assets')
            .then(function(result) {
                let dup = param;
                res.locals.data = result;
                setpagecontent(req.originalUrl, dup, res.locals.data)
                    .then(function(d) {
                        if (d != 'nop') {
                            if (d.feed && d.dm) {
                                res.locals.news = d.feed;
                                res.locals.dms = d.dm;
                            }
                            if (d.blocks) {
                                res.locals.routes = d.blocks;
                            }
                            if (d.userapi) {
                                res.locals.userapi = d.userapi;
                            }
                        } else {
                            console.log('nop !??');
                        }
                        let log = 'myassets| push user info in params\n[';
                        /* istanbul ignore next */
                        log += JSON.stringify(res.locals.data) + ']';
                        /* istanbul ignore next */
                        process.env.NODE_ENV == 'development' ?
                            console.log(log) :
                            log;
                        res.render('page', dup);
                    }).catch(function(rej, err) {
                        if (err) {
                            reject(err);
                            throw err;
                        }
                    });
            }).catch(function(rej, err) {
                next(err);
            });
    } else {
        /* istanbul ignore next */
        log = req.originalUrl + '-route| NonAUth user, session \n[';
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
