/* global io:false */
$( document ).ready( function() {
        let assetws = io.connect( 'http://localhost:3001/assets' );

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
                                let ct = '<strong>' + key;
                                ct += ' :</strong>';
                                newline.html( ct );
                                newline.append( value );
                                $( '#ppContent' ).append( newline );
                        } );
                } else {
                        $( '#ppContent' ).toggleClass( 'alert-info alert-danger' );
                        let newline = $( '<p>' );
                        let ct = '<strong> <span class="lnr lnr-warning">';
                        ct += '</span> Error : </strong>';
                        newline.html( ct );
                        newline.append( data.errmsg );
                        $( '#ppContent' ).append( newline );
                }
                elem.fadeIn( 'fast' );
                setTimeout( function() {
                        elem.fadeToggle( 'fast' );
                }, 7000 );
        }
        assetws.on( 'connect', function() {
                console.log( 'Connected to /assets socket stream' );
        } );

        assetws.on( 'error', function( e ) {
                console.log(
                        'System', e
                        ? e
                        : 'A unknown error occurred');
        } );

        assetws.on( 'nm', function( data ) {
                fillPopup( data );
        } );
        assetws.on( 'em', function( data ) {
                fillPopup( data );
        } );

        $( '#vadd' ).click( function() {
                $( '#collapseOne' ).collapse( 'toggle' );
        } );

        $( '#searchme' ).on( 'input', function() {
                let r = $( this ).val().trim();
                r = r.toUpperCase();
                let tgtElem = document.getElementById( r );
                try {
                        tgtElem.scrollIntoView();
                } catch ( e ) {
                        if ( e ) {
                                return;
                        }
                }
        } );

        let config = {
                type: 'line',
                data: {
                        labels: [
                                'January',
                                'February',
                                'March',
                                'April',
                                'May',
                                'June',
                                'July',
                        ],
                        datasets: [
                                {
                                        label: 'ETH',
                                        backgroundColor: 'rgba(255, 99, 132, 0.2)',
                                        borderColor: 'rgba(54, 162, 235, 0.2)',
                                        fill: false,
                                }, {
                                        label: 'EUR',
                                        fill: false,
                                        backgroundColor: 'rgba(255, 99, 132, 0.2)',
                                        borderColor: 'rgba(54, 162, 235, 0.2)',
                                        data: [
                                                18,
                                                33,
                                                22,
                                                19,
                                                11,
                                                39,
                                                30,
                                        ],
                                },
                        ],
                },
                options: {
                        title: {
                                display: true,
                                text: 'Min and Max values',
                        },
                        scales: {
                                yAxes: [
                                        {
                                                ticks: {
                                                        suggestedMin: 10,
                                                        suggestedMax: 50,
                                                },
                                        },
                                ],
                        },
                },
        };

        let myChart = [];
        let my2chatr = [];
        let i = 0;
        let j = 0;
        /* global Chart:false */
        $( 'canvas[id^="myChart-"]' ).each( function() {
                i += 1;
                console.log( 'yolo' );
                myChart[i] = new Chart( $( this ), config );
        } );
        $( 'canvas[id^="myChart2-"]' ).each( function() {
                j += 1;
                my2chatr[j] = new Chart( $( this ), config );
        } );

        $( 'button[id^="Tick-"]' ).click( function() {
                let uri = 'https://min-api.cryptocompare.com/data/price';
                let thisInput = {
                        'i': $( this ).text().trim(),
                };
                thisInput.iqtt = thisInput.i.split( '|' )[1].trim();
                thisInput.isymb = thisInput.i.split( '|' )[0].trim();

                if ( thisInput.iqtt.length && thisInput.isymb.length >= 2 ) {
                        uri += '?fsym=' + thisInput.isymb + '&tsyms=' + 'EUR';
                        $.get( req_url, function( res ) {
                                if ( res ) {
                                        let assetval = parseFloat( thisInput.iqtt );
                                        assetval *= parseFloat( res.EUR );
                                        res['val'] = assetval;
                                        console.log( res );
                                }
                        } );
                }
        } );

        $( '#addme' ).click( function() {
                let inputTicker = $( '#ticker option:selected' ).text();
                let usrid = document.cookie.replace( 'uid=', '' );
                console.log( usrid );
                let inputQtt = $( '#qtt' ).val();
                inputTicker = inputTicker.trim();
                inputQtt = inputQtt.trim();
                if ( !inputTicker.length || inputQtt.length > 10 ) {
                        return;
                } else {
                        let req = {
                                ticker: inputTicker,
                                qtt: inputQtt,
                                id: usrid,
                        };
                        console.log( 'to send\n[' + JSON.stringify( req ) + ']' );
                        assetws.emit( 'add asset', req );
                }
        } );
} );
