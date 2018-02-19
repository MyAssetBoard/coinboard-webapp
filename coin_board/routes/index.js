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
	var chck = req.session;
	if (chck && (chck.uid || chck.cookie.uid)) {
		console.log('index-route| Auth user, session below');
		console.log(chck);
		var auth = new authMod();
		auth.userisAuth(chck.uid ? chck.uid : chck.cookie.uid)
			.then(function(result) {
				var dup = param;
				//dup.uservar = result;
				console.log('index| inject user info in params');
				console.log(dup);
				res.locals.stuff = {
					data : result
				};
				res.render('index', dup);
			})
			.catch(function (err) {
				if (err) throw err;
				next(err);
			});
	} else {
		console.log('index-route : no req session uid | session below');
		console.log(chck);
		res.render('index', param);
	}
});

module.exports = router;
