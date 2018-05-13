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
const router = new express.Router();

/** @memberof Routes.page.assets */
const param = require('../../params/def_params');
/** This {@link page.assets} special router  import
 * @memberof Routes.page.assets
 * @property {Object} roads see ..
 */
const roads = require('./assets_roads');

/** User mongoose schemas import
 * @memberof Routes.page.assets
 */
const User = require('../../schemas/user');


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
                req.match(roads[paths].path)) {
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
    let chck = req.session;

    if (chck && chck.userId) {
        User.findById(chck.userId).lean().exec((error, user) => {
            if (error) {
                return next(error);
            } else {
                if (user === null) {
                    let err = new Error('Not authorized! Go back!');
                    err.status = 400;
                    return next(err);
                } else {
                    param.logco('ASSETS', chck);
                    dup = param.assets;
                    res.locals.data = user;
                    setpagecontent(req.originalUrl, dup, res.locals.data)
                        .then((d) => {
                            if (d != 'nop') {
                                if (d.feed && d.dm) {
                                    res.locals.news = d.feed;
                                    res.locals.dms = d.dm;
                                }
                                if (d.blocks) {
                                    res.locals.routes = d.blocks;
                                }
                            }
                            return res.render('page', dup);
                        });
                }
            }
        });
    } else {
        param.lognoco('ASSETS', chck);
        /* istanbul ignore next */
        process.env.NODE_ENV == 'development' ? console.log(log) : log;
        res.render('page', param.assets);
    }
});

router.post('/addapis', function(req, res, next) {
    let dup = param.assets;
    if (req.body.apitype && req.body.apiid &&
        req.body.apikey && req.body.apisecret &&
        req.session && req.session.userId) {
        User.addapi(req.session.userId, req.body.apitype,
            req.body.apiid, req.body.apikey,
            req.body.apisecret, (error, user) => {
                if (user) {
                    res.locals.data = user;
                    return res.redirect('/assets/api/param');
                } else if (error) {
                    console.log(error);
                    return res.render('page', dup);
                }
            });
    } else {
        param.logco('ASSETS', req.session);
        /* istanbul ignore next */
        process.env.NODE_ENV == 'development' ? console.log(log) : log;
        res.render('page', param.assets);
    }
});

router.post('/addasset', function(req, res, next) {
    let dup = param.assets;
    if (req.body.assettype && req.body.assetid &&
        req.body.assetticker && req.body.assetqtt &&
        req.session && req.session.userId) {
        User.addasset(req.session.userId, req.body.assettype,
            req.body.assetid, req.body.assetticker,
            req.body.assetqtt, (error, user) => {
                if (user) {
                    res.locals.data = user;
                    return res.redirect('/assets/dashboard');
                } else if (error) {
                    console.log(error);
                    return res.render('page', dup);
                }
            });
    } else {
        param.logco('ASSETS', req.session);
        /* istanbul ignore next */
        process.env.NODE_ENV == 'development' ? console.log(log) : log;
        res.render('page', param.assets);
    }
});

module.exports = router;
