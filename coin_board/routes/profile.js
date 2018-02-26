/**
* @file @Index page route methods definitions
* @author based on express boilerplate and edited by Trevis Gulby
*/

var express;
var router;
var authMod;

express = require('express');
router = express.Router();
authMod = require('../methods/auth_methods');
const param = require('../params/profile_param');

/* GET profile page. */
router.get('/', function(req, res, next) {
	var chck = req.cookies;

	if (chck && chck.uid) {
		var log = '/PROFIlE-route| Auth user, session below\n[';
		log += JSON.stringify(chck) + ']';
		process.env.NODE_ENV == 'development' ? console.log(log) : log;
		var auth = new authMod();
		auth.userisAuth(chck.uid, 'profile')
			.then(function(result) {
				var dup = param;
				var log = 'profile| push user info in params \n[';
				res.locals.data = result;
				/* istanbul ignore next */
				log += JSON.stringify(res.locals.data) + ']';
				/* istanbul ignore next */
				process.env.NODE_ENV == 'development' ?
					console.log(log) : log;
				res.render('page', dup);
			})
			.catch(function (err) {
				if (err) throw err;
				next(err);
			});
	} else {
		log = 'profile-route| NonAUth user, session below\n[';
		log += JSON.stringify(chck) + '] cookie ? [';
		log += JSON.stringify(req.cookies) + ']';
		/* istanbul ignore next */
		process.env.NODE_ENV == 'development' ? console.log(log) : log;
		res.render('page', param);
	}
});

module.exports = router;
