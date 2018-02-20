/* global io:false */
$(document).ready(function() {
	var assetws  = io.connect('http://localhost:3001/assets');

	assetws.on('connect', function () {
		console.log('ok co');
	});

	assetws.on('error', function (e) {
		console.log('System', e ? e : 'A unknown error occurred');
	});

	$('#vadd').click(function () {
		$('#collapseOne').collapse('toggle');

	});
	$('button[id^="Tick-"]').click(function () {
		var thisInput = $(this).text().trim();
		var thisQtt = thisInput.split('|')[1].trim();
		var thisTicker = thisInput.split('|')[0].trim();
		console.log('Ticker :' + thisTicker);
		console.log(' Qtt :' + thisQtt);
		var req_url = 'https://min-api.cryptocompare.com/data/price?fsym=';
		req_url += thisTicker + '&tsyms=EUR';
		$.get(req_url, function (res) {
			if (res) {
				console.log(res);
			}
		});
	});

	$('#add').click(function () {
		var inputTicker = $( '#ticker option:selected' ).text();
		var usrid = document.cookie.replace('uid=', '');
		console.log(usrid);
		var inputQtt = $( '#qtt' ).val();
		inputTicker = inputTicker.trim();
		inputQtt = inputQtt.trim();
		if (!inputTicker.length || inputQtt.length > 10) {
			return ;
		} else {
			var req = {
				ticker : inputTicker,
				qtt: inputQtt,
				id: usrid
			};
			console.log('to send\n[' + JSON.stringify(req) + ']');
			assetws.emit('add asset', req);
		}
	});
});
