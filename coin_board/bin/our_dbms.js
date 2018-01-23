/**
* @file Main runable executable for rethink db  micro service
* @author based on rethink db doc app and edited by Trevis Gulby
*/

/** Message Database import */
var r = require('rethinkdb');

/** PORT to connect to */
var dbport = process.env.DBPORT || '28015';
/** connected state boolean */
var connection = null;

/** Connection to db method */
r.connect(
	{host: 'localhost', port: dbport, db: '', user: 'admin', password: ''},
	function (err, conn) {
		if (err) {
			console.log('error connecting to db' + '\n Err : \"' +
			err + "\"\n");
			throw err;
		} else {
			console.log('connection to database completed');
			connection = conn;
		}
	});
