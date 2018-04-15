/**
 * @file {@link Crud} CReateUpdateDelete methods definitions
 * @author based on Mongo doc and edited by Trevis Gulby
 */

/** Wow so much methods !
 * @class
 */
class Crud {
    /** @constructor
     * @param {string} dbName Name of the db to connect to test2 if unset
     * @param {string} coll Name of the db collection to create / update,
     * r_users by default
     */
    constructor(dbName, coll) {
        this.dbName = dbName ? dbName : 'test2';
        this.coll = coll ? coll : 'r_users';
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
    _this.MongoClient.connect(this.uri).then((db) => {
        const dbo = db.db(_this.dbName);
        let log = 'Insert| MONGO - Connected to ' + _this.dbName;
        process.env.NODE_ENV == 'development' ? console.log(log) : log;
        dbo.collection(coll).insertOne(data).then((res) => {
            db.close();
            log = 'MONGO - Inserted :\n[' + JSON.stringify(data) + ']';
            process.env.NODE_ENV == 'development' ? console.log(log) : log;
            return callback && callback(res);
        }).catch((err) => {
            return callback && callback(err);
        });
    }).catch(function(err) {
        return callback && callback(err);
    });
};

/** Check if user exist based on provided data uid + psswd
 * or simply a telegramid
 * @param {Objet} c the data to be checked
 * @param {function} callback to get the response
 */
Crud.prototype.checkcred = function(c, callback) {
    let _this = this;
    if ((c.username && c.socketid) || c.telegramid) {
        _this.MongoClient.connect(this.uri).then((db) => {
            let log = 'Checkcred| MONGO - Connected to ' + _this.dbName;
            process.env.NODE_ENV == 'development' ? console.log(log) : log;
            console.log('checking ' + JSON.stringify(c));
            let dbo = db.db(_this.dbName);
            dbo.collection(_this.coll).findOne(c).then((res) => {
                db.close();
                return callback && callback(res);
            }).catch((err) => {
                return callback && callback(err);
            });
        }).catch((err) => {
            return callback && callback(err);
        });
    }
};

/** Check if user exist based on provided who object
 * @param {Objet} who the data to be checked
 * @param {function} callback to get the response
 */
Crud.prototype.finduser = function(who, callback) {
    let _this = this;
    _this.MongoClient.connect(this.uri).then((db) => {
        let log = 'Finduser| MONGO - Connected to ' + _this.dbName;
        process.env.NODE_ENV == 'development' ? console.log(log) : log;
        let dbo = db.db(_this.dbName);
        dbo.collection(_this.coll).findOne(who).then((res) => {
            db.close();
            return callback && callback(res);
        }).catch((err) => {
            return callback && callback(err);
        });
    }).catch((err) => {
        return callback && callback(err);
    });
};

/** Make a db request with who param
 * @param {Objet} what the data to be checked
 * @param {function} callback to get the response
 */
Crud.prototype.find = function(what, callback) {
    let _this = this;
    _this.MongoClient.connect(this.uri).then((db) => {
        let log = 'Find| MONGO - Connected to ' + _this.dbName;
        let dbo = db.db(_this.dbName);
        process.env.NODE_ENV == 'development' ? console.log(log) : log;
        dbo.collection(_this.coll).find(what).toArray((err, doc) => {
            db.close();
            if (err) {
                return callback && callback(err);
            } else {
                return callback && callback(doc);
            }
        });
    }).catch((err) => {
        return callback && callback(err);
    });
};

/** Update a who user collection with what.data
 * @param {Objet} who the user to be updated
 * @param {Objet} what the fields to be updated
 * @param {Objet} data the new datas
 * @param {function} callback to get the response
 */
Crud.prototype.update = function(who, what, data, callback) {
    let _this = this;
    _this.MongoClient.connect(this.uri).then((db) => {
        let log = 'Update| MONGO - Connected to ' + _this.dbName;
        const dbo = db.db(_this.dbName);
        const uid = new _this.ObjectId(who);
        let fuid = {};
        fuid['_id'] = uid;
        let fset = {};
        fset['$push'] = {};
        fset['$push'][what] = data;
        process.env.NODE_ENV == 'development' ? console.log(log) : log;
        dbo.collection(_this.coll).update(fuid, fset).then((result) => {
            db.close();
            log = 'MONGO - Inserted :\n[' + JSON.stringify(data) + ']';
            process.env.NODE_ENV == 'development' ? console.log(log) : log;
            return callback && callback(result);
        }).catch((err) => {
            return callback && callback(err);
        });
    }).catch((err) => {
        return callback && callback(err);
    });
};

module.exports = Crud;
/** ### CReate Update Delete methods for mongodb
 * @module crud
 */
