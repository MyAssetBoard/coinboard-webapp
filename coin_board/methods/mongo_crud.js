/**
 * @file MongoDB CReateUpdateDelete methods definitions
 * @author based on Mongo doc and edited by Trevis Gulby
 */

/** Wow so much methods !
 * @class
 */
class Crud {
    /** @constructor
     * @param {string} dbName Name of the db to connect to
     * @param {string} coll Name of the db collection to create / update
     */
    constructor(dbName, coll) {
        this.dbName = dbName ?
            dbName :
            'test2';
        this.coll = coll ?
            coll :
            'r_users';
        /** Mongodb client object import */
        this.MongoClient = require('mongodb').MongoClient;
        /** Mongodb object id object import */
        this.ObjectId = require('mongodb').ObjectID;
        /** Mongodb local install uri */
        this.uri = 'mongodb://localhost:27017/';
    }
}

/** Insert new data in existing collection
 * @param {string} coll the string with the collection name
 * @param {Objet} data the data to be inserted
 * @param {function} callback to get the response
 */
Crud.prototype.insert = function(coll, data, callback) {
    let _this = this;
    _this.MongoClient.connect(this.uri).then(function(db) {
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

/** Check if user exist based on provided data uid + psswd
 * @param {Objet} c the data to be checked
 * @param {function} callback to get the response
 */
Crud.prototype.checkcred = function(c, callback) {
    let _this = this;
    if (c.username && c.socketid) {
        _this.MongoClient.connect(this.uri).then(function(db) {
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

/** Check if user exist based on provided who object
 * @param {Objet} who the data to be checked
 * @param {function} callback to get the response
 */
Crud.prototype.finduser = function(who, callback) {
    let _this = this;
    _this.MongoClient.connect(this.uri).then(function(db) {
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

/** Make a db request with who param
 * @param {Objet} what the data to be checked
 * @param {function} callback to get the response
 */
Crud.prototype.find = function(what, callback) {
    let _this = this;
    _this.MongoClient.connect(this.uri).then(function(db) {
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

/** Update field in user collection
 * @param {Objet} who the user to be updated
 * @param {Objet} what the fields to be updated
 * @param {Objet} data the new datas
 * @param {function} callback to get the response
 */
Crud.prototype.update = function(who, what, data, callback) {
    let _this = this;
    _this.MongoClient.connect(this.uri).then(function(db) {
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

/** Add new data block in collection
 * @param {Objet} who the user to update
 * @param {Object} what the news name to add
 * @param {Object} data the data to add
 * @param {function} callback to get the response
 */
Crud.prototype.add = function(who, what, data, callback) {
    let _this = this;
    _this.MongoClient.connect(this.uri).then(function(db) {
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
/** CReate Update Delete methods for mongodb
 * @module Crud
 */
