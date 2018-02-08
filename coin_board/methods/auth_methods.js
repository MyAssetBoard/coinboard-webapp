const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
// Connection URL
const url = 'mongodb://localhost:27017';

// Database Name
const dbName = 'users';

function createTextIndex(db, indexname, callback)
{
	// Get the documents collection
	const collection = db.collection(dbName);
	var com = {};
	this.indexname = indexname;
	//console.log(indexname);
	com[indexname] = "text";
	console.log(JSON.stringify(com));
	// Create the index
	collection.createIndex(com, function(err, result) {
		console.log(result);
		if (err) {
			console.error('Auth_method - Create index throw error : ');
			console.error(err.message);
			throw (err);
		}
		callback(result);
	});
};

function createAscendingIndex(db, indexname, callback)
{
	// Get the users collection
	const collection = db.collection(dbName);
	var birthdate = { indexname : 1 };
	// Create the index
	collection.createIndex(birthdate, function(err, result) {
		console.log(result);
		callback(result);
	});
};

function Auth() {
	this.userEmail = "deflt@deflt.es";
}

Auth.prototype.connect = function (email) {
	// Use connect method to connect to the server
	MongoClient.connect(url, function(err, client) {
		assert.equal(null, err);
		console.log("Auth_method - Connected successfully to Mongod");
		console.log(email);
		const db = client.db(dbName);
		if (email) {
			createTextIndex(db, email, function(result) {
				assert.equal(email + '_text', result);
				console.log('create' + email + 'text index');
			})
		}
		createAscendingIndex(db, "yolo", function(result) {
			assert.equal('yolo_1', result);
			console.log('create yolo index');
		})
		// db.person.findOne()
		// {
		// 	email: email
		// }
		client.close();
	});
	return a = "yolo";
};



module.exports = Auth;
