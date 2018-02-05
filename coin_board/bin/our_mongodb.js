/**
* @file Main runable executable for mongodb  micro service
* @author based on mongodb doc app and edited by Trevis Gulby
*/

const spawn = require('child_process').spawn;
const pipe = spawn('mongod', ['-f', 'conf/mongodb.conf'])

console.log('MONGO DB - coin_board micro service started\n');

pipe.stdout.on('data', function (data) {
	console.log(data.toString('utf8'));
});

pipe.stderr.on('data', (data) => {
	console.log(data.toString('utf8'));
});

pipe.on('close', (code) => {
	console.log('Process exited with code: '+ code);
});
