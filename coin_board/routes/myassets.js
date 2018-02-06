var express = require('express');
var router = express.Router();
var params = {
	title   : "Coin_Board/My assets",
	page	: "assets",
	manage : "javascripts/assets_management.js",
	scripts	: {
		manage : "javascripts/assets_management.js"
	}
};

/* GET assets page. */
router.get('/', function(req, res, next) {
  res.render('assets', params);
});

module.exports = router;
