/**
 * @file {@link module:datajunk~DataJunk} module class,
 * our friendly scrapper / eater
 * @author Trevis Gulby
 */

/** Dependencies import */

const djunk = require('./djunk/colors');

const djunk0 = require('./djunk/reqmodels');

const djunk01 = require('./djunk/eatdiner');

/** @NOTE : deprecated / see Mongoose models */
const mongocrud = require('./mongo_crud');

/** @NOTE : new mongoose method dep */
const Datas = require('../Schemas/datas');

const fs0 = require('fs');

const https0 = require('https');
/** */

/** Wow so much methods !
 * @class
 */
class DataJunk {
    /** @constructor */
    constructor() {
        /** http module import for sources requests */
        this.https = https0;
        /** Fs dep import for writing feeds */
        this.fs = fs0;
        /** Home made {@link Crud} module import */
        this.Crud = mongocrud;
        this.crud = new this.Crud('test3', 'DTAFOOD');
        /** {@link colors} options import */
        this.colors = djunk;
        /** {@link reqmodels} models import */
        this.reqmodels = djunk0;
        /** {@link eatdiner} import */
        this.eatd = djunk01;
    }
}

/**
 * Parsing helper function
 * 1 - Tag subject from title
 * 2 - Tag bull type from description || title
 * 3 - Tag bear type from description || title
 * 4 - Return res and updates counters
 * @param {Object} col
 * @param {Object} dt
 * @param {Object} res
 * @param {Object} ts
 */
DataJunk.prototype.flags = function(col, dt, res, ts) {
    for (let c in col.sets) {
        if (col.sets.hasOwnProperty('a')) {
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

/** Dummy helper for logging progress */
DataJunk.prototype.logeat = function() {
    let log = 'DATA_JUNK: New feed ';
    log += 'inserted in db';
    process.env.NODE_ENV === 'development' ?
        console.log(log) :
        log;
};

/**
 * Launch data crawl for all sources in {@link DataJunk#reqmodels}
 * @param {Object} where source id, url, param etc
 */
DataJunk.prototype.goeat = function(where) {
    let _this = this;
    for (let x in where) {
        if (where[x]) {
            let xx = where[x];
            _this.goshopping(xx).then((res) => {
                if (res) {
                    let d = {
                        id: xx.id,
                        path: xx.fname,
                        url: xx.url,
                    };
                    _this.digest(d).then((res) => {
                        if (res) {
                            _this.logeat();
                        }
                    }).catch((rej, err) => {
                        throw err;
                    });
                }
            }).catch((rej, err) => {
                throw err;
            });
        }
    }
};

/** Launch data mining aka {@link DataJunk#eat} function */
DataJunk.prototype.gomine = function() {
    let _this = this;
    this.pukedata({}).then((res) => {
        let test = _this.eat(res);
        if (process.env.NODE_LOG === 'djunk') {
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
        if (parseme.hasOwnProperty(a)) {
            this.eatd.checkwhat(parseme, a);
            for (let b in this.colors) {
                if (this.colors.hasOwnProperty(b)) {
                    this.eatd.checkstyle(b);
                    this.colors[b].id = b;
                    this.flags(this.colors[b], parseme[a], res, ts);
                }
            }
        }
    }
    log = '[[RESULTS:\t=> [' + res.length + '] result(s) found!]]\n';
    log += JSON.stringify(res);
    process.env.NODE_LOG === 'djunk' ? console.log(log) : log;
    return res = res.filter((elems) => {
        return elems !== undefined;
    });
};

/**
 * @param {Object} where Object containing all source infos and parsing methods
 * @param {function} callback to get the result
 */
DataJunk.prototype.begdata = function(where, callback) {
    let req = this.https.get(where.req, function(res) {
        let bodyChunks = [];
        res.on('data', (chunk) => {
            bodyChunks.push(chunk);
        }).on('end', () => {
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
                process.env.NODE_ENV === 'development' ? console.log(log) : log;
                reject(err);
            } else {
                let log = 'Write news to DTAFOOD/news ';
                process.env.NODE_ENV === 'development' ? console.log(log) : log;
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
        _this.begdata(where, (res, err) => {
            if (res) {
                _this.wr(where.fname, res).then((r) => {
                    resolve(r);
                    return r;
                }).catch((rej, err) => {
                    reject(err);
                });
            } else if (!res || err) {
                reject(err);
            }
        });
    });
};

/** @todo To be refactored with Mongoose Models
 * @param {Object} s the datas to be inserted
 * @param {String} s.id the source name
 * @param {String} s.url the source url
 * @param {String} s.d the source 'd'atas
 * @param {function} callback the callback function to get responses
 */
DataJunk.prototype.dbthis = function(s, callback) {
    let insert = {};
    insert.srcname = s.id;
    insert.srcurl = s.url;
    insert.feed = s.d;
    this.crud.insert('DTAFOOD', insert, (res, err) => {
        let log = 'DATA_JUNK | Done !\nInserted ' + insert.feed.length;
        log += '[ ' + insert.feed && insert.feed[0] ?
            insert.feed[0].title :
            JSON.stringify(insert);
        process.env.NODE_ENV === 'development' ?
            console.log(log + ']\nResults :\n' + res.results) : log;
        if (err) {
            return callback && callback(err);
        }
        return callback && callback(res);
    });
};

DataJunk.prototype.digest = function(what) {
    let _this = this;
    return new Promise((resolve, reject) => {
        if (!(what && what.id && what.path)) {
            let e = new Error('bad meal can\'t digest');
            reject(e);
        } else {
            what.d = require('../.' + what.path);
            _this.dbthis(what, function(res, err) {
                if (res) {
                    return resolve(res);
                } else if (err) {
                    return reject(err);
                }
            });
        }
    });
};

DataJunk.prototype.pukedata = function(what) {
    let _this = this;
    return new Promise((resolve, reject) => {
        what = what ? what : {};
        _this.crud.find(what, function(res, err) {
            if (res && res[0] && res[0].feed) {
                resolve(res);
            } else if (err) {
                reject(err);
            }
        });
    });
};

if (process.env.LAUNCH_TASK === 'markme') {
    let data = new DataJunk();
    data.gomine();
} else if (process.env.LAUNCH_TASK === 'goeat') {
    let data = new DataJunk();
    data.goeat(data.reqmodels);
}

module.exports = DataJunk;
/** ### Multi task module around datamining needs
 * @module datajunk
 */
/** @namespace djunk */
