/**
* @file Refresh bot method definition
* @author Trevis Gulby
*/

const {spawn} = require( 'child_process' );
const refresh = {
        id: '/refresh',
        func: function( callback ) {
                process.env['NODE_ENV'] = 'development';
                process.env['NODE_LOG'] = 'djunk';
                process.env['LAUNCH_TASK'] = 'goeat';
                const fp = 'coin_board/methods/datajunk_methods.js';
                const exe = spawn( 'node', [fp] );
                exe.stdout.on( 'data', ( data ) => {
                        resp = data.toString();
                        callback && callback( resp );
                } );

                exe.stderr.on( 'data', ( data ) => {
                        resp = data.toString();
                        callback && callback( resp );
                } );

                exe.on( 'close', ( code ) => {
                        resp = 'child process exited with code' + code;
                        console.log( resp );
                        callback && callback( resp );
                } );
        },
};
module.exports = refresh;
