/**
* @file @Register_assets page route methods definitions
* @author based on express boilerplate and edited by Trevis Gulby
*/

var express;
var router;
var params;

express = require('express');
router = express.Router();
params = require('../params/myassets_param');

/* GET assets page. */
router.get('/', function(req, res) {
	res.render('assets', params);
});

module.exports = router;
