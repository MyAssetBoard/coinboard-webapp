let log = 'U reach a bug, see page source for details' + '\n\n';
log += '--> Help Fightings bugs by making a report on our Bitbucket repo';
console.log(log);
let t1 = window.setTimeout(function () {
    window.location = '/';
}, 10000);
console.log('\n\tRedirecting to homepage in 10s...');
t1;
