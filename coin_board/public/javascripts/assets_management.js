/* global io:false */
$(document).ready(function() {
	var assetws  = io.connect('http://localhost:3001/assets');

	assetws.on('connect', function () {
		console.log('ok co');
	});

	assetws.on('error', function (e) {
		console.log('System', e ? e : 'A unknown error occurred');
	});
	$('[id^=\'show\']').click(function(){
		if ($(this).attr('id') === 'showAdd') {
			$('#yoloshowAdd').toggleClass('hidden');
		} else {
			$('#yoloshowMine').toggleClass('hidden');
		}
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
