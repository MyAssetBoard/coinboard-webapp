/**
* @file @mongo CRUD methods definitions
* @author based on Mongo doc and edited by Trevis Gulby
*/

const MongoClient = require( 'mongodb' ).MongoClient;
const ObjectId = require( 'mongodb' ).ObjectID;
const Crypt = require( '../methods/crypt_methods' );
const uri = 'mongodb://localhost:27017/';

/**
* @param {string} dbName
* @param {string} coll
*/
function Crud( dbName, coll ) {
        this.dbName = dbName
                ? dbName
                : 'test2';
        this.coll = coll
                ? coll
                : 'r_users';
}

Crud.prototype.insert = function( coll, data, callback ) {
        let _this = this;
        MongoClient.connect( uri ).then( function( db ) {
                const dbo = db.db( _this.dbName );
                let log = 'MONGO - Connected to ' + _this.dbName;
                process.env.NODE_ENV == 'development'
                        ? console.log( log )
                        : log;
                dbo.collection( coll ).insertOne( data ).then( function( res ) {
                        log = 'MONGO| 1 document inserted :\n[';
                        log += JSON.stringify( data ) + ']';
                        process.env.NODE_ENV == 'development'
                                ? console.log( log )
                                : log;
                        db.close();
                        callback && callback( res );
                        return res;
                } ).catch( function( err ) {
                        if ( err ) {
                                throw err;
                        }
                } );
        } ).catch( function( err ) {
                if ( err ) {
                        throw err;
                }
        } );
};

Crud.prototype.checkcred = function( c, callback ) {
        let _this = this;
        if ( c.username && c.socketid ) {
                MongoClient.connect( uri ).then( function( db ) {
                        let log = 'MONGO - Connected to ' + _this.dbName;
                        process.env.NODE_ENV == 'development'
                                ? console.log( log )
                                : log;
                        let dbo = db.db( _this.dbName );
                        dbo.collection( _this.coll ).findOne( c ).then( function( res ) {
                                db.close();
                                callback && callback( res );
                                return res;
                        } ).catch( function( err ) {
                                if ( err ) {
                                        throw err;
                                }
                        } );
                } ).catch( function( err ) {
                        if ( err ) {
                                throw err;
                        }
                } );
        }
};

Crud.prototype.finduser = function( who, callback ) {
        let _this = this;
        MongoClient.connect( uri ).then( function( db ) {
                let log = 'MONGO - Connected to ' + _this.dbName;
                process.env.NODE_ENV == 'development'
                        ? console.log( log )
                        : log;
                let dbo = db.db( _this.dbName );
                dbo.collection( _this.coll ).findOne( who ).then( function( res ) {
                        db.close();
                        callback && callback( res );
                        return res;
                } ).catch( function( err ) {
                        if ( err ) {
                                throw err;
                        }
                } );
        } ).catch( function( err ) {
                if ( err ) {
                        throw err;
                }
        } );
};

Crud.prototype.find = function( who, what, callback ) {
        let _this = this;
        MongoClient.connect( uri ).then( function( db ) {
                let log = 'MONGO - Connected to ' + _this.dbName;
                process.env.NODE_ENV == 'development'
                        ? console.log( log )
                        : log;
                let dbo = db.db( _this.dbName );
                let req = {
                        who,
                        what,
                };
                dbo.collection( _this.coll ).find( req ).then( function( res ) {
                        db.close();
                        callback && callback( res );
                        return res;
                } ).catch( function( err ) {
                        if ( err ) {
                                throw err;
                        }
                } );
        } ).catch( function( err ) {
                if ( err ) {
                        throw err;
                }
        } );
};

Crud.prototype.update = function( who, what, data, callback ) {
        let _this = this;
        MongoClient.connect( uri ).then( function( db ) {
                const dbo = db.db( _this.dbName );
                const uid = new ObjectId( who );
                const opt = '$push';
                let fuid = {};
                let fset = {};
                fset[opt] = {};

                fuid['_id'] = uid;
                fset[opt][what] = data;
                let log = 'MONGO - Connected to ' + _this.dbName;
                process.env.NODE_ENV == 'development'
                        ? console.log( log )
                        : log;
                dbo.collection( _this.coll ).update( fuid, fset ).then( function( result ) {
                        db.close();
                        log = 'MONGO | Inserted data :\n[';
                        log += JSON.stringify( data ) + ']';
                        process.env.NODE_ENV == 'development'
                                ? console.log( log )
                                : log;
                        callback && callback( result );
                        return result;
                } ).catch( function( err ) {
                        if ( err ) {
                                throw err;
                        }
                } );
        } ).catch( function( err ) {
                if ( err ) {
                        throw err;
                }
        } );
};

Crud.prototype.add = function( who, what, data, callback ) {
        let _this = this;
        MongoClient.connect( uri ).then( function( db ) {
                const dbo = db.db( _this.dbName );
                const uid = new ObjectId( who );
                const opt = '$push';
                let fuid = {};
                let fset = {};

                fset[opt] = {};
                fuid['_id'] = uid;
                fset[opt][what] = data;
                let log = 'MONGO - Connected to ' + _this.dbName;
                process.env.NODE_ENV == 'development'
                        ? console.log( log )
                        : log;
                dbo.collection( _this.coll ).update( fuid, fset ).then( function( result ) {
                        db.close();
                        log = 'MONGO | Inserted data :\n[';
                        log += JSON.stringify( data ) + ']';
                        process.env.NODE_ENV == 'development'
                                ? console.log( log )
                                : log;
                        callback && callback( result );
                        return result;
                } ).catch( function( err ) {
                        if ( err ) {
                                throw err;
                        }
                } );
        } ).catch( function( err ) {
                if ( err ) {
                        throw err;
                }
        } );
};

module.exports = Crud;
