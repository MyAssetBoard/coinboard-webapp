var express = require('express');
var router = express.Router();
var param = require('../models/login_param');
const auth = require('../methods/auth_methods');

var thetest = new auth();

/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('login', param);
});

router.post('/', function(req, res, next) {
	var a = thetest.connect(req.body.email);
	res.send('ahah');
})

module.exports = router;
