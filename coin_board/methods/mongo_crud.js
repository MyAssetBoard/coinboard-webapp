/**
 * @file MongoDB CReateUpdateDelete methods definitions
 * @author based on Mongo doc and edited by Trevis Gulby
 */

/** local Mongodb url */
const uri = 'mongodb://localhost:27017/';

/**
 * @param {string} dbName
 * @param {string} coll
 */
function Crud(dbName, coll) {
    this.dbName = dbName ?
        dbName :
        'test2';
    this.coll = coll ?
        coll :
        'r_users';
    this.MongoClient = require('mongodb').MongoClient;
    this.ObjectId = require('mongodb').ObjectID;
}

Crud.prototype.insert = function(coll, data, callback) {
    let _this = this;
    _this.MongoClient.connect(uri).then(function(db) {
        const dbo = db.db(_this.dbName);
        let log = 'MONGO - Connected to ' + _this.dbName;
        process.env.NODE_ENV == 'development' ?
            console.log(log) :
            log;
        dbo.collection(coll).insertOne(data).then(function(res) {
            log = 'MONGO| 1 document inserted :\n[';
            log += JSON.stringify(data) + ']';
            process.env.NODE_ENV == 'devdb' ?
                console.log(log) :
                log;
            db.close();
            callback && callback(res);
            return res;
        }).catch(function(rej, err) {
            if (err || rej) {
                callback && callback(err);
                throw err;
            }
        });
    }).catch(function(rej, err) {
        if (err || rej) {
            callback && callback(err);
            throw err;
        }
    });
};

Crud.prototype.checkcred = function(c, callback) {
    let _this = this;
    if (c.username && c.socketid) {
        _this.MongoClient.connect(uri).then(function(db) {
            let log = 'MONGO - Connected to ' + _this.dbName;
            process.env.NODE_ENV == 'development' ?
                console.log(log) :
                log;
            let dbo = db.db(_this.dbName);
            dbo.collection(_this.coll).findOne(c).then(function(res) {
                db.close();
                callback && callback(res);
                return res;
            }).catch(function(err) {
                if (err) {
                    throw err;
                }
            });
        }).catch(function(err) {
            if (err) {
                throw err;
            }
        });
    }
};

Crud.prototype.finduser = function(who, callback) {
    let _this = this;
    _this.MongoClient.connect(uri).then(function(db) {
        let log = 'MONGO - Connected to ' + _this.dbName;
        process.env.NODE_ENV == 'development' ?
            console.log(log) :
            log;
        let dbo = db.db(_this.dbName);
        dbo.collection(_this.coll).findOne(who).then(function(res) {
            db.close();
            callback && callback(res);
            return res;
        }).catch(function(err) {
            if (err) {
                throw err;
            }
        });
    }).catch(function(err) {
        if (err) {
            throw err;
        }
    });
};

Crud.prototype.find = function(what, callback) {
    let _this = this;
    _this.MongoClient.connect(uri).then(function(db) {
        let log = 'MONGO - Connected to ' + _this.dbName;
        process.env.NODE_ENV == 'development' ?
            console.log(log) :
            log;
        let dbo = db.db(_this.dbName);
        dbo.collection(_this.coll).find(what).toArray(function(err, doc) {
            db.close();
            if (err) {
                callback && callback(err);
                throw err;
            } else {
                callback && callback(doc);
                return doc;
            }
        });
    }).catch(function(err) {
        if (err) {
            throw err;
        }
    });
};

Crud.prototype.update = function(who, what, data, callback) {
    let _this = this;
    _this.MongoClient.connect(uri).then(function(db) {
        const dbo = db.db(_this.dbName);
        const uid = new _this.ObjectId(who);
        const opt = '$push';
        let fuid = {};
        let fset = {};
        fset[opt] = {};

        fuid['_id'] = uid;
        fset[opt][what] = data;
        let log = 'MONGO - Connected to ' + _this.dbName;
        process.env.NODE_ENV == 'development' ?
            console.log(log) :
            log;
        dbo.collection(_this.coll).update(fuid, fset).then(function(result) {
            db.close();
            log = 'MONGO | Inserted data :\n[';
            log += JSON.stringify(data) + ']';
            process.env.NODE_ENV == 'devdb' ?
                console.log(log) :
                log;
            callback && callback(result);
            return result;
        }).catch(function(err) {
            if (err) {
                throw err;
            }
        });
    }).catch(function(err) {
        if (err) {
            throw err;
        }
    });
};

Crud.prototype.add = function(who, what, data, callback) {
    let _this = this;
    _this.MongoClient.connect(uri).then(function(db) {
        const dbo = db.db(_this.dbName);
        const uid = new ObjectId(who);
        const opt = '$push';
        let fuid = {};
        let fset = {};

        fset[opt] = {};
        fuid['_id'] = uid;
        fset[opt][what] = data;
        let log = 'MONGO - Connected to ' + _this.dbName;
        process.env.NODE_ENV == 'development' ?
            console.log(log) :
            log;
        dbo.collection(_this.coll).update(fuid, fset).then(function(result) {
            db.close();
            log = 'MONGO | Inserted data :\n[';
            log += JSON.stringify(data) + ']';
            process.env.NODE_ENV == 'devdb' ?
                console.log(log) :
                log;
            callback && callback(result);
            return result;
        }).catch(function(err) {
            if (err) {
                throw err;
            }
        });
    }).catch(function(err) {
        if (err) {
            throw err;
        }
    });
};

module.exports = Crud;
