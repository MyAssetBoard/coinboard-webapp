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
		auth.userisAuth(req.session.uid)
			.then(function(result) {
				defparams._local = result;
				console.log(defparams);
				res.render('assets', defparams);
			})
			.catch(function (err) {
				if (err) throw err;
			});
	} else {
		res.render('assets', defparams);
	}
});

module.exports = router;
