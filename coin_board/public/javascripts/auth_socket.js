/* global io:false */

$(document).ready(function() {
    let url = $('#cbws').text().trim();
    const auth = io.connect(url + 'auth');

    /**
     * Telegram auth
     * @param {Object} user
     */
    function onTelegramAuth(user) {
        let lg = 'You are successfully logged in as ';
        console.log(lg + user.first_name + (
            user.last_name ?
            ' ' + user.last_name :
            ''));
    }

    /**
     * @param {Object} data
     */
    function fillPopup(data) {
        $('#ppContent').text('');
        $('#ppContent').removeClass('alert-danger');
        $('#ppContent').addClass('alert-info');
        if (!data.emsg) {
            $.each(data, (key, value) => {
                let newline = $('<p>');
                let ct = '<strong>' + key + ' :</strong>';
                newline.html(ct);
                newline.append(value);
                $('#ppContent').append(newline);
            });
        } else {
            let newline = $('<p>');
            let ct = '<strong> <span class="lnr lnr-warning">';
            ct += '</span> Error : </strong>';
            newline.html(ct);
            newline.append(data.errmsg);
            $('#ppContent').toggleClass('alert-info alert-danger');
            $('#ppContent').append(newline);
        }
        $('#popup').fadeIn('fast');
        setTimeout(() => {
            elem.fadeToggle('fast');
        }, 2000);
    }

    /**
     * @brief sendname event handler
     */
    function sendname() {
        let name = $('#inputName').val();
        let scktid = $('#inputSocketid').val();
        name = name.trim();
        scktid = scktid.trim();
        let toSend = {};
        toSend['iname'] = name;
        toSend['isocket'] = scktid;
        console.log('Sending :');
        console.log(toSend);
        if (name.length > 2) {
            auth.emit('user login', toSend);
        }
    }

    /**
     * @brief print error
     * @param {Object} data
     */
    function printError(data) {
        console.log(data);
        $('#inputName').toggleClass('is-invalid');
        $('#inputSocketid').toggleClass('is-invalid');
    }

    auth.on('connection', function(socket) {
        console.log(socket.id);
    });
    auth.on('nm', function(data) {
        if (data._id) {
            fillPopup(
            {
                success: ' redirecting you to /assets',
            });
            window.setTimeout(function() {
                let uri = '/id/';
                uri += data._id;
                window.location.href += uri;
            }, 2000);
        } else {
            fillPopup(data);
        }
    });
    auth.on('em', function(data) {
        printError(data);
        fillPopup(data);
    });
    /** dom manip - login event */
    $('#login').click(function() {
        sendname();
    });
});
