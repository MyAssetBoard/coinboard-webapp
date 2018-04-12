$(document).ready(function() {
    let url = $('#cbws').text().trim();
    const apiparamws = io.connect(url + 'api/param');
    let objid = '#' + window.location.pathname.split('/')[2];
    objid += window.location.pathname.split('/')[3];
    $(objid).toggleClass('active');

    /**
     * @param {Object} data
     */
    function fillPopup(data) {
        /** empty div before fill */
        let elem = $('#popup');
        $('#ppContent').text('');
        $('#ppContent').removeClass('alert-danger');
        $('#ppContent').addClass('alert-info');
        if (!data.emsg) {
            $.each(data, function(key, value) {
                let newline = $('<p>');
                let ct = '<strong>' + key;
                ct += ' :</strong>';
                newline.html(ct);
                newline.append(value);
                $('#ppContent').append(newline);
            });
        } else {
            let elem = '#ppContent';
            $(elem).toggleClass('alert-info alert-danger');
            let newline = $('<p>');
            let ct = '<strong> <span class="lnr lnr-warning">';
            ct += '</span> Error : </strong>';
            newline.html(ct);
            newline.append(data.errmsg);
            $('#ppContent').append(newline);
        }
        elem.fadeIn('fast');
        setTimeout(function() {
            elem.fadeToggle('fast');
        }, 5000);
    }
    /**
     * @param {string} key
     * @return {string} val
     */
    function getCookie(key) {
        let value = '; ' + document.cookie;
        let parts = value.split('; ' + key + '=');
        if (parts.length == 2) {
            return parts.pop().split(';').shift();
        }
    }
    /** Trigering add /update user api settings */
    $('#addme').click(function() {
        let apitype = $('#stype').val();
        let inputid = $('#sname').val();
        let inputusr = $('#skey').val();
        let inputpw = $('#ssec').val();
        let usrid = getCookie('uid');
        let req = {
            'uid': usrid,
            'apitype': apitype,
            'apiid': inputid,
            'inputid': inputusr,
            'inputpw': inputpw,
        };
        for (let el in req) {
            if (req[el]) {
                req[el] = req[el].trim();
            }
        }
        console.log(req);
        if (!req.inputid.length || !req.inputpw.length) {
            return;
        } else {
            let log = 'To send :\n[' + JSON.stringify(req) + ']';
            console.log(log);
            apiparamws.emit('update api creds', req);
        }
    });
    apiparamws.on('connect', function() {
        console.log('Connected to /api-param socket stream');
    });
    apiparamws.on('error', function(e) {
        console.log(
            'System', e ?
            e :
            'A unknown error occurred');
    });

    apiparamws.on('nm', function(data) {
        fillPopup(data);
    });
    apiparamws.on('em', function(data) {
        fillPopup(data);
    });
});
