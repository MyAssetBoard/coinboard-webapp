$(document).ready(function() {
	var register = io.connect('http://localhost:3001/register');

	function fillPopup(data) {
		/** empty div before fill */
		var elem = $('#popup');
		$('#ppContent').text('');
		$.each(data, function(key, value) {
			var newline = $('<p>');
			newline.html('<strong>' + key + ' :</strong>');
			newline.append(value);
			$('#ppContent').append(newline);
		})
		setTimeout(function() {elem.fadeToggle('fast');}, 7000);
		elem.toggleClass('hidden');

	}

	function register_send() {
		var tosend = {};
		console.log('ok');
		$("[id^='Input']").each(function(){
			tosend[this.id] = this.value.trim();
		});
		console.log("sending to server : ");
		console.log(tosend);
		register.emit('user signin', tosend);
	}

	register.on('connection', function (socket) { });
	register.on('my-message', function (data) {
		console.log(data);
		fillPopup(data);
	});
	register.on('error-message', function (data) {
		console.log(data);
		fillPopup(data);
	});
	/** dom manip -send event */
	$('#register').click(register_send);
});
