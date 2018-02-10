/** Depencies import */
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

/** index route import */
const index = require('./routes/index');
/** Assets route import */
const myassets = require('./routes/myassets');
/** Login route import */
const login = require('./routes/login');
/** Error view params */
const error_param = require('./models/error_param');


var app = express();
const allowedMethods = ['GET'];
var options = {
	'X-Content-Type-Options'	: 'nosniff',
	'X-Frame-Options'		: 'DENY',
	'X-XSS-Protection'		: '1; mode=block',
	'etag'				: 'false'
}
var favOptions = {
	dotfiles: 'ignore',
	etag: false,
	extensions: ['htm', 'html'],
	index: false,
	maxAge: '1d',
	redirect: false
}

/** view engine setup */
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


/** Global app setup */
app.disable('x-powered-by');

app.use('/favicon.ico', express.static('images/favicon.ico', favOptions));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public'), {etag: false}));
app.use(express.static(path.join(__dirname, 'public/javascripts')));


/** Routes import */
app.use('/', index);
app.use('/myassets', myassets);
app.use('/login', login);

/** catch 404 and forward to error handler */
app.use(function(req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});

/** error handler */
app.use(function(err, req, res, next) {
	/** append header param to response */
	for (var k in options) {
		if (options.hasOwnProperty(k)) {
			res.append(k, options[k]);
		}
	}
	/** set locals, only providing error in development */
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};
	/** render the error page */
	res.status(err.status || 500);
	/** Check if method is GET or POST only */
	if (!allowedMethods.includes(req.method)) {
		res.status(500).send('Not allowed ;)');
	} else {
		res.render('error', error_param);
	}
});


module.exports = app;
