var express = require('express');
var router = express.Router();
var params = require('../models/myassets_param');

/* GET assets page. */
router.get('/', function(req, res, next) {
	res.render('assets', params);
});

module.exports = router;
