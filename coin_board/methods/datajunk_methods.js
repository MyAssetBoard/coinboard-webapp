/**
 * @file DajaJunk module, our friendly scrapper / eater
 * @author Trevis Gulby
 */

/** Wow so much methods !
 * @class
 */
class DataJunk {
    /** @constructor */
    constructor() {
        /** http module import for sources requests */
        this.https = require('https');
        /** Fs dep import for writing feeds */
        this.fs = require('fs');
        /** Home made crud module import */
        this.Crud = require('./mongo_crud');
        this.crud = new this.Crud('test2', 'DTAFOOD');
        /** Parsing options import */
        this.colors = require('./djunk/colors');
        /** Requests models import */
        this.reqmodels = require('./djunk/reqmodels');
        /** Eatdiner import */
        this.eatd = require('./djunk/eatdiner');
    }
}

/**
 * Parsing helper function
 * 1 - Tag subject from title
 * 2 - Tag bull type from description || title
 * 3 - Tage bear type from description || title
 * 4 - Return res and updates counters
 * @param {Object} col
 * @param {Object} dt
 * @param {Object} res
 * @param {Object} ts
 */
DataJunk.prototype.flags = function(col, dt, res, ts) {
    for (let c in col.sets) {
        if (col.sets.a) {
            for (let d in col.sets[c]) {
                if (col.sets[c][d]) {
                    let obj = {
                        wh: dt.toLowerCase(),
                        wr: col.sets[c][d],
                        id: col.id,
                        cmp: res[ts.val - 1],
                        tg: '',
                    };
                    this.eatd.checkwrd(obj.wr, obj.wh);
                    if (col.check(obj)) {
                        res[ts.val] = this.eatd.getres(obj, ts);
                    }
                }
            }
        }
    }
};

/**
 * Dummy helper for logging (and avoid 80 colomn long lines)
 */
DataJunk.prototype.logeat = function() {
    let log = 'DATA_JUNK: New feed ';
    log += 'inserted in db';
    process.env.NODE_ENV == 'development' ?
        console.log(log) :
        log;
};

/**
 * Launch data crawl for all sources in reqmodels
 * @param {Object} where source id, url, param etc
 */
DataJunk.prototype.goeat = function(where) {
    let _this = this;
    for (let x in where) {
        if (where[x]) {
            let xx = where[x];
            _this.goshopping(xx).then(function(res) {
                if (res) {
                    let d = {
                        id: xx.id,
                        path: xx.fname,
                        url: xx.url,
                    };
                    _this.digest(d).then(function(res) {
                        if (res) {
                            _this.logeat();
                        }
                    }).catch(function(rej, err) {
                        if (err || rej) {
                            throw err;
                        }
                    });
                }
            }).catch(function(rej, err) {
                if (err || rej) {
                    throw err;
                }
            });
        }
    }
};

/** Simple launch data mining aka 'eat' function */
DataJunk.prototype.gomine = function() {
    let _this = this;
    this.pukedata(
    {}).then(function(res) {
        let test = _this.eat(res);
        if (process.env.NODE_LOG == 'djunk') {
            console.log(test);
        }
    });
};

/**
 * Operations Pour tout les elements dans parseme (obj: )
 * @param {Object} dset results from feeds array in db
 * @return {Object} res parsed and colored data feed
 */
DataJunk.prototype.eat = function(dset) {
    let ts = {
        nb: 0,
        val: 0,
    };
    let res = [];
    let parseme = this.eatd.getparsed(dset, ts);

    for (let a in parseme) {
        if (parseme[a]) {
            this.eatd.checkwhat(parseme, a);
            for (let b in this.colors) {
                if (this.colors[b]) {
                    this.eatd.checkstyle(b);
                    this.colors[b].id = b;
                    this.flags(this.colors[b], parseme[a], res, ts);
                }
            }
        }
    }
    log = '[[RESULTS:\t=> [' + res.length + '] result(s) found!]]\n';
    log += JSON.stringify(res);
    if (process.env.NODE_LOG == 'djunk') {
        console.log(log);
    }
    return res = res.filter(function(n) {
        return n != undefined;
    });
};

/**
 * @param {string} where Object containing all source infos and parsing methods
 * @param {function} callback to get the result
 */
