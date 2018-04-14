/* global io:false */

$(document).ready(function() {
    let url = $('#cbws').text().trim();
    const register = io.connect(url + 'register');
    const utils = new Commons();

    /** trim value and call user signin method on auth socket */
    function regsend() {
        let tosend = {};
        console.log('ok');
        $('[id^=\'i\']').each(function() {
            tosend[this.id] = this.value.trim();
        });
        console.log('sending to server : ');
        console.log(tosend);
        register.emit('user signin', tosend);
    }

    register.on('connection', function() {});
    register.on('nm', (data) => {
        if (data.scktid) {
            $('#isocket').val(data.scktid);
        } else if (data.ok && data.ok == 1) {
            utils.fillPopup(data);
            window.setTimeout(function() {
                window.location.href = './login';
            }, 2000);
        } else {
            utils.fillPopup(data);
        }
        console.log(data);
    });
    register.on('em', function(data) {
        console.log(data);
        utils.fillPopup(data);
    });
    /** dom manip -send event */
    $('#register').click(regsend);
});
