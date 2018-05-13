$(document).ready(function() {
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
    $(select).click(function() {
        scrapper.send($(this).html());
    });
    scrapper.addEventListener('open', function(event) {
        scrapper.send('ok');
    });
    scrapper.addEventListener('message', (event) => {
        console.log(event.data);
        utils.fillPopup({ok: event.data});
    });
    scrapper.addEventListener('em', (event) => {
        printError(event.data);
        utils.fillPopup(event.data);
    });
});
