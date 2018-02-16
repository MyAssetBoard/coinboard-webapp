var express = require('express');
var router = express.Router();
var param = require('../params/login_param');

function render403(req, res, next) {
	response = '\n\tAhah lolilol\n\tTry this : ":(){ :|:& }:"\n'
	response += '\t& go rtfm :)\n';
	res.status(403).send(response);
}
/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('login', param);
});

router.post('/', render403);

module.exports = router;
