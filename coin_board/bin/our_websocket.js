/**
 * @file Main runable executable for websocket micro service
 * @author based on socket.io doc app and edited by Trevis Gulby
 */

/** PORT to connect to */
const port = process.env.WSPORT || '3001';
const os = require('os');
const ni = os.networkInterfaces();
const addr = process.env.SERV_ENV == 'local' ?
    ni.wlan0[0].address :
    ni.docker0[0].address;
/** SOCKET serv startup */
const http = require('http');
const server = http.createServer();
server.listen(port, addr);
const io = require('socket.io')(server);

/** NUMBER of connected sessions on auth room */
let authco = 0;
/** NUMBER of connected sessions on register room */
let regco = 0;
/** NUMBER of connected sessions on assets room */
let assetco = 0;

let log = 'WEBSOCKET - server is listening on :\n';
log += 'addr: [' + addr + '], port ' + port;
process.env.NODE_ENV == 'development' ?
    console.log(log) :
    log;

/** Auth room function */
io.of('/auth').on('connection', function(socket) {
    let log;
    authco += 1;
    log = socket.id.replace(/\/auth#/g, 'User : ');
    log += ' connected to [/auth] route | Connected : ' + authco;
    process.env.NODE_ENV == 'development' ?
        console.log(log) :
        log;
    let usrtmp = 'welcome ' + socket.id.replace(/\/auth#/g, 'user ');
    let scktid = socket.id.replace(/\/auth#/g, '');
    let comsg = {
        'msg': usrtmp,
        'scktid': scktid,
        'tot': authco,
    };
    let u = socket.id;
    io.of('/auth').to(u).emit('nm', comsg);
    socket.on('user login', function(data) {
        /** Auth home made module import */
        let Auth = require('../methods/auth_methods');
        const auth = new Auth();
        auth.checkcoData(data, socket, io);
    });
    socket.on('disconnect', function() {
        authco -= 1;
    });
});
/** Register room function */
io.of('/register').on('connection', function(socket) {
    regco += 1;
    let log = socket.id.replace(/\/register#/g, 'User : ');
    log += ' connected to [/register] route| Connected : ' + regco;
    process.env.NODE_ENV == 'development' ?
        console.log(log) :
        log;
    let scktid = socket.id.replace(/\/register#/g, '');
    let comsg = {
        'scktid': scktid,
    };
    io.of('/register').to(socket.id).emit('nm', comsg);
    socket.on('user signin', function(data) {
        /** Auth home made module import */
        let Auth = require('../methods/auth_methods');
        let auth = new Auth();
        let log = 'received : \n' + JSON.stringify(data);
        process.env.NODE_ENV == 'development' ?
            console.log(log) :
            log;
        auth.checkRegData(data, socket, io);
    });
    socket.on('disconnect', function() {
        regco -= 1;
    });
});
/** Assets room function */
io.of('/assets').on('connection', function(socket) {
    let log = socket.id.replace(/\/register#/g, 'User : ');
    assetco += 1;
    log += ' connected to [/assets] route| Connected : ' + assetco;
    process.env.NODE_ENV == 'development' ?
        console.log(log) :
        log;
    socket.on('add asset', function(d) {
        /** Asset home made module import */
        let Asset = require('../methods/assets_methods');
        let asset = new Asset();
        let log = 'add asset data returned :\n' + JSON.stringify(d);
        process.env.NODE_ENV == 'development' ?
            console.log(log) :
            log;
        asset.checkAssetData(d, socket, io);
    });
    socket.on('disconnect', function() {
        assetco -= 1;
    });
});
