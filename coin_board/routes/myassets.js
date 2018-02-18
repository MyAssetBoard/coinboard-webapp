/**
* @file @Register_assets page route methods definitions
* @author based on express boilerplate and edited by Trevis Gulby
*/

var express;
var router;
var crudMod;
var defparams;
var userid;
var ObjectId;
var CryptoJS;

express = require('express');
CryptoJS = require('crypto-js');
router = express.Router();
ObjectId = require('mongodb').ObjectId;
defparams = require('../params/myassets_param');
crudMod = require('../methods/mongo_crud');


function checkUid(data) {
	return new Promise((resolve, reject) => {
		var crud = new crudMod('test2');
		var val = new ObjectId(data);
		console.log(val);
		crud.FindInCollection('r_users', {_id: val }, function (res) {
			if (res) {
				resolve(res);
			}
			reject(new Error('Bad Id'));
		});
	});
}

function checkGetparam(req) {
	if (req.query.id && req.query.id.length > 5) {
		checkUid(req.query)
			.then(function (res) {
				console.log(res);
				return true;
			})
			.catch(function (rej, err) {
				console.error(rej.message);
				if (err) throw err;
				return false;
			});
	}
	return false;
}

/* GET assets page. */
router.get('/', function(req, res) {
	userid = req.query.id;
	console.log(userid);
	if (userid) {
		console.log('myassets route : received ' + userid + ' param');
		defparams['id'] = 'pouet';
		var bytes  = CryptoJS.AES.decrypt(userid, 'yolo 123');
		var plaintext = bytes.toString(CryptoJS.enc.Utf8);
		console.log('plaintext ? ' + plaintext);
		checkGetparam(plaintext);
		res.render('assets', defparams);
	} else {
		res.render('assets', defparams);
	}
	res.render('assets', defparams);
});

module.exports = router;
