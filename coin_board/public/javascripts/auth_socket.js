/* global io:false*/

$(document).ready(function() {
	var auth;
	auth = io.connect('http://localhost:3001/auth');

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
			});
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
		var scktid = $('#inputSocketid').val();
		name = name.trim();
		scktid = scktid.trim();
		var toSend = {};
		toSend['inputName'] = name;
		toSend['inputSocketid'] = scktid;
		console.log('Sending :');
		console.log(toSend);
		if (name.length > 2) {
			auth.emit('user login', toSend);
		}
	}

	auth.on('connection', function (socket) {console.log(socket.id);});
	auth.on('my-message', function (data) {
		if (data._id) {
			fillPopup(data);
			window.setTimeout(function(){
				var uri = './myassets?id=' + data._id;
				var res = encodeURI(uri);
				window.location.href = res;
			}, 2000);
		} else {
			fillPopup(data);
		}
		console.log(data);
		fillPopup(data);
	});
	auth.on('error-message', function (data) {
		console.log(data);
		fillPopup(data);
	});
	/** dom manip - login event */
	$('#login').click(function() {
		sendname();
	});
});
