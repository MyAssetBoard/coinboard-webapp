/**
* @file @Register_assets page route methods definitions
* @author based on express boilerplate and edited by Trevis Gulby
*/

var express;
var router;
var authMod;
var defparams;

express = require('express');
router = express.Router();
defparams = require('../params/myassets_param');
authMod = require('../methods/auth_methods');


/* GET assets page. */
router.get('/', function(req, res) {
	console.log(req.session);
	if (req.session.uid) {
		var auth = new authMod();
		if (auth.userisAuth(req.session.uid)) {
			defparams.yolo = 'ahaha';
			res.render('assets', defparams);
		} else {
			res.render('assets', defparams);
		}
	} else {
		res.render('assets', defparams);
	}
});

module.exports = router;
