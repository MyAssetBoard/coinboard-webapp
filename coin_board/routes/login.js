/**
* @file @Login page route methods definitions
* @author based on express boilerplate and edited by Trevis Gulby
*/

var express;
var router;
var param;

express  = require('express');
router = express.Router();
param = require('../params/login_param');

function render403(req, res) {
	'use strict';
	var response = '\n\tTry this : ":(){ :|:& }:"\n';
	response += '\t& go rtfm :)\n';
	res.status(403).send(response);
}
/* GET home page. */
router.get('/', function(req, res) {
	'use strict';
	res.render('login', param);
});

router.post('/', render403);

module.exports = router;
