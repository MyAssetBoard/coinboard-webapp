/**
* @file Chart api node app
* @author Trevis Gulby
*/

const http = require('http');
const chartConf = require('../params/chart_params');

http.createServer((request, response) => {
	const { headers, method, url } = request;
	let body = [];
	request.on('error', (err) => {
		console.error(err);
	}).on('data', (chunk) => {
		body.push(chunk);
	}).on('end', () => {
		body = Buffer.concat(body).toString();
		// BEGINNING OF NEW STUFF
		console.log(body);
		response.on('error', (err) => {
			console.error(err);
		});

		response.statusCode = 200;
		response.setHeader('Content-Type', 'application/json');

		const responseBody = {
			headers,
			method,
			url,
			chartConf
		};
		response.write(JSON.stringify(responseBody));
		response.end();
	});
}).listen(8080);
