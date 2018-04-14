$(document).ready(function() {
    const url = $('#cbws').text().trim();
    const apiparamws = io.connect(url + 'api/param');
    const utils = new Commons();

    let objid = '#' + window.location.pathname.split('/')[2];
    objid += window.location.pathname.split('/')[3];
    $(objid).toggleClass('active');
    /** Trigering add /update user api settings */
    $('#addme').click(function() {
        let apitype = $('#stype').val();
        let inputid = $('#sname').val();
        let inputusr = $('#skey').val();
        let inputpw = $('#ssec').val();
        let usrid = utils.getCookie('uid');
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
        utils.fillPopup(data);
    });
    apiparamws.on('em', function(data) {
        utils.fillPopup(data);
    });
});
