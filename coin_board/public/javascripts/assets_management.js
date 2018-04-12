/* global io:false */
$(document).ready(function() {
    let url = $('#cbws').text().trim();
    const assetws = io.connect(url + 'assets');
    let objid = '#' + window.location.pathname.split('/')[2];
    $(objid).toggleClass('active');

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
    assetws.on('connect', function() {
        console.log('Connected to /assets socket stream');
    });

    assetws.on('error', function(e) {
        console.log(
            'System', e ?
            e :
            'A unknown error occurred');
    });

    assetws.on('nm', function(data) {
        fillPopup(data);
    });
    assetws.on('em', function(data) {
        fillPopup(data);
    });

    $('#vadd').click(function() {
        $('#collapseOne').collapse('toggle');
    });

    $('#searchme').on('input', function() {
        let r = $(this).val().trim();
        r = r.toUpperCase();
        let tgtElem = document.getElementById(r);
        try {
            tgtElem.scrollIntoView();
        } catch (e) {
            if (e) {
                return;
            }
        }
    });

    $('button[id^="Tick-"]').click(function() {
        let uri = 'https://min-api.cryptocompare.com/data/price';
        let thisInput = {
            'i': $(this).text().trim(),
        };
        thisInput.iqtt = thisInput.i.split('|')[1].trim();
        thisInput.isymb = thisInput.i.split('|')[0].trim();

        if (thisInput.iqtt.length && thisInput.isymb.length >= 2) {
            uri += '?fsym=' + thisInput.isymb + '&tsyms=' + 'EUR';
            $.get(uri, function(res) {
                if (res) {
                    let aval = parseFloat(thisInput.iqtt);
                    aval *= parseFloat(res.EUR);
                    res['val'] = aval;
                    console.log(res);
                }
            });
        }
    });

    $('#addme').click(function() {
        let inputTicker = $('#ticker option:selected').text();
        let usrid = getCookie('uid');
        let inputQtt = $('#qtt').val();
        inputTicker = inputTicker.trim();
        inputQtt = inputQtt.trim();

        if (!inputTicker.length || inputQtt.length > 10) {
            return;
        } else {
            let req = {
                ticker: inputTicker,
                qtt: inputQtt,
                id: usrid,
            };
            let log = 'to send\n[' + JSON.stringify(req) + ']';
            console.log(log);
            assetws.emit('add asset', req);
        }
    });
});
