var express = require('express');
var router = express.Router();
var params = {
	title	: "My assets",
	author	: "© Copyright 2018 coin_board",
	page	: "assets",
	scripts	: {
		manage	: "assets_management.js"
	},
	blocks : {
		jumbo	: "blocks/my_jumbotron",
		assets	: "blocks/my_assets",
		crud	: "blocks/my_crudblock"
	}
};

/* GET assets page. */
router.get('/', function(req, res, next) {
	res.render('assets', params);
});

module.exports = router;
