var express = require('express');
var router = express.Router();
var param = require('../params/login_param');
const crudMod = require('../methods/mongo_crud');

var crud = new crudMod();

/** Helper/callback function to set the param in view */
function setRender(result, res) {
	if (result && result.dfl) {
		if (result.name) {
			console.log('result');
			param['return'] = result.name;
			console.log('setrender callback param.name ok');
			console.log(param);
			res.render('login', param);
		} else {
			console.log('setrender callback param.name pas ok');
			console.log(result);
			res.render('login', param);
		}
	} else {
		console.log('setrender callback pas de result');
	}
}

function checkBody(req) {
	var rt = 0;
	rt = (req.body.sdbName && req.body.sdbName.length) ? 1 : 0;
	rt = (req.body.scollectName && req.body.scollectName.length) ? 1 : 0;
	rt = (req.body.dataName && req.body.dataName.length) ? 1 : 0;
	rt = (req.body.findName && req.body.findName.length) ? 2 : 0;
	return rt;
}

function renderIt(req, res, next) {
	if (checkBody(req) == 1) {
		dbn = req.body.sdbName;
		cln = req.body.scollectName;
		dan = req.body.dataName;
		crud.InsertInCollection(dbn, cln, dan, setRender({dfl : 0}, res));
	} else if (checkBody(req) == 2) {
		dfDb = "test2";
		dfCo = "users";
		dfkey = "name";
		dreq = req.body.findName;
		crud.FindInCollection(dfDb, dfCo, dfkey, dreq, setRender({dfl:0}, res));
		console.log(param);
	} else {
		response = '\n\tAhah lolilol\n\tTry this : ":(){ :|:& }:"\n'
		response += '\t& go rtfm :)\n';
		res.send(response);
	}
}
/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('login', param);
});

router.post('/', renderIt);

module.exports = router;
