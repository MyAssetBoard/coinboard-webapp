/* global io:false */
$(document).ready(() => {
    const url = $('#cbws').text().trim();
    const auth = io.connect(url + 'auth');
    const utils = new Commons();

    /** sendname event handler */
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

    auth.on('connection', (socket) => {
        console.log(socket.id);
    });
    auth.on('nm', (data) => {
        if (data._id) {
            utils.fillPopup(
            {
                success: ' redirecting you to /assets',
            });
            window.setTimeout(function() {
                let uri = '/id/';
                uri += data._id;
                window.location.href += uri;
            }, 2000);
        } else {
            utils.fillPopup(data);
        }
    });
    auth.on('em', (data) => {
        printError(data);
        utils.fillPopup(data);
    });
    /** dom manip - login event */
    $('#login').click(() => {
        sendname();
    });
});
