/**
 * @file Main runable executable for websocket micro service
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
        this.addr = process.env.SERV_ENV == 'local' ?
            this.ni.wlan0[0].address :
            this.ni.docker0[0].address;
        this.http = require('http');
        this.server = this.http.createServer();
        this.server.listen(this.port, this.addr);
        this.io = require('socket.io')(this.server);
        /** Asset module dep import */
        this.Asset = require('../methods/assets_methods');
        this.asset = new this.Asset();
        /** Auth module dep import */
        this.Auth = require('../methods/auth_methods');
        this.auth = new this.Auth();
        /** NUMBER of connected sessions on auth room */
        this.authco = 0;
        /** NUMBER of connected sessions on register room */
        this.regco = 0;
        /** NUMBER of connected sessions on assets room */
        this.assetco = 0;
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
        let u = socket.id;
        _this.io.of('/auth').to(u).emit('nm', comsg);
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
            let log = 'add asset data returned :\n' + JSON.stringify(d);
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

/** Launching WeSocket service */
const miwebsocket = new CbWebsocket();
miwebsocket.startmeup();
/** ### Coin_Board Socket.io methods
 * @module CbWebsocket
 */
