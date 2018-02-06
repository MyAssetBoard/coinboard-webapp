var express = require('express');
var router = express.Router();
var param = {
	title   : "Coin_Board",
	page	: "index",
	scripts	: {
		trade 	: "tradestream.js",
		change 	: "changer_api.js"
	}
};

/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('index', param);
});

module.exports = router;
