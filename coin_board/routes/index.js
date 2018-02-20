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
const param = require('../params/index_param');

/* GET home page. */
router.get('/', function(req, res, next) {
	var chck = req.cookies;

	if (chck && chck.uid) {
		var log = '/INDEX-route| Auth user, session below\n[';
		log += JSON.stringify(chck) + ']';
		process.env.NODE_ENV == 'development' ? console.log(log) : log;
		var auth = new authMod();
		auth.userisAuth(chck.uid ? chck.uid : chck.cookie.uid)
			.then(function(result) {
				var dup = param;
				var log = 'index| push user info in params \n[';
				res.locals.data = result;
				log += JSON.stringify(res.locals.data) + ']';
				process.env.NODE_ENV == 'development' ?
					console.log(log) : log;
				res.render('index', dup);
			})
			.catch(function (err) {
				if (err) throw err;
				next(err);
			});
	} else {
		log = 'index-route| NonAUth user, session below\n[';
		log += JSON.stringify(chck) + '] cookie ? [';
		log += JSON.stringify(req.headers.cookie) + ']';
		process.env.NODE_ENV == 'development' ? console.log(log) : log;
		res.render('index', param);
	}
});

module.exports = router;
