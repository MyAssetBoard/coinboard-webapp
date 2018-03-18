const {spawn} = require( 'child_process' );

const showfiles = {
        id: '/tree',
        func: function( callback ) {
                const fp = './DTAFOOD/';
                const ls = spawn( 'tree', [fp] );
                ls.stdout.on( 'data', ( data ) => {
                        resp = data.toString();
                        callback && callback( resp );
                } );

                ls.stderr.on( 'data', ( data ) => {
                        resp = 'ERROR : \n';
                        resp += data.toString();
                        callback && callback( resp );
                } );

                ls.on( 'close', ( code ) => {
                        let log = 'child process exited with code ' + code;
                        console.log( log );
                } );
        },
};
module.exports = showfiles;
