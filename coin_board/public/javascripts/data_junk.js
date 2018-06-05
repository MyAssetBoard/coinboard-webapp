$(document).ready(function () {
    const url = $('#cbws').text().trim();
    const scrapper = new WebSocket(url);
    const utils = new Commons();
    const acts = [
        '#scrape',
        '#eat',
        '#read',
        '#abort',
    ];
    let select = acts.join(',');
    $(select).click(function () {
        scrapper.send($(this).html());
    });
    scrapper.addEventListener('open', function (event) {
        scrapper.send('ok');
    });
    scrapper.addEventListener('message', (event) => {
        let logs = JSON.parse(event.data);
        if (logs.foo) {
            utils.fillPopup(logs);
        } else if (logs.files) {
            utils.fillLogs(logs, '#filescontent');
        } else {
            utils.fillLogs(logs, '#slogcontent');
        }
    });
    scrapper.addEventListener('em', (event) => {
        printError(event.data);
        utils.fillPopup(event.data);
    });
});
