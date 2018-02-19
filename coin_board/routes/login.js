/**
* @file @Login page route methods definitions
* @author based on express boilerplate and edited by Trevis Gulby
*/

var express;
var router;
var authMod;
var redirco;

express  = require('express');
router = express.Router();
const param = require('../params/login_param');
authMod = require('../methods/auth_methods');
redirco = 'http://localhost:3000/login';

function render403(req, res) {
	'use strict';
	var response = '\n\tTry this : ":(){ :|:& }:"\n';
	response += '\t& go rtfm :)\n';
	res.status(403).send(response);
}
/* GET login page. */
router.get('/', function(req, res, next) {
	var chck = req.session;
	if (chck && (chck.uid || chck.cookie.uid)) {
		console.log('login-route : Auth user | session below');
		console.log(chck);
		var auth = new authMod();
		auth.userisAuth(chck.uid ? chck.uid : chck.cookie.uid)
			.then(function(result) {
				var dup = param;
				//dup.uservar = result;
				console.log('login| inject user info in local page');
				console.log(dup);
				res.locals.stuff = {
					data : result
				};
				res.render('login', dup);
			})
			.catch(function (err) {
				if (err) throw err;
				next(err);
			});
	} else {
		console.log('login-route : no req session uid | session below');
		console.log(chck);
		res.render('login', param);
	}
});

router.get('/id/:uid', function(req, res) {
	var hour = 3600000;
	console.log('received id request with value :');
	console.log(req.params);
	console.log(req.session);
	req.session.cookie.expires = new Date(Date.now() + hour);
	req.session.cookie.maxAge = hour;
	req.session.uid = req.params.uid;
	req.session.cookie.uid = req.params.uid;
	res.redirect(redirco);
});

router.post('/', render403);

module.exports = router;
