var express = require('express');
var router = express.Router();
var param = {
	title	: "Coin_Board",
	author	: "© Copyright 2018 coin_board",
	page	: "index",
	scripts	: {
		trade 	: "tradestream.js",
		change 	: "changer_api.js"
	},
	blocks : {
		jumbo		: "blocks/my_jumbotron",
		ticker		: "blocks/ticker_panel",
		livestream	: "blocks/tradestream"
	}
};

/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('index', param);
});

module.exports = router;
