$(document).ready(function() {
	var auth = io.connect('http://localhost:3001/auth');

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

	function sendname() {
		var name = $('#inputName').val();
		name = name.trim();
		if (name.length > 2) {
			auth.emit('user login', {'findName': name});
		}
	}

	auth.on('connection', function (socket) {});
	auth.on('my-message', function (data) {
		console.log(data);
		fillPopup(data);
	});
	auth.on('error-message', function (data) {
		console.log(data);
		fillPopup(data);
	});
	/** dom manip - login event */
	$('#login').click(sendname);
});
