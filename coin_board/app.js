/** Depencies import */
var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');


/** index route import */
const index = require('./routes/index');
/** Assets route import */
const assets = require('./routes/assets');
/** Login route import */
const login = require('./routes/login');
/** Signin route import */
const signin = require('./routes/signin');
/** Error view params */
const error_param = require('./params/error_param');
const allowedMethods = ['GET'];


var app = express();
var options = {
	'X-Content-Type-Options'	: 'nosniff',
	'X-Frame-Options'		: 'DENY',
	'X-XSS-Protection'		: '1; mode=block',
	'etag'				: 'false'
};
var log = 'app.js| http options\n';
log += '==== opts = [ ';
log += JSON.stringify(options) + ' ]';
/* istanbul ignore next */
process.env.NODE_ENV == 'infosec' ? console.log(log) : log;

var favOptions = {
	dotfiles: 'ignore',
	etag: false,
	extensions: ['htm', 'html'],
	index: false,
	maxAge: '1d',
	redirect: false
};

/** view engine setup */
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


/** Global app setup */
app.disable('x-powered-by');
app.disable('view cache');
app.use('/favicon.ico', express.static('images/favicon.ico', favOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser('random_string_goes_here'));
app.use(express.static(path.join(__dirname, 'public'), {etag: false}));
app.use(express.static(path.join(__dirname, 'public/javascripts')));


// Remove console log in production mode
var output_avert = 'NODE_ENV=production| (No more console.log output)';
output_avert += ' (unless true)';

/* istanbul ignore next */
if (process.env.NODE_ENV == 'production') {
	console.log(output_avert);
}

/* istanbul ignore if */
if (process.env.NODE_ENV == 'development') {
	var output = 'NODE_ENV=development| (Use Morgan for logging requests)';
	console.log(output);
	app.use(logger('dev'));
}
/** Routes import */
app.use('/', index);
app.use('/assets', assets);
app.use('/login', login);
app.use('/signin', signin);

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
		/* istanbul ignore next */
		if (options.hasOwnProperty(k)) {
			res.append(k, options[k]);
		}
	}
	/** set locals, only providing error in development */
	res.locals.message = err.message;
	/* istanbul ignore next */
	res.locals.error = req.app.get('env') === 'development' ? err : {};
	/** render the error page */
	res.status(err.status || 500);
	/** Check if method is GET or POST only */
	if (!allowedMethods.includes(req.method)) {
		res.status(405).send('=> Not allowed ;)\n');
	} else {
		res.render('error', error_param);
	}
	/* istanbul ignore next */
	if (next) { next = {}; }
});

module.exports = app;
