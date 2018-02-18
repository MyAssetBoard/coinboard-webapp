/**
* @file @Index page route methods definitions
* @author based on express boilerplate and edited by Trevis Gulby
*/

var express;
var router;
var param;

express = require('express');
router = express.Router();
param = require('../params/index_param');

/* GET home page. */
router.get('/', function(req, res) {
	console.log(req.sessionID);
	res.render('index', param);
});

module.exports = router;
