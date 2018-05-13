/**
 * @file Main exec file for {@link module:cbwebsocket~CbWebsocket} service
 * @author Based on socket.io doc and edited by Trevis Gulby
 * @license MIT
 */

/**
 * A new CoinboardWebsocket object
 * @class
 */
class CbWebsocket {
    /** @constructor */
    constructor() {
        let _this = this;
        this.https = require('https');
        this.uuid = require('uuid/v1');
        this.user = '';
        this.port = 3001;
        /** Creds import */
        this.AppConfig = require('../controllers/config_methods');
        this.conf = new this.AppConfig();
        /** NUMBER of current sessions on scrapper room */
        this.scrapperco = 0;
    }
}

/** Main launcher method
 * @TODO rewrite deprec socket.io to ws method's
 */
CbWebsocket.prototype.startmeup = function() {
    let log = 'WEBSOCKET - server is listening on :\n';
    log += 'addr: [' + this.conf.myip + '], port ' + this.port;

    process.env.NODE_ENV === 'development' ? console.log(log) : log;
    this.server = this.https.createServer(this.conf.httpsc(),
        (req, res) => {
            let resp = {error: '**Try with websocket**'};
            res.writeHead(200);
            res.end(JSON.stringify(resp));
        }).listen(this.port);
    let server = this.server;
    this.Ws = require('ws'); ;
    this.wss = new this.Ws.Server({server});
    this.scrapper();
};

/** Log this user
 * @param {string} roomname
 * @param {string} usrid
 */
CbWebsocket.prototype.logthisguy = function(roomname, usrid) {
    let log = usrid + ' connected to [/' + roomname + '] route |';
    log += ' Connected : ' + this.scrapperco;
    process.env.NODE_ENV === 'development' ? console.log(log) : log;
};

/** @property {function} scrapper socket room event handling */
CbWebsocket.prototype.scrapper = function() {
    let _this = this;

    _this.wss.on('connection', function connection(ws) {
        _this.scrapperco += 1;
        _this.user = _this.uuid();
        _this.logthisguy('all', _this.user);
        ws.on('message', function incoming(message) {
            console.log('received: %s', message);
            ws.send('ok :[' + message + ']');
        });
        ws.send('something');
        ws.on('close', function close() {
            _this.scrapperco -= 1;
            _this.logthisguy('all', _this.user);
        });
    });
};

/** Launching WeSocket service */
const miwebsocket = new CbWebsocket();
miwebsocket.startmeup();
/** ### Coin_Board Socket.io methods
 * @module cbwebsocket
 */
