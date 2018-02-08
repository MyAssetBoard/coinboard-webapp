var express = require('express');
var router = express.Router();
var param = require('../models/login_param');

/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('login', param);
});

module.exports = router;
