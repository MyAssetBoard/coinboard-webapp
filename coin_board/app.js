/** Depencies import */
const express = require( 'express' );
const path = require( 'path' );
const logger = require( 'morgan' );
const cookieParser = require( 'cookie-parser' );
const bodyParser = require( 'body-parser' );
const Crypt = require( './methods/crypt_methods' );
const crypt = new Crypt();

/** routes, aka router overloads import */
const index = require( './routes/index' );
const assets = require( './routes/assets' );
const login = require( './routes/login' );
const signin = require( './routes/signin' );
const profile = require( './routes/profile' );
const livestream = require( './routes/livestream' );
const errorp = require( './params/error_param' );

/** Allowed methods settings */
const allowedMethods = ['GET'];

const app = express();
const options = {
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'DENY',
        'X-XSS-Protection': '1; mode=block',
        'etag': 'false',
};
let log = 'app.js| http options\n';
log += '==== opts = [ ';
log += JSON.stringify( options ) + ' ]';
/* istanbul ignore next */
process.env.NODE_ENV == 'infosec'
        ? console.log( log )
        : log;

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

/** view engine setup */
app.set( 'views', path.join( __dirname, 'views' ) );
app.set( 'view engine', 'ejs' );

/** Global app setup */
app.disable( 'x-powered-by' );
app.disable( 'view cache' );
app.use( '/favicon.ico', express.static( 'images/favicon.ico', favOptions ) );
app.use( bodyParser.json() );
app.use( bodyParser.urlencoded( {extended: true} ) );
app.use( cookieParser( 'random_string_goes_here' ) );
app.use( express.static( path.join( __dirname, 'public' ), {etag: false} ) );
app.use( express.static( path.join( __dirname, 'public/javascripts' ) ) );

// Remove console log in production mode
let outputavert = 'NODE_ENV=production| (No more console.log output)';
outputavert += ' (unless true)';

/* istanbul ignore next */
if ( process.env.NODE_ENV == 'production' ) {
        console.log( outputavert );
}

/* istanbul ignore if */
if ( process.env.NODE_ENV == 'development' ) {
        let output = 'NODE_ENV=development| (Use Morgan for logging requests)';
        console.log( output );
        app.use( logger( 'dev' ) );
}
/**
* Refresh AES encrypt key every 2 hour
*/
const h = 2;
const intergen = h * 60 * 60 * 1000;
crypt.genrandomtocken();
setInterval( crypt.genrandomtocken, intergen );
/** Routes import */
app.use( '/', index );
app.use( '/login', login );
app.use( '/signin', signin );
app.use( '/assets', assets );
app.use( '/profile', profile );
app.use( '/livestream', livestream );

/** catch 404 and forward to error handler */
app.use( function( req, res, next ) {
        let err = new Error( 'Not Found' );
        err.status = 404;
        next( err );
} );

/** error handler */
app.use( function( err, req, res, next ) {
        /** append header param to response */
        for ( let k in options ) {
                /* istanbul ignore next */
                if ( options.hasOwnProperty( k ) ) {
                        res.append( k, options[k] );
                }
        }
        /** set locals, only providing error in development */
        res.locals.message = err.message;
        /* istanbul ignore next */
        res.locals.error = req.app.get( 'env' ) === 'development'
                ? err
                : {};
        /** render the error page */
        res.status( err.status || 500 );
        /** Check if method is GET or POST only */
        if ( !allowedMethods.includes( req.method ) ) {
                res.status( 405 ).send( '=> Not allowed ;)\n' );
        } else {
                res.render( 'error', errorp );
        }
        /* istanbul ignore next */
        if ( next ) {
                next = {};
        }
} );

module.exports = app;
