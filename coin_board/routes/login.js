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
router.post('/', render403);

/**
*	\brief GET login page.
*/
router.get('/', function(req, res, next) {
	var chck = req.session;
	if (chck && (chck.uid || chck.cookie.uid)) {
		var log = '/LOGIN-route : Auth user, session below\n[';
		log += JSON.stringify(chck) + ']';
		process.env.NODE_ENV == 'development' ? console.log(log) : log;
		var auth = new authMod();
		auth.userisAuth(chck.uid ? chck.uid : chck.cookie.uid)
			.then(function(result) {
				var dup = param;
				var log = 'login| push user info in params\n[';
				res.locals.stuff = { data : result };
				log += JSON.stringify(res.locals.stuff) + ']';
				process.env.NODE_ENV == 'development' ?
					console.log(log) : log;
				res.render('login', dup);
			})
			.catch(function (err) {
				if (err) throw err;
				next(err);
			});
	} else {
		log = 'login-route| NonAUth user, session below\n[';
		log += JSON.stringify(chck) + ']';
		process.env.NODE_ENV == 'development' ? console.log(log) : log;
		res.render('login', param);
	}
});

/**
*	\brief Connection setting
*/
router.get('/id/:uid', function(req, res, next) {
	var auth = new authMod();
	if (auth.isvaliduid(req.params.uid)) {
		var hour = 3600000;
		var log = 'received id request with value :\n';
		log += JSON.stringify(req.params);
		log += '\nSession dump bellow \n';
		log += JSON.stringify(req.session);
		process.env.NODE_ENV == 'development' ? console.log(log) : log;
		req.session.cookie.expires = new Date(Date.now() + hour);
		req.session.cookie.maxAge = hour;
		req.session.uid = req.params.uid;
		req.session.cookie.uid = req.params.uid;
		res.redirect(redirco);
	} else {
		log = ('invalid uid');
		process.env.NODE_ENV == 'development' ? console.log(log) : log;
		var err = new Error('Bad request');
		err.status = 403;
		next(err);
	}
});


module.exports = router;
