/**
 * @file {@link module:datajunk~DataJunk} module class,
 * our friendly scrapper / eater
 * @author Trevis Gulby
 */

/** Dependencies import */

const djunk = require('./djunk/colors');

const djunk01 = require('./djunk/eatdiner');

/** @NOTE : new mongoose method dep */
// const Datas = require('../schemas/datas');
const Scrapper = require('../schemas/scrapper');

const fs0 = require('fs');

const https0 = require('https');
/** */

/** Wow so much methods !
 * @class
 */
class DataJunk {
    /** @constructor */
    constructor () {
        /** http module import for sources requests */
        this.https = https0;
        /** Fs dep import for writing feeds */
        this.fs = fs0;
        /** {@link colors} options import */
        this.colors = djunk;
        /** {@link reqmodels} models import */
        this.MOQREQUEST = require('./djunk/reqmodels');
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
DataJunk.prototype.flags = function (col, dt, res, ts) {
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
DataJunk.prototype.logeat = function () {
    let log = 'DATA_JUNK: New feed ';
    log += 'inserted in db';
    process.env.NODE_LOG === 'djunk' ?
        console.log(log) :
        log;
};

/**
 * Operations Pour tout les elements dans parseme (obj: )
 * @param {Object} dset results from feeds array in db
 * @return {Object} res parsed and colored data feed
 */
DataJunk.prototype.eat = function (dset) {
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
    process.env.NODE_LOG === 'djunk' ? console.log(log) : log;
    return res = res.filter((elems) => {
        return elems !== undefined;
    });
};

/**
 * Wr aka write file, write gathered json inside DTAFOOD directory
 * @param {string} fn file name
 * @param {Object} d data to write json fmt
 * @return {Promise} d corresponding to writed data
 */
DataJunk.prototype.wr = function (fn, d) {
    let _this = this;
    return new Promise((resolve, reject) => {
        ROOT_APP_PATH = _this.fs.realpathSync('.');
        _this.fs.writeFile(fn, JSON.stringify(d) + '\n', function (err) {
            if (err) {
                let log = 'DataJunk: Write datas error ' + err;
                process.env.NODE_LOG === 'djunk' ? console.log(log) : log;
                reject(err);
            } else {
                let log = 'Write news to DTAFOOD/news ';
                process.env.NODE_LOG === 'djunk' ? console.log(log) : log;
                resolve(d);
            }
        });
    });
};

/**
 * @param {Object} where Object containing all source infos and parsing methods
 * @param {function} callback to get the result
 */
DataJunk.prototype.begdata = function (where, callback) {
    console.log(where.req);
    let req = this.https.get(where.req, function (res) {
        let bodyChunks = [];
        res.on('data', (chunk) => {
            bodyChunks.push(chunk);
        }).on('end', () => {
            let body = Buffer.concat(bodyChunks);
            /** @todo Careful with non-JSON responses !! */
            let ifjson = JSON.parse(body);
            let clean = [];
            if (ifjson.query && ifjson.query.results) {
                clean = ifjson.query.results;
            } else {
                clean = body;
            }
            return callback && callback(clean);
        });
    });
    req.on('error', function (e) {
        console.log('DataJunk -ERROR: ' + e.message);
        return callback && callback(e);
    });
};

/**
 * Dummy regex clean and  string
 * @param  {String} mess
 * @return {String} p
 */

/**
 * {@link DataJunk#begdata}, then {@link DataJunk#wr} and finally
 * return promise
 * @param {Object} where see {@link module:models~RequestSchemas}
 * @return {Promise}
 */
DataJunk.prototype.goshopping = function (where) {
    let _this = this;
    let Parseur = require('../schemas/scrapper').Parseur;
    return new Promise((resolve, reject) => {
        _this.begdata(where.toJSON(), (res, err) => {
            if (res && res.item) {
                for (el in res.item) {
                    if (res.item[el].description) {
                        res.item[el].description =
                            Parseur.getptag(res.item[el].description);
                    }
                }
                resolve(res);
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
 * @return {function} callback
 */
DataJunk.prototype.dbthis = function (s, callback) {
    let insert = {};
    insert.srcname = s.id;
    insert.srcurl = s.url;
    insert.feed = s.d;
    return callback && callback(insert);
};

/**
 * Put .json file in directory and format them to feed db according
 * to {@link #models~data} schemas
 * @param {String} datadir the json datas directory
 * @return {function} Promise resolve reject nothing fancy
 */
DataJunk.prototype.getfiles = function (datadir) {
    let _this = this;
    return new Promise(function (resolve, reject) {
        ROOT_APP_PATH = _this.fs.realpathSync('.');
        if (_this.fs.existsSync(datadir) === true) {
            _this.fs.readdir(datadir, function (err, list) {
                if (err) {
                    throw (err);
                }
                let regex = new RegExp('.*.json');
                let clean = [];
                list.forEach(function (item) {
                    if (regex.test(item)) {
                        item = item.replace(/^/, datadir);
                        clean.push(item);
                    }
                });
                resolve(clean);
            });
        } else {
            throw new Error('No such file or directory');
        }
    });
};


/** @todo to be loopified for every source in all types
 * and also make a real ipc protocol instead of dirty pipes on standard
 * output :p
 */
if (process.env.LAUNCH_TASK === 'gomine') {
    let data = new DataJunk();
    data.getfiles('../../DTAFOOD/infos/').then((resolve) => {
        console.log('Files ::');
        console.log(resolve);
    }).catch((reject) => {
        console.log(reject);
        process.exit(1);
    });
} else if (process.env.LAUNCH_TASK === 'goeat') {
    let data = new DataJunk();
    let scrappername = process.env.SCRAPPERID;
    Scrapper.findOne({name: scrappername}).exec((error, scrapper) => {
        let where = scrapper.Sources.Crypto.infos[0];
        data.goshopping(where).then((resolve, reject) => {
            if (reject) {
                console.log(reject);
            } else if (resolve) {
                console.log(resolve);
                let path = 'DTAFOOD/infos/';
                let timestamp = new Date();
                let fname = path + where.name + '-' + timestamp.toISOString();
                fname += '.json';
                console.log('{fname: "' + fname + '"}\n');
                data.wr(fname.toString(), resolve).then((r) => {
                    console.log(r);
                    process.exit(0);
                }).catch((reject, error) => {
                    console.log(error);
                    process.exit(1);
                });
            }
        }).catch((reject, err) => {
            console.log(err);
            process.exit(1);
        });
    });
}

module.exports = DataJunk;
/** ### Multi task module around datamining needs
 * @module datajunk
 */
/** @namespace djunk */
