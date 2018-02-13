var MongoClient = require('mongodb').MongoClient;
var uri = "mongodb://localhost:27017/";
/** send data with socket */
var socket = require('socket.io-client')('http://localhost:3001');
/** To be set in constructor before calling module */
var myD = [];


function Crud(dbName, collectName) {
	this.dbName = dbName ? dbName : "test2";
	this.collectName = collectName ? collectName : "users";
	var url = uri + dbName;
}
/** Create a database if not exist */
Crud.prototype.createDb = function (dbName, callback) {
	var url = uri + dbName;
	var log = "ok";
	MongoClient.connect(url)
	.then(function(db) {
		log = "Database " + dbName + " created!";
		console.log(log);
		callback && callback(db);
		db.close();
		return log;
	})
	.catch(function (err) { if (err) throw err; });
	return log;
};

/** Create a Collection if not exist */
Crud.prototype.createCollection = function (collectName, callback) {
	var _this = this;
	MongoClient.connect(uri)
	.then(function(db)
	{
		var dbo = db.db(_this.dbName);
		dbo.createCollection(collectName)
		.then(function(result) {
			console.log("MONGO - Succesfully connected to " + dbName);
			console.log("Collection [" + collectName + "] created!");
			var env = process.env.NODE_ENV || 'dev';
			if (env == 'dev') console.log(res);
			db.close();
			callback && callback(result);
		})
		.catch(function (err) { if (err) throw err; });
	})
	.catch(function (err) { if (err) throw err; });

}

Crud.prototype.InsertInCollection = function (collectName, data, callback) {
	var _this = this;
	MongoClient.connect(uri)
	.then(function(db) {
		var dbo = db.db(_this.dbName);
		dbo.collection(collectName).insertOne(data)
		.then(function(res) {
			console.log("1 document inserted : ");
			console.log(JSON.stringify(data));
			db.close();
			callback && callback(res);
			return res;
		})
		.catch(function (err) { if (err) throw err; });
	})
	.catch(function (err) {if (err) throw err;});
}

Crud.prototype.FindInCollection = function (collectName, tofind, callback) {
	var _this = this;
	MongoClient.connect(uri)
	.then(function (db) {
		console.log("MONGO - Connected to " + _this.dbName);
		var dbo = db.db(_this.dbName);
		dbo.collection(collectName).findOne(tofind)
		.then(function(result) {
			db.close();
			callback && callback(result);
			return result;
		})
		.catch(function (err) { if (err) throw err; });
	})
	.catch(function (err) { if (err) throw err; })
};

module.exports = Crud;
