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

module.exports =  config;
