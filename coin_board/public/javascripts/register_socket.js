$(document).ready(function() {
	var register = io.connect('http://localhost:3001/register');

	function fillPopup(data) {
		/** empty div before fill */
		var elem = $('#popup');
		$('#ppContent').text('');
		$('#ppContent').removeClass('alert-danger');
		$('#ppContent').addClass('alert-info');
		if (!data.errcode) {
			$.each(data, function(key, value) {
				var newline = $('<p>');
				newline.html('<strong>' + key + ' :</strong>');
				newline.append(value);
				$('#ppContent').append(newline);
			})
		} else {
			$('#ppContent').toggleClass('alert-info alert-danger');
			var newline = $('<p>');
			newline.html('<strong> Error ' + data.errcode + ' : </strong>');
			newline.append(data.msg);
			$('#ppContent').append(newline);
		}
		elem.fadeIn('fast');
		setTimeout(function() {elem.fadeToggle('fast');}, 7000);

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
		if (data.scktid) {
			$('#InputSocketid').val(data.scktid);
		}
		fillPopup(data);
	});
	register.on('error-message', function (data) {
		console.log(data);
		fillPopup(data);
	});
	/** dom manip -send event */
	$('#register').click(register_send);
});
