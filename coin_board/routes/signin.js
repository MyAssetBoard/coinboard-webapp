/**
* @file @Index page route methods definitions
* @author based on express boilerplate and edited by Trevis Gulby
*/

var express;
var router;
var param;

express = require('express');
router  = express.Router();
param = require('../params/signin_param');

/* GET home page. */
router.get('/', function(req, res) {
	res.render('signin', param);
});

module.exports = router;
