/**
* @file Main runable executable for mongo client  micro service
* @author based on mongodb doc app and edited by Trevis Gulby
*/

/** @brief data en vrac for testing CRUD methods 
*/
var assetsdata = [
	{symbol_id : "EUR", sum : 6.50},
	{symbol_id : "ETH", sum : 2.67},
	{symbol_id : "XMR", sum : 21.70}
];
var symbols = require('../../tmpdata/cryptocurrencies.json');
var clean = [];
Object.keys(symbols).forEach(function(key) {
	clean.push( { '_id': key, '_name' : symbols[key] });
});

console.log(JSON.stringify(clean));
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
/** DB conf **/
const dbName = 'coin_board';
const listenPort = 27017;
const url = "mongodb://localhost:" + listenPort;
const insertDocuments = function(db, collection, newdata, callback) {
	collection.insertMany(newdata, function(err, result) {
 		console.log("Inserted" + result + " into the collection");
 		callback(result);
 	});
}
const findDocuments = function(db, collection, callback) {
	// Find some documents
	collection.find({}).toArray(function(err, docs) {
		assert.equal(err, null);
		console.log("Found the following records");
		console.log(docs)
		callback(docs);
	});
}

MongoClient.connect(url, function(err, client) {
	assert.equal(null, err);
	console.log("Connected successfully to server");

	const db = client.db(dbName);
	const collection = db.collection('tickers');
	insertDocuments(db, collection, clean,  function() {
		findDocuments(db, collection, function() {
			client.close();
		});
	});
});
