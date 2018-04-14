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
        this.apiparamco = 0;
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

/** Log this user
 * @param {string} roomname
 * @param {string} usrid
 */
CbWebsocket.prototype.logthisguy = function(roomname, usrid) {
    let log = usrid.replace(/\/auth#/g, 'User : ');
    let conbr = this[roomname + 'co'];
    log += ' connected to [/' + roomname + '] route | Connected : ' + conbr;
    process.env.NODE_ENV == 'development' ? console.log(log) : log;
};

/** @property {function} authentication auth socket room event handling */
CbWebsocket.prototype.authentication = function() {
    let _this = this;
    _this.io.of('/auth').on('connection', function(socket) {
        _this.authco += 1;
        _this.logthisguy('auth', socket.id);
        let usrtmp = 'welcome ' + socket.id.replace(/\/auth#/g, 'user ');
        let scktid = socket.id.replace(/\/auth#/g, '');
        let comsg = {
            'msg': usrtmp,
            'scktid': scktid,
            'tot': _this.authco,
        };
        _this.io.of('/auth').to(socket.id).emit('nm', comsg);
        socket.on('user login', (data) => {
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
        _this.regco += 1;
        _this.logthisguy('reg', socket.id);
        let scktid = socket.id.replace(/\/register#/g, '');
        let comsg = {
            'scktid': scktid,
        };
        _this.io.of('/register').to(socket.id).emit('nm', comsg);
        socket.on('user signin', (inputdata) => {
            let log = 'received : \n' + JSON.stringify(inputdata);
            process.env.NODE_ENV == 'development' ? console.log(log) : log;
            _this.auth.checkRegData(inputdata, socket, _this.io);
        });
        socket.on('disconnect', function() {
            _this.regco -= 1;
        });
    });
};

CbWebsocket.prototype.assetroom = function() {
    let _this = this;
    const assetroom = {
        logger: function(d) {
            let log = 'add asset data get :\n' + JSON.stringify(d);
            process.env.NODE_ENV == 'development' ? console.log(log) : log;
        },
        handler: function(socket) {
            _this.assetco += 1;
            _this.logthisguy('asset', socket.id);
            socket.on('add asset', function(d) {
                this.logger(d);
                _this.asset.checkAssetData(d, socket, _this.io);
            });
            socket.on('disconnect', function() {
                _this.assetco -= 1;
            });
        },
    };
    return assetroom;
};

/** @property {function} assetmanagmnt assets socket room event handling */
CbWebsocket.prototype.assetmanagmnt = function() {
    let _this = this;
    let ass = _this.assetroom();
    _this.io.of('/assets').on('connection', (socket) => {
        ass.handler(socket);
    });
};

/** @property {function} apiparams assets socket room event handling */
CbWebsocket.prototype.apiparams = function() {
    let _this = this;
    _this.io.of('/api/param').on('connection', function(socket) {
        _this.apiparamco += 1;
        _this.logthisguy('apiparam', socket.id);
        socket.on('update api creds', function(d) {
            let log = 'update creds get :\n' + JSON.stringify(d);
            process.env.NODE_ENV == 'development' ? console.log(log) : log;
            _this.apiparam.checkApiParamsData(d, socket, _this.io);
        });
        socket.on('disconnect', function() {
            _this.apiparamco -= 1;
        });
    });
};

/** Launching WeSocket service */
const miwebsocket = new CbWebsocket();
miwebsocket.startmeup();
/** ### Coin_Board Socket.io methods
 * @module cbwebsocket
 */
