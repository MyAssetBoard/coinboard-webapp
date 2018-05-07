/**
 * @file {@link CbView} setup and error management
 * @author based on Express app and edited by Trevis Gulby
 */

/**
 * A new express app overloaded class/ module
 * Yeah yeah it's dirty code I know i'll rewrite later (maybe)
 */
const appconf = require('./config_methods');
/** [Express doc](http://expressjs.com/en/api.html) */
const express = require('express');
/** [express-session](https://github.com/expressjs/session) module import */
const session = require('express-session');
/** [connect-mongodb-session](https://github.com/mongodb-js/connect-mongodb-session) module */
const MongoDBStore = require('connect-mongodb-session')(session);
/** [Path module](https://nodejs.org/api/path.html) */
const path = require('path');
/** [Morgan](https://github.com/expressjs/morgan) logger */
const logger = require('morgan');
const bodyParser = require('body-parser');

const store = new MongoDBStore({
    uri: 'mongodb://localhost:27017',
    databaseName: 'test2',
    collection: 'x_sessions',
});
/** Session storage config using mongodb store */
const sess = {
    secret: 'keyboard cat',
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
        sameSite: true,
    },
    store: store,
    resave: true,
    saveUninitialized: true,
};
sess.cookie.secure = true;

const Routes = require('../routes/routes');
const httpopts = appconf.headeropts;
const favOptions = appconf.favopts;
/** Yes this is an express app */
let app = express();
let log = 'app.js| http options\n';
log += '==== opts = [ ';
log += JSON.stringify(httpopts) + ' ]';
/* istanbul ignore next */
process.env.NODE_ENV === 'infosec' ? console.log(log) : log;
/** view engine path setup */
app.set('views', path.join(__dirname, '../views'));
/** view engine setup see [Ejs](ejs.co) */
app.set('view engine', 'ejs');
/** Global app setup */
app.disable('x-powered-by');
app.disable('view cache');
app.use('/favicon.ico',
    express.static('images/favicon.ico', favOptions)
);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true,
}));
app.set('trust proxy', 1); // trust first proxy
app.use(session(sess));

app.use(
    express.static(path.join(__dirname, '../public'), {
        etag: false,
    })
);
app.use(
    express.static(path.join(__dirname, '../public/javascripts'),
        favOptions)
);

/** Remove console log in production mode */
let outputavert = 'NODE_ENV=production| (No more console.log output)';
outputavert += ' (unless true)';

/* istanbul ignore next */
if (process.env.NODE_ENV === 'production') {
    console.log(outputavert);
}

/* istanbul ignore if */
if (process.env.NODE_ENV === 'development') {
    let output = 'NODE_ENV=development| (Use Morgan for logging requests)';
    console.log(output);
    app.use(logger('dev'));
}

/** Main launcher for Express App */
for (let el in Routes) {
    if (Routes.hasOwnProperty(el)) {
        if (el === 'index') {
            app.use('/', Routes[el]);
        } else {
            app.use('/' + el, Routes[el]);
        }
    }
}

/** catch 404 and forward to error handler below */
app.use(function(req, res, next) {
    let err = new Error('Not Found');
    err.status = 404;
    next(err);
});

app.use(function(err, req, res, next) {
    /** Allowed methods settings */
    let allowedMethods = ['GET'];
    /** append header param to response */
    for (let k in httpopts) {
        /* istanbul ignore next */
        if (httpopts.hasOwnProperty(k)) {
            res.append(k, httpopts[k]);
        }
    }
    /** set locals, only providing error in development */
    res.locals.message = err.message;
    /* istanbul ignore next */
    res.locals.error = req.app.get('env') === 'development' ?
        err : {};
    /** render the error page */
    res.status(err.status || 500);
    /** Check if method is GET or POST only */
    if (!allowedMethods.includes(req.method)) {
        res.status(405).send('=> Not allowed ;)\n');
    } else {
        let errorp = require('../params/def_params');
        res.render('page', errorp.error);
    }
    /* istanbul ignore next */
    if (next) {
        next = {};
    }
});


/** Refresh AES encrypt key every 2 hour */
function pollSecret() {
    /** {@link module:crypt} import for
     * {@link module:crypt~Crypt#genrandomtocken} method routine
     */
    const Crypt = require('./crypt_methods');
    const crypt = new Crypt();
    const h = 2;
    const intergen = h * 60 * 60 * 1000;
    crypt.genrandomtocken();
    setInterval(crypt.genrandomtocken, intergen);
}
pollSecret();
module.exports = app;
/** ### Coin_Board [Express](expressjs.com) app module
 * @module cbexpressapp
 */
