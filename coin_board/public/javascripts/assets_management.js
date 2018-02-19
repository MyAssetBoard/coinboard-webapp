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
});
