var express = require('express');
var router = express.Router();

/* GET assets page. */
router.get('/', function(req, res, next) {
  res.render('assets', { title: 'Coin_Board/My assets' });
});

module.exports = router;
