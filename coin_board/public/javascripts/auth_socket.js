/* global io:false */

$( document ).ready( function() {
        let url = $( '#cbws' ).text().trim() + ':124/auth';
        const auth = io.connect( url );

        /**
        * @param {Object} data
        */
        function fillPopup( data ) {
                /** empty div before fill */
                let elem = $( '#popup' );
                $( '#ppContent' ).text( '' );
                $( '#ppContent' ).removeClass( 'alert-danger' );
                $( '#ppContent' ).addClass( 'alert-info' );
                if ( !data.emsg ) {
                        $.each( data, function( key, value ) {
                                let newline = $( '<p>' );
                                let el = '<strong>' + key + ' :</strong>';
                                newline.html( el );
                                newline.append( value );
                                $( '#ppContent' ).append( newline );
                        } );
                } else {
                        let cl = 'alert-info alert-danger';
                        let newline = $( '<p>' );
                        let el = '<strong> <span class="lnr lnr-warning">';
                        el += '</span> Error : </strong>';
                        newline.html( el );
                        newline.append( data.errmsg );
                        $( '#ppContent' ).toggleClass( cl );
                        $( '#ppContent' ).append( newline );
                }
                elem.fadeIn( 'fast' );
                setTimeout( function() {
                        elem.fadeToggle( 'fast' );
                }, 7000 );
        }

        /**
        * @brief sendname event handler
        */
        function sendname() {
                let name = $( '#inputName' ).val();
                let scktid = $( '#inputSocketid' ).val();
                name = name.trim();
                scktid = scktid.trim();
                let toSend = {};
                toSend['iname'] = name;
                toSend['isocket'] = scktid;
                console.log( 'Sending :' );
                console.log( toSend );
                if ( name.length > 2 ) {
                        auth.emit( 'user login', toSend );
                }
        }

        /**
        * @brief print error
        * @param {Object} data
        */
        function printError( data ) {
                console.log( data );
                $( '#inputName' ).toggleClass( 'is-invalid' );
                $( '#inputSocketid' ).toggleClass( 'is-invalid' );
        }

        auth.on( 'connection', function( socket ) {
                console.log( socket.id );
        } );
        auth.on( 'nm', function( data ) {
                if ( data._id ) {
                        fillPopup( data );
                        window.setTimeout( function() {
                                let uri = '/id/';
                                uri += encodeURIComponent( data._id );
                                window.location.href += uri;
                        }, 2000 );
                } else {
                        fillPopup( data );
                }
        } );
        auth.on( 'em', function( data ) {
                printError( data );
                fillPopup( data );
        } );
        /** dom manip - login event */
        $( '#login' ).click( function() {
                sendname();
        } );
} );
