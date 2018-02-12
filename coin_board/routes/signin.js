var express = require('express');
var router = express.Router();
var param = require('../params/signin_param');

/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('signin', param);
});

module.exports = router;
