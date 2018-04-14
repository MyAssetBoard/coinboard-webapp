/* global io:false */
$(document).ready(function() {
    const url = $('#cbws').text().trim();
    const assetws = io.connect(url + 'assets');
    const utils = new Commons();
    let objid = '#' + window.location.pathname.split('/')[2];
    $(objid).toggleClass('active');

    assetws.on('connect', () => {
        console.log('Connected to /assets socket stream');
    });

    assetws.on('error', (e) => {
        console.log(
            'System : ', e ?
            e :
            'A unknown error occurred');
    });

    assetws.on('nm', (data) => {
        utils.fillPopup(data);
    });
    assetws.on('em', (data) => {
        utils.fillPopup(data);
    });

    $('#vadd').click(function() {
        $('#collapseOne').collapse('toggle');
    });

    $('#searchme').on('input', () => {
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

    $('button[id^="Tick-"]').click(() => {
        let uri = 'https://min-api.cryptocompare.com/data/price';
        let thisInput = {
            'i': $(this).text().trim(),
        };
        thisInput.iqtt = thisInput.i.split('|')[1].trim();
        thisInput.isymb = thisInput.i.split('|')[0].trim();

        if (thisInput.iqtt.length && thisInput.isymb.length >= 2) {
            uri += '?fsym=' + thisInput.isymb + '&tsyms=' + 'EUR';
            $.get(uri, (res) => {
                if (res) {
                    let aval = parseFloat(thisInput.iqtt);
                    aval *= parseFloat(res.EUR);
                    res['val'] = aval;
                    console.log(res);
                }
            });
        }
    });

    $('#addme').click(() => {
        let inputTicker = $('#ticker option:selected').text();
        let usrid = utils.getCookie('uid');
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
