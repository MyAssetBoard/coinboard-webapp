/* global io:false */
$(document).ready(function() {
	var assetws  = io.connect('http://localhost:3001/assets');

	assetws.on('connect', function () {
		console.log('Successfully connected to /assets socket stream');
	});

	assetws.on('error', function (e) {
		console.log('System', e ? e : 'A unknown error occurred');
	});

	$('#vadd').click(function () {
		$('#collapseOne').collapse('toggle');

	});

	$('#searchme').on('input', function() {
		var r = $(this).val().trim();
		r = r.toUpperCase();
		var tgtElem = document.getElementById(r);
		try {tgtElem.scrollIntoView();} catch (e) {if (e) return;}
	});


	var config = {
		type:'line',
		data:{
			labels:['January','February',
				'March','April','May','June',
				'July'],
			datasets:[{
				label:'ETH',
				backgroundColor : 'rgba(255, 99, 132, 0.2)',
				borderColor : 'rgba(54, 162, 235, 0.2)',
				fill : false,
			},{
				label : 'EUR',
				fill : false,
				backgroundColor : 'rgba(255, 99, 132, 0.2)',
				borderColor : 'rgba(54, 162, 235, 0.2)',
				data:[18,33,22,19,11,39,30],
			}]
		},
		options:{
			title:{
				display:true,
				text:'Min and Max values'
			},
			scales:{
				yAxes:[{
					ticks:{
						suggestedMin : 10,
						suggestedMax : 50
					}
				}]
			}
		}
	};

	var myChart = [];
	var my2chatr = [];
	var i = 0;
	var j = 0;
	/* global Chart:false */
	$('canvas[id^="myChart-"]').each(function () {
		i += 1;
		console.log('yolo');
		myChart[i] = new Chart($(this), config);
	});
	$('canvas[id^="myChart2-"]').each(function () {
		j += 1;
		my2chatr[j] = new Chart($(this), config);
	});

	$('button[id^="Tick-"]').click(function(){
		var req_url = 'https://min-api.cryptocompare.com/data/price';
		var thisInput = { 'i' : $(this).text().trim() };
		thisInput.iqtt = thisInput.i.split('|')[1].trim();
		thisInput.isymb = thisInput.i.split('|')[0].trim();

		if (thisInput.iqtt.length && thisInput.isymb.length >= 2) {
			req_url += '?fsym=' + thisInput.isymb + '&tsyms=' + 'EUR';
			$.get(req_url, function (res) {
				if (res) {
					var assetval = parseFloat(thisInput.iqtt);
					assetval *= parseFloat(res.EUR);
					res['val'] = assetval;
					console.log(res);
				}
			});
		}
	});

	$('#addme').click(function () {
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
