/**
 * @file Application view setup and error management
 * @author based on Express app and edited by Trevis Gulby
 */

/** Depencies import */
const express = require('express');
const path = require('path');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const Crypt = require('./methods/crypt_methods');
const crypt = new Crypt();
const Routes = require('./routes/routes');
const errorp = require('./params/error_param');
/** Allowed methods settings */
const allowedMethods = ['GET'];
/** Yes this is an express app */
const app = express();
/** Http header sec settings */
const httpopts = {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'etag': 'false',
};
let log = 'app.js| http options\n';
log += '==== opts = [ ';
log += JSON.stringify(options) + ' ]';
/* istanbul ignore next */
process.env.NODE_ENV == 'infosec' ?
    console.log(log) :
    log;
/** Favicon static param */
const favOptions = {
    dotfiles: 'ignore',
    etag: false,
    extensions: [
        'htm', 'html',
    ],
    index: false,
    maxAge: '1d',
    redirect: false,
};

/** view engine path setup */
app.set('views', path.join(__dirname, 'views'));
/** view engine setup */
app.set('view engine', 'ejs');

/** Global app setup */
app.disable('x-powered-by');
app.disable('view cache');
app.use('/favicon.ico', express.static('images/favicon.ico', favOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded(
{
    extended: true,
}));
app.use(cookieParser('random_string_goes_here'));
app.use(express.static(path.join(__dirname, 'public'),
{
    etag: false,
}));
app.use(express.static(path.join(__dirname, 'public/javascripts')));

/** Remove console log in production mode */
let outputavert = 'NODE_ENV=production| (No more console.log output)';
outputavert += ' (unless true)';

/* istanbul ignore next */
if (process.env.NODE_ENV == 'production') {
    console.log(outputavert);
}

/* istanbul ignore if */
if (process.env.NODE_ENV == 'development') {
    let output = 'NODE_ENV=development| (Use Morgan for logging requests)';
    console.log(output);
    app.use(logger('dev'));
}
/** Refresh AES encrypt key every 2 hour */
const h = 2;
const intergen = h * 60 * 60 * 1000;
crypt.genrandomtocken();
setInterval(crypt.genrandomtocken, intergen);
/** Index router pages import */
for (el in Routes) {
    if (Routes[el]) {
        if (el == 'index') {
            app.use('/', Routes[el]);
        } else {
            app.use('/' + el, Routes[el]);
        }
    }
}

/** catch 404 and forward to error handler */
app.use(function(req, res, next) {
    let err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/** error handler */
app.use(function(err, req, res, next) {
    /** append header param to response */
    for (let k in httpopts) {
        /* istanbul ignore next */
        if (options.hasOwnProperty(k)) {
            res.append(k, options[k]);
        }
    }
    /** set locals, only providing error in development */
    res.locals.message = err.message;
    /* istanbul ignore next */
    res.locals.error = req.app.get('env') === 'development' ?
        err :
        {};
    /** render the error page */
    res.status(err.status || 500);
    /** Check if method is GET or POST only */
    if (!allowedMethods.includes(req.method)) {
        res.status(405).send('=> Not allowed ;)\n');
    } else {
        res.render('error', errorp);
    }
    /* istanbul ignore next */
    if (next) {
        next = {};
    }
});

module.exports = app;
