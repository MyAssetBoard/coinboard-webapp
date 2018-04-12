/**
 * @file Assets page main route controller
 * @author based on express boilerplate and edited by Trevis Gulby
 */

/**  ### {@link assets} page router overload definitions
 * @namespace assets
 * @memberof Routes.page
 */
/** The Express module import
 * @memberof Routes.page.assets
 * @property {Object} express the express object
 */
const express = require('express');
/** The Express router module import
 * @memberof Routes.page.assets
 * @property {Object} router the express.Router object
 */
const router = express.Router();
/** The {@link module:auth~Auth} import
 * @memberof Routes.page.assets
 * @property {Object} Auth see Auth class
 */
const Auth = require('../../methods/auth_methods');
/** @memberof Routes.page.assets */
const param = require('../../params/myassets_param');
/** This {@link page.assets} special router  import
 * @memberof Routes.page.assets
 * @property {Object} roads see ..
 */
const roads = require('./assets_roads');
/** The new auth object
 * @memberof Routes.page.assets
 * @property {Object} auth see Auth() class
 */
const auth = new Auth();

/** Dummy loggin' function
 * Use [express session](https://www.npmjs.com/package/connect-mongodb-session)
 * rather than the current method
 * @memberof Routes.page.assets
 * @param {string} req the requested page
 * @param {Object} sess the user cookie session
 * @TODO cf desc
 */
function logthisusr(req, sess) {
    let log = req + '-route : Auth user, session bellow :\n[';
    log += JSON.stringify(sess) + ']';
    process.env.NODE_ENV == 'development' ?
        console.log(log) :
        log;
}

/** Take the req original url and make it match with the right methods
 * in {@link module:router}
 * @memberof Routes.page.assets
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

/** GET /assets/{all requests}.
 * @memberof Routes.page.assets
 * @param {Object} req the request starting with ADDR/assets/
 */
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
