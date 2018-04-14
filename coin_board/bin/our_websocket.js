/**
 * @file Main runable executable for {@link module:cbwebsocket~CbWebsocket}
 * service
 * @author based on socket.io doc app and edited by Trevis Gulby
 */

/**
 * A new CoinboardWebsocket object
 * @class
 */
class CbWebsocket {
    /** @constructor */
    constructor() {
        this.port = process.env.WSPORT || '3001';
        this.os = require('os');
        this.ni = this.os.networkInterfaces();
        this.addr = this.ni.wlan0[0].address;
        this.http = require('http');
        this.server = this.http.createServer();
        this.server.listen(this.port, this.addr);
        this.io = require('socket.io')(this.server);
        /** Asset module dep import */
        this.Asset = require('../controllers/assets_methods');
        this.asset = new this.Asset();
        /** Auth module dep import */
        this.Auth = require('../controllers/auth_methods');
        this.auth = new this.Auth();
        /** {@link userapis} import */
        this.Apis = require('../controllers/api_methods');
        this.apiparam = new this.Apis();
        /** NUMBER of current sessions on auth room */
        this.authco = 0;
        /** NUMBER of current sessions on register room */
        this.regco = 0;
        /** NUMBER of current sessions on assets room */
        this.assetco = 0;
        /** NUMBER of current sessions on api/param room */
        this.api_paramco = 0;
    }
}

/** Main launcher method */
CbWebsocket.prototype.startmeup = function() {
    let _this = this;
    let log = 'WEBSOCKET - server is listening on :\n';
    log += 'addr: [' + this.addr + '], port ' + this.port;
    process.env.NODE_ENV == 'development' ?
        console.log(log) :
        log;
    _this.authentication();
    _this.register();
    _this.assetmanagmnt();
    _this.apiparams();
};

/** @property {function} authentication auth socket room event handling */
CbWebsocket.prototype.authentication = function() {
    let _this = this;
    _this.io.of('/auth').on('connection', function(socket) {
        let log = socket.id.replace(/\/auth#/g, 'User : ');
        _this.authco += 1;
        log += ' connected to [/auth] route | Connected : ' + _this.authco;
        process.env.NODE_ENV == 'development' ?
            console.log(log) :
            log;
        let usrtmp = 'welcome ' + socket.id.replace(/\/auth#/g, 'user ');
        let scktid = socket.id.replace(/\/auth#/g, '');
        let comsg = {
            'msg': usrtmp,
            'scktid': scktid,
            'tot': _this.authco,
        };
        _this.io.of('/auth').to(socket.id).emit('nm', comsg);
        socket.on('user login', function(data) {
            _this.auth.checkcoData(data, socket, _this.io);
        });
        socket.on('disconnect', function() {
            _this.authco -= 1;
        });
    });
};

/** @property {function} register register socket room event handling */
CbWebsocket.prototype.register = function() {
    let _this = this;
    _this.io.of('/register').on('connection', function(socket) {
        let log = socket.id.replace(/\/register#/g, 'User : ');
        _this.regco += 1;
        log += ' connected to [/register] route| Connected : ' + _this.regco;
        process.env.NODE_ENV == 'development' ?
            console.log(log) :
            log;
        let scktid = socket.id.replace(/\/register#/g, '');
        let comsg = {
            'scktid': scktid,
        };
        _this.io.of('/register').to(socket.id).emit('nm', comsg);
        socket.on('user signin', function(data) {
            let log = 'received : \n' + JSON.stringify(data);
            process.env.NODE_ENV == 'development' ?
                console.log(log) :
                log;
            _this.auth.checkRegData(data, socket, _this.io);
        });
        socket.on('disconnect', function() {
            _this.regco -= 1;
        });
    });
};

/** @property {function} assetmanagmnt assets socket room event handling */
CbWebsocket.prototype.assetmanagmnt = function() {
    let _this = this;
    _this.io.of('/assets').on('connection', function(socket) {
        let log = socket.id.replace(/\/register#/g, 'User : ');
        _this.assetco += 1;
        log += ' connected to [/assets] route| Connected : ' + _this.assetco;
        process.env.NODE_ENV == 'development' ?
            console.log(log) :
            log;
        socket.on('add asset', function(d) {
            let log = 'add asset data get :\n' + JSON.stringify(d);
            process.env.NODE_ENV == 'development' ?
                console.log(log) :
                log;
            _this.asset.checkAssetData(d, socket, _this.io);
        });
        socket.on('disconnect', function() {
            _this.assetco -= 1;
        });
    });
};

/** @property {function} apiparams assets socket room event handling */
CbWebsocket.prototype.apiparams = function() {
    let _this = this;
    _this.io.of('/api/param').on('connection', function(socket) {
        let log = socket.id.replace(/\/api\/param#/g, 'User : ');
        _this.api_paramco += 1;
        log += ' connected to [/api/param] |\nConnected : ';
        log += _this.api_paramco;
        process.env.NODE_ENV == 'development' ?
            console.log(log) :
            log;
        socket.on('update api creds', function(d) {
            let log = 'update creds get :\n' + JSON.stringify(d);
            process.env.NODE_ENV == 'development' ?
                console.log(log) :
                log;
            _this.apiparam.checkApiParamsData(d, socket, _this.io);
        });
        socket.on('disconnect', function() {
            _this.api_paramco -= 1;
        });
    });
};

/** Launching WeSocket service */
const miwebsocket = new CbWebsocket();
miwebsocket.startmeup();
/** ### Coin_Board Socket.io methods
 * @module cbwebsocket
 */
