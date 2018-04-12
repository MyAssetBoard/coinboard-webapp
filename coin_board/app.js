/**
 * @file {@link module:cbexpressapp} view setup and error management
 * @author based on Express app and edited by Trevis Gulby
 */

/**
 * A new express app overloaded class/ module
 * Yeah yeah it's dirty code I know i'll rewrite later (maybe)
 * @class
 */
class CbExpressApp {
    /** @constructor */
    constructor() {
        let _this = this;
        /** [Express doc](http://expressjs.com/en/api.html) */
        this.express = require('express');
        /** [Path module](https://nodejs.org/api/path.html) */
        this.path = require('path');
        /** [Morgan](https://github.com/expressjs/morgan) logger */
        this.logger = require('morgan');
        this.cookieParser = require('cookie-parser');
        this.bodyParser = require('body-parser');
        /** {@link module:crypt} import for
         * {@link module:crypt~Crypt#genrandomtocken} method routine
         */
        this.Crypt = require('./methods/crypt_methods');
        this.crypt = new this.Crypt();
        this.Routes = require('./routes/routes');
        /** Yes this is an express app */
        this.app = this.express();
        /** Http header sec settings */
        this.httpopts = {
            'X-Content-Type-Options': 'nosniff',
            'X-Frame-Options': 'DENY',
            'X-XSS-Protection': '1; mode=block',
            'etag': 'false',
        };
        /** Favicon static param */
        this.favOptions = {
            dotfiles: 'ignore',
            etag: false,
            extensions: [
                'htm', 'html',
            ],
            index: false,
            maxAge: '1d',
            redirect: false,
        };
        let log = 'app.js| http options\n';
        log += '==== opts = [ ';
        log += JSON.stringify(this.httpopts) + ' ]';
        /* istanbul ignore next */
        process.env.NODE_ENV == 'infosec' ?
            console.log(log) :
            log;
        /** view engine path setup */
        this.app.set('views', _this.path.join(__dirname, 'views'));
        /** view engine setup see [Ejs](ejs.co) */
        this.app.set('view engine', 'ejs');
        /** Global app setup */
        this.app.disable('x-powered-by');
        this.app.disable('view cache');
        this.app.use('/favicon.ico',
            _this.express.static('images/favicon.ico', _this.favOptions)
        );
        this.app.use(_this.bodyParser.json());
        this.app.use(_this.bodyParser.urlencoded(
        {
            extended: true,
        }));
        this.app.use(_this.cookieParser('random_string_goes_here'));
        this.app.use(
            _this.express.static(_this.path.join(__dirname, 'public'),
            {
                etag: false,
            }));
        this.app.use(
            _this.express.static(_this.path.join(__dirname,
                'public/javascripts')));
    }
}

/** blabla logging output */
CbExpressApp.prototype.setAppLog = function() {
    let _this = this;
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
        _this.app.use(_this.logger('dev'));
    }
};

/** Refresh AES encrypt key every 2 hour */
CbExpressApp.prototype.pollSecret = function() {
    let _this = this;
    const h = 2;
    const intergen = h * 60 * 60 * 1000;
    this.crypt.genrandomtocken();
    setInterval(_this.crypt.genrandomtocken, intergen);
};

/** Main launcher for Express App */
const miexpressapp = new CbExpressApp();
for (el in miexpressapp.Routes) {
    if (miexpressapp.Routes[el]) {
        if (el == 'index') {
            miexpressapp.app.use('/', miexpressapp.Routes[el]);
        } else {
            miexpressapp.app.use('/' + el, miexpressapp.Routes[el]);
        }
    }
}

miexpressapp.app.use(function(err, req, res, next) {
    /** Allowed methods settings */
    let allowedMethods = ['GET'];
    /** append header param to response */
    for (let k in this.httpopts) {
        /* istanbul ignore next */
        if (this.httpopts.hasOwnProperty(k)) {
            res.append(k, this.httpopts[k]);
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
        let errorp = require('./params/error_param');
        res.render('error', errorp);
    }
    /* istanbul ignore next */
    if (next) {
        next = {};
    }
});
/** catch 404 and forward to error handler below */
miexpressapp.app.use(function(req, res, next) {
    let err = new Error('Not Found');
    err.status = 404;
    next(err);
});
miexpressapp.setAppLog();
miexpressapp.pollSecret();
module.exports = miexpressapp.app;
/** ### Coin_Board [Express](expressjs.com) app module
 * @module cbexpressapp
 */
