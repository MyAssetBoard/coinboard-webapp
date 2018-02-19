/**
* @file @Index page route methods definitions
* @author based on express boilerplate and edited by Trevis Gulby
*/

var express;
var router;
var authMod;

express = require('express');
router  = express.Router();
authMod = require('../methods/auth_methods');
const param = require('../params/signin_param');

/* GET home page. */
router.get('/', function(req, res, next) {
	var chck = req.session;
	if (chck && (chck.uid || chck.cookie.uid)) {
		console.log('login-route : Auth user | session below');
		console.log(chck);
		var auth = new authMod();
		auth.userisAuth(chck.uid ? chck.uid : chck.cookie.uid)
			.then(function(result) {
				var dup = param;
				console.log('signin| inject user info in params');
				console.log(dup);
				res.locals.stuff = {
					data : result
				};
				res.render('signin', dup);
			})
			.catch(function (err) {
				if (err) throw err;
				next(err);
			});
	} else {
		console.log('signin-route : no req session uid | session below');
		console.log(chck);
		res.render('signin', param);
	}
});

module.exports = router;
