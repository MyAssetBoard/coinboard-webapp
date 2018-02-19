/**
* @file @Register_assets page route methods definitions
* @author based on express boilerplate and edited by Trevis Gulby
*/

var express;
var router;
var authMod;

express = require('express');
router = express.Router();
authMod = require('../methods/auth_methods');
const param = require('../params/myassets_param');


/* GET assets page. */
router.get('/', function(req, res, next) {
	var chck = req.session;
	if (chck && (chck.uid || chck.cookie.uid)) {
		var log = '/MYASSETS-route : Auth user, session below\n[';
		log += JSON.stringify(chck) + ']';
		process.env.NODE_ENV == 'development' ? console.log(log) : log;
		var auth = new authMod();
		auth.userisAuth(chck.uid ? chck.uid : chck.cookie.uid)
			.then(function(result) {
				var dup = param;
				var log = 'myassets| push user info in params\n[';
				res.locals.stuff = {
					data : result
				};
				log += JSON.stringify(res.locals.stuff) + ']';
				process.env.NODE_ENV == 'development' ?
					console.log(log) : log;
				res.render('assets', dup);
			})
			.catch(function (err) {
				if (err) throw err;
				next(err);
			});
	} else {
		log = 'myassets-route| NonAUth user, session below\n[';
		log += JSON.stringify(chck) + ']';
		process.env.NODE_ENV == 'development' ? console.log(log) : log;
		res.render('assets', param);
	}
});

module.exports = router;
