/**
* @file Refresh bot method definition
* @author Trevis Gulby
*/

const {spawn} = require( 'child_process' );
const digest = {
        id: '/digest',
        func: function( callback ) {
                process.env['NODE_ENV'] = 'development';
                process.env['NODE_LOG'] = 'djunk';
                process.env['LAUNCH_TASK'] = 'markme';
                const fp = 'coin_board/methods/datajunk_methods.js';
                const exe = spawn( 'node', [fp] );
                exe.stdout.on( 'data', ( data ) => {
                        let r = data.toString();
                        callback && callback( r );
                } );

                exe.stderr.on( 'data', ( data ) => {
                        let r = data.toString();
                        callback && callback( r );
                } );

                exe.on( 'close', ( code ) => {
                        let r = 'Chid process exited with code [' + code + ']';
                        callback && callback( r );
                } );
        },
};
module.exports = digest;
