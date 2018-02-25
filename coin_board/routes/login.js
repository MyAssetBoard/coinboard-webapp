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
redirco = 'http://localhost:3000/assets';

function render403(req, res) {
	'use strict';
	var response = '\n\tTry this : ":(){ :|:& }:"\n';
	response += '\t& go rtfm :)\n';
	res.status(403).send(response);
}

router.post('/', render403);

function setCookie(req, res) {
	/** check if client sent cookie */
	var cookie = req.cookies.uid;
	var log = '';
	if (cookie === undefined) {
		/** no: set a new cookie */
		var setting = {
			maxAge: 900000,
			httpOnly: false
		};
		res.cookie('uid',req.params.uid, setting);
		log = 'cookie successfully added';
		process.env.NODE_ENV == 'development' ?
			console.log(log) : log;
	} else {
		/** yes, cookie was already present */
		log = 'cookie already present';
		process.env.NODE_ENV == 'development' ?
			console.log(log) : log;
	}
}


/**
*	\brief GET login page.
*/
router.get('/', function(req, res, next) {
	var chck = req.cookies;
	var log = '';

	if (chck && chck.uid) {
		log = '/LOGIN-route : Auth user, session below\n[';
		log += JSON.stringify(chck) + ']';
		process.env.NODE_ENV == 'development' ? console.log(log) : log;
		var auth = new authMod();
		auth.userisAuth(chck.uid, 'login')
			.then(function(result) {
				var dup = param;
				var log = 'login| push user info in params\n[';
				/** Expose data to ejs template */
				res.locals.data = result;
				log += JSON.stringify(res.locals.data) + ']';
				process.env.NODE_ENV == 'development' ?
					console.log(log) : log;
				res.render('page', dup);
			})
			.catch(function (err) {
				if (err) throw err;
				next(err);
			});
	} else {
		log = 'login-route| NonAUth user, session below\n[';
		log += JSON.stringify(chck) + '] cookie ? [';
		log += JSON.stringify(req.cookies) + ']';
		process.env.NODE_ENV == 'development' ? console.log(log) : log;
		res.render('page', param);
	}
});

/**
*	\brief Connection setting
*/
router.get('/id/:uid', function(req, res, next) {
	var auth = new authMod();
	var log = '';
	if (auth.isvaliduid(req.params.uid)) {
		log = 'received id request with value :\n';
		log += JSON.stringify(req.params);
		log += '\nSession dump bellow\n[';
		log += JSON.stringify(req.session) + ']';
		process.env.NODE_ENV == 'development' ?
			console.log(log) : log;
		setCookie(req, res, next);
		log = '\ncookies - sets' + JSON.stringify(req.cookies);
		process.env.NODE_ENV == 'development' ?
			console.log(log) : log;
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