DataJunk.prototype.begdata = function(where, callback) {
    let req = this.https.get(where.req, function(res) {
        let bodyChunks = [];
        res.on('data', function(chunk) {
            bodyChunks.push(chunk);
        }).on('end', function() {
            let body = Buffer.concat(bodyChunks);
            /** Careful with non-JSON responses !! */
            let ifjson = JSON.parse(body);
            let clean = [];
            if (ifjson.query && ifjson.query.results) {
                let r = ifjson.query.results;
                clean = where.get(r, clean);
            } else {
                clean = ifjson;
            }
            callback && callback(clean);
        });
    });
    req.on('error', function(e) {
        console.log('DataJunk -ERROR: ' + e.message);
        if (e) {
            throw e;
        }
        callback && callback(e);
    });
};

/**
 * Wr aka write file, write gathered json inside DTAFOOD directory
 * @param {string} fn file name
 * @param {Object} d data to write json fmt
 * @return {Promise} d corresponding to writed data
 */
DataJunk.prototype.wr = function(fn, d) {
    let _this = this;
    return new Promise((resolve, reject) => {
        ROOT_APP_PATH = _this.fs.realpathSync('.');
        _this.fs.writeFile(fn, JSON.stringify(d) + '\n', function(err) {
            if (err) {
                let log = 'DataJunk: Write datas error ' + err;
                process.env.NODE_ENV == 'development' ?
                    console.log(log) :
                    log;
                reject(err);
            } else {
                let log = 'Write news to DTAFOOD/news ';
                process.env.NODE_ENV == 'development' ?
                    console.log(log) :
                    log;
                resolve(d);
            }
        });
    });
};

/**
 * {@link DataJunk#begdata}, then {@link DataJunk#wr} and finally
 * return promise
 * @param {Object} where see {@link DataJunk#reqmodels}
 * @return {Promise}
 */
DataJunk.prototype.goshopping = function(where) {
    let _this = this;
    return new Promise((resolve, reject) => {
        _this.begdata(where, function(res, err) {
            if (res) {
                _this.wr(where.fname, res).then(function(r) {
                    resolve(r);
                    return r;
                }).catch(function(rej, err) {
                    if (err) {
                        reject(err);
                        throw err;
                    }
                });
            } else if (!res || err) {
                reject(err);
            }
        });
    });
};

DataJunk.prototype.dbthis = function(s, callback) {
    let insert = {};
    insert.srcname = s.id;
    insert.srcurl = s.url;
    insert.feed = s.d;
    this.crud.insert('DTAFOOD', insert, function(res, err) {
        let log = 'DATA_JUNK | Done !\nInserted ' + insert.feed.length;
        log += '[ ' + insert.feed && insert.feed[0] ?
            insert.feed[0].title :
            JSON.stringify(insert);
        process.env.NODE_ENV == 'development' ?
            console.log(log + ']\nResults :\n' + res.results) :
            log;
        if (err) {
            callback && callback(err);
            throw err;
        } else {
            callback && callback(res);
        }
    });
};

DataJunk.prototype.digest = function(what) {
    let _this = this;
    return new Promise(function(resolve, reject) {
        if (!(what && what.id && what.path)) {
            let e = new Error('bad meal can\'t digest');
            reject(e);
        } else {
            let writed = require('../.' + what.path);
            what.d = writed;
            _this.dbthis(what, function(res, err) {
                if (res) {
                    resolve(res);
                    return res;
                } else if (err) {
                    reject(err);
                    throw err;
                }
            });
        }
    });
};

DataJunk.prototype.pukedata = function(what) {
    let _this = this;
    return new Promise((resolve, reject) => {
        what
            ?
            what :
            {};
        _this.crud.find(what, function(res, err) {
            if (res && res[0] && res[0].feed) {
                resolve(res);
            } else if (err) {
                reject(err);
            }
        });
    });
};

if (process.env.LAUNCH_TASK == 'markme') {
    let data = new DataJunk();
    data.gomine();
} else if (process.env.LAUNCH_TASK == 'goeat') {
    let data = new DataJunk();
    data.goeat(data.reqmodels);
}

module.exports = DataJunk;
/** Multi function module around datamining needs
 * @module DataJunk
 */
