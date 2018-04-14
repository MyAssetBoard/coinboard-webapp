/** Commons helper function class
 * @class
 */
class Commons {
    /** @constructor */
    constructor() {
        this.fillPopup = (data) => {
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
                $('#popup').fadeToggle('fast');
            }, 2500);
        };
        this.getCookie = (key) => {
            let value = '; ' + document.cookie;
            let parts = value.split('; ' + key + '=');
            if (parts.length == 2) {
                return parts.pop().split(';').shift();
            }
        };
    }
}
