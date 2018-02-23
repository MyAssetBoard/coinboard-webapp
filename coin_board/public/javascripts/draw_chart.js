/*
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
			fill:false,
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
			text:'MinandMaxSettings'
		},
		scales:{
			yAxes:[{
				ticks:{
					suggestedMin:10,
					suggestedMax:50
				}
			}]
		}
	}
};

var myChart = [];
var my2chatr = [];
var i = 0;
var j = 0;
$('canvas[id^="myChart-"]').each(function () {
	i += 1;
	console.log('yolo');
	myChart[i] = new Chart($(this), config);
});
$('canvas[id^="myChart2-"]').each(function () {
	j += 1;
	console.log('yolo');
	my2chatr[j] = new Chart($(this), config);
});
*/
var max = 0;
var steps = 10;
var chartData = {};

function respondCanvas() {
	var c = $('#myChart-0');
	var ctx = c.get(0).getContext('2d');
	var container = c.parent();

	var $container = $(container);

	c.attr('width', $container.width()); //max width

	c.attr('height', $container.height()); //max height

	//Call a function to redraw other content (texts, images etc)
	var chart = new Chart(ctx).Line(chartData, {
		scaleOverride: true,
		scaleSteps: steps,
		scaleStepWidth: Math.ceil(max / steps),
		scaleStartValue: 0
	});
}

var GetChartData = function () {
	$.ajax({
		url: 'http://localhost:8081/charts',
		method: 'GET',
		dataType: 'json',
		success: function (d) {
			// chartData = {
			// 	labels: d.AxisLabels,
			// 	datasets: [
			// 		{
			// 			fillColor: 'rgba(220,220,220,0.5)',
			// 			strokeColor: 'rgba(220,220,220,1)',
			// 			pointColor: 'rgba(220,220,220,1)',
			// 			pointStrokeColor: '#fff',
			// 			data: d.DataSets[0]
			// 		}
			// 	]
			// };
			chartData = d;

			max = Math.max.apply(Math, d.DataSets[0]);
			steps = 10;

			respondCanvas();
		}
	});
};

$(document).ready(function() {
	$(window).resize(respondCanvas);

	GetChartData();
});
