/** Commons helper function class
 * @class
 */
class Commons {
    /** @constructor */
    constructor() {
        this.getCookie = (key) => {
            let value = '; ' + document.cookie;
            let parts = value.split('; ' + key + '=');
            if (parts.length == 2) {
                return parts.pop().split(';').shift();
            }
        };
        this.msgcnt = 0;
    }
}

/** DOM manip for user reading of websocket feed
 * @param {Object} data new received data
 */
Commons.prototype.fillPopup = function(data) {
    let _this = this;
    $('#ppContent').text('');
    $('#ppContent').removeClass('alert-danger');
    $('#ppContent').addClass('alert-info');
    _this.msgcnt += 1;
    if (!data.emsg) {
        $.each(data, (key, value) => {
            let newline = $('<li id=' + 'key' + '>');
            newline.append(value);
            $('#ppContent').append(newline);
        });
    } else {
        let newline = $('<li>');
        let ct = '<strong> <span class="lnr lnr-warning">';
        ct += '</span> Error : </strong>';
        newline.html(ct);
        newline.append(data.errmsg);
        $('#ppContent').toggleClass('alert-info alert-danger');
        $('#ppContent').append(newline);
    }
    $('#popup').fadeIn('fast');
    $('#msgnb').html(_this.msgcnt.toString());
    setTimeout(() => {
        $('#popup').fadeToggle('fast');
    }, 2500);
};
