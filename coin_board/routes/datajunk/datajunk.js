/**
 * @file DataJunk router controllers
 * @author based on whatever its take to suceed boilerplate by Trevis Gulby
 */

/**  ### {@link datajunk} page router overload definitions
 * @namespace datajunk
 * @memberof Routes.page
 */
/** The Express module import
 * @memberof Routes.page.datajunk
 * @property {Object} express the express object
 */
const express = require('express');

/** The Express router module import
 * @memberof Routes.page.signin
 * @property {Object} router the express.Router object
 */
const router = new express.Router();

/** @memberof Routes.page.signin */
const param = require('../../params/def_params');
/** User mongoose model import for authentication
 * @memberof Routes.page.signin
 */
const User = require('../../schemas/user');
/** Scrapper mongoose model import
 * @memberof Routes.page.datajunk
 */
const Scrapper = require('../../schemas/scrapper');

/** GET signin page
 * @memberof Routes.page.signin
 */
router.get('/', function (req, res, next) {
    let chck = req.session;

    if (chck && chck.userId) {
        User.findById(chck.userId).exec(function (error, user) {
            if (error || !user) {
                console.log('errr ..' + error);
                return res.redirect('/');
            } else if (user.scrapperid !== 'notset') {
                Scrapper.findById(user.scrapperid)
                    .exec((error, scrapper) => {
                        if (error) {
                            console.log(error);
                            return res.redirect('/datajunk');
                        }
                        param.logco('DATAJUNK', chck);
                        res.locals.data = user.toJSON();
                        res.locals.scrapper = scrapper.toJSON();
                        return res.render('page', param.datajunk);
                    });
            } else {
                param.logco('DATAJUNK', chck);
                param.datajunk.blocks.centerblock =
                    'blocks/datajunk/scrapper_block';
                res.locals.data = user.toJSON();
                return res.render('page', param.datajunk);
            }
        });
    } else {
        param.lognoco('DATAJUNK', chck);
        res.redirect('/login');
    }
});

/**
 * @param {string} path
 * @param {function} callback
 * @memberof Routes.page.datajunk
 */
router.post('/newscrapper', function (req, res, next) {
    let chck = req.session;
    if (!req.body.name || !req.body.name.length ||
        !(chck && chck.userId)) {
        let err = new Error('All fields required.');
        err.status = 400;
        console.log('err...' + err);
        return res.redirect('/datajunk');
    } else {
        User.findById(chck.userId).exec((error, user) => {
            if (user) {
                Scrapper.create({name: req.body.name}, (error, scrapper) => {
                    let apisid = {};
                    apisid['scrapperid'] = scrapper._id;
                    User.findOneAndUpdate({_id: chck.userId}, apisid,
                        (error, success) => {
                            if (error) {
                                res.redirect('/datajunk');
                            }
                            return res.redirect('/datajunk');
                        });
                });
            }
        });
    }
});
/**
 * @param {string} path
 * @param {function} callback
 * @memberof Routes.page.datajunk
 */
router.post('/scrapper/newsource', function (req, res, next) {
    param.logco('post scrapper newsource', req.session.userId);
    if (!req.body.name || !req.body.name.length ||
        !req.body.sourcegenre || !req.body.sourcetype ||
        !req.body.sourcename || !req.body.sourcereqpath ||
        !(req.session && req.session.userId)) {
        let err = new Error('All fields required.');
        err.status = 400;
        console.log(err);
        return res.redirect('/datajunk');
    } else {
        User.findById(req.session.userId).exec((error, user) => {
            if (user) {
                let newsource = {
                    scrapperid: user.scrapperid,
                    sourcegenre: req.body.sourcegenre,
                    sourcetype: req.body.sourcetype,
                    sourcename: req.body.sourcename,
                    sourceurl: req.body.sourceurl,
                    sourcereqhost: req.body.sourcereqhost,
                    sourcereqpath: req.body.sourcereqpath,
                    sourceregex: req.body.sourceregex,
                };
                Scrapper.addsource(newsource, (error, scrapper) => {
                    console.log(scrapper);
                    return res.redirect('/datajunk');
                });
            }
        });
    }
});

module.exports = router;
