var MongoClient = require('mongodb').MongoClient;
var uri = "mongodb://localhost:27017/";
/** send data with socket */
var socket = require('socket.io-client')('http://localhost:3001');

/** To be set before calling module */
var dbName = "";
var myD = [];

function wait_cmd(err, db) {
	if (err) { throw err; }
	this.myD = db;
	return db;
}

function check_ifexist(err, db) {
	if (err) { throw err; }
}

function Crud(dbname) {
	dbName = dbName ? dbName : "test2";
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
Crud.prototype.createCollection = function (dbName, collectName, callback) {
	MongoClient.connect(uri)
	.then(function(db)
	{
		var dbo = db.db(dbName);
		dbo.createCollection(collectName)
		.then(function(result) {
			log = "MONGO - Succesfully connected to " + dbName;
			console.log(log);
			var logs = "Collection [" + collectName;
			logs += "] created!";
			console.log(logs);
			var env = process.env.NODE_ENV || 'dev';
			if (env == 'dev') console.log(res);
			db.close();
			callback && callback(result);
		})
		.catch(function (err) { if (err) throw err; });
	})
	.catch(function (err) { if (err) throw err; });

}

Crud.prototype.InsertInCollection = function (dbName, collectName, data, callback) {
	MongoClient.connect(uri, function(err, db) {
		if (err) throw err;
		var dbo = db.db(dbName);
		var myobj = { companyname: "Company Inc", address: "Highway 37" };
		myobj['name'] = data;
		var tofind = { name: data };
		var exist = dbo.collection(collectName).findOne(tofind, function(err, result) {
			if (err) throw err;
			return result.name ? true : false;
		});
		if (!exist) {
			dbo.collection(collectName).insertOne(myobj)
			.then(function(res) {
				console.log("1 document inserted : \n\t");
				console.log(JSON.stringify(myobj));
				db.close();
				callback && callback(res);
				return res;
			})
			.catch(function (err) { if (err) throw err; });
		} else {
			callback && callback(null);
			return null;
		}
	});
}

Crud.prototype.FindInCollection = function (dbName, collectName, key, value, callback) {
	var tofind = {};
	tofind[key] = value;
	MongoClient.connect(uri)
	.then(function (db) {
		log = "MONGO - Succesfully connected to " + dbName;
		console.log(log);
		var dbo = db.db(dbName);
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
