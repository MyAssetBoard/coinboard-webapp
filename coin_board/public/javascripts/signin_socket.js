/* global io:false */

$( document ).ready( function() {
        let url = $( '#cbws' ).text().trim() + ':124/register';
        const register = io.connect( url );

        /**
        * @param {Object} data
        */
        function fillPopup( data ) {
                /** empty div before fill */
                let elem = $( '#popup' );
                $( '#ppContent' ).text( '' );
                $( '#ppContent' ).removeClass( 'alert-danger' );
                $( '#ppContent' ).addClass( 'alert-info' );
                if ( data.scktid ) {
                        $( '#InputSocketid' ).val( data.scktid );
                } else {
                        if ( !data.errcode ) {
                                $.each( data, function( key, value ) {
                                        let newline = $( '<p>' );
                                        let ct = '<strong>' + key;
                                        ct += ' :</strong>';
                                        newline.html( ct );
                                        newline.append( value );
                                        $( '#ppContent' ).append( newline );
                                } );
                        } else {
                                $( '#ppContent' ).toggleClass( 'alert-info alert-danger' );
                                let newline = $( '<p>' );
                                let ct = '<strong> Error ' + data.errcode;
                                ct += ' : </strong>';
                                newline.html( ct );
                                newline.append( data.msg );
                                $( '#ppContent' ).append( newline );
                        }
                        elem.fadeIn( 'fast' );
                        setTimeout( function() {
                                elem.fadeToggle( 'fast' );
                        }, 7000 );
                }
        }

        /**
        * @brief trim value
        * and call user signin method on auth socket
        */
        function regsend() {
                let tosend = {};
                console.log( 'ok' );
                $( '[id^=\'i\']' ).each( function() {
                        tosend[this.id] = this.value.trim();
                } );
                console.log( 'sending to server : ' );
                console.log( tosend );
                register.emit( 'user signin', tosend );
        }

        register.on( 'connection', function() {} );
        register.on( 'nm', function( data ) {
                if ( data.scktid ) {
                        $( '#isocket' ).val( data.scktid );
                } else if ( data.ok && data.ok == 1 ) {
                        fillPopup( data );
                        window.setTimeout( function() {
                                window.location.href = './login';
                        }, 2000 );
                } else {
                        fillPopup( data );
                }
                console.log( data );
        } );
        register.on( 'em', function( data ) {
                console.log( data );
                fillPopup( data );
        } );
        /** dom manip -send event */
        $( '#register' ).click( regsend );
} );
