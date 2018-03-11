const ctafjson = '/v1/public/yql?q=select%20title%2Clink%2Cdescription%20from%20rss%20' + 'where%20url%3D%22https%3A%2F%2Fcointelegraph.com%2Frss%3Fformat%3Dxml%22' + '&format=json&diagnostics=true&callback=';
const cryptonewsjson = '/v1/public/yql?q=select%20title%2Clink%2Cdescription%20from%20rss%20' + 'where%20url%3D%22https%3A%2F%2Fcryptocurrencynews.com%2Ffeed%2F%3Fformat%3Dxml%22' + '&format=json&diagnostics=true&callback=';
let d = new Date();
let tmpst = d.getDate();
tmpst += ( d.getMonth() + 1 ) < 10
        ? '0' + ( d.getMonth() + 1 )
        : d.getMonth() + 1;
tmpst += d.getFullYear();
tmpst += '_' + d.getHours() + '-';
tmpst += d.getMinutes() < 10
        ? '0' + d.getMinutes() + '.json'
        : d.getMinutes() + '.json';
const reqmodels = {
        ctaf: {
                id: 'ctaf',
                url: 'https://cointelegraph.com/rss',
                req: {
                        host: 'query.yahooapis.com',
                        path: ctafjson,
                },
                fname: './DTAFOOD/news/ctaf-' + tmpst,
                clean: function( mess ) {
                        let clean = mess.match( /<p>(.*?)<\/p>/g );
                        clean = clean.toString().replace( /<\/?p>/g, '' );
                        return clean;
                },
        },
        crnews: {
                id: 'crnews',
                url: 'https://cryptocurrencynews.com/feed/',
                req: {
                        host: 'query.yahooapis.com',
                        path: cryptonewsjson,
                },
                fname: './DTAFOOD/news/crnews-' + tmpst,
                clean: function( mess ) {
                        let rgx1 = /(<([^>]+)>)/ig;
                        let rgx2 = /[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi;
                        let result = mess.replace( rgx1, '' );
                        result = result.replace( rgx2, ' ' );
                        return result.toString().split( 'Read The Full' )[0];
                },
        },
};

module.exports = reqmodels;
