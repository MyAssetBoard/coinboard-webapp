/**
* @file @Login methods definitions
* @author based on express boilerplate and edited by Trevis Gulby
*/

/** dep import */
const ObjectID = require( 'mongodb' ).ObjectID;
const Crypt = require( '../methods/crypt_methods' );
const Crud = require( '../methods/mongo_crud' );

/**
*@brief Auth class contructor
*/
function Auth() {}

/**
* @param {string} address
* @return {bool}
*/
function iscoinAddr( address ) {
        let ticker;
        let match = false;
        let regex = {
                'ETH': /^0x.{40}$/,
        };
        for ( ticker in regex ) {
                if ( regex.hasOwnProperty( ticker ) ) {
                        match = regex[ticker].test( address );
                        if ( match ) {
                                break;
                        }
                }
        }
        return match;
}

/**
* @param {Object} d
* @param {Object} path
* @return {Object} stripped datas
*/
function stripD( d, path ) {
        const par = {
                profile: [
                        '_id', 'socketid', 'assets',
                ],
                index: [
                        '_id', 'socketid', 'assets',
                ],
                login: [
                        '_id', 'socketid', 'assets',
                ],
                logsock: [
                        'socketid',
                        'username',
                        'useremail',
                        'ethaddr',
                        'usercurrency',
                        'assets',
                ],
                assets: ['_id', 'socketid'],
        };
        for ( let el in par ) {
                if ( el == path ) {
                        for ( let s in par[el] ) {
                                if ( d.hasOwnProperty( par[el][s] ) ) {
                                        let todel = par[el][s];
                                        delete d[todel];
                                }
                        }
                        return d;
                }
        }
}

/**
* @brief basically checking is a decrypted _id
*exist in user collection and
*strip private fields from result
* @param {Object} cuid
* @param {string} path
* @return {Promise}
*/
function checkUid( cuid, path ) {
        return new Promise( ( resolve, reject ) => {
                let crud = new Crud( 'test2', 'r_users' );
                let who = new ObjectID( cuid );
                crud.finduser( who, function( res ) {
                        if ( res ) {
                                stripD( res, path );
                                resolve( res );
                        }
                        reject( new Error( 'Bad Id' ) );
                } );
        } );
}

/**
* @brief username /password checking method
* @param {Object} data
* @return {Promise}
*/
function checkUsr( data ) {
        return new Promise( ( resolve, reject ) => {
                let value = data.iname.replace( /\W/g, '' );
                let value1 = data.isocket;
                let toFind = {};
                toFind['username'] = value;
                toFind['socketid'] = value1;
                let crud = new Crud( 'test2', 'r_users' );
                crud.checkcred( toFind, function( result ) {
                        if ( result ) {
                                stripD( result, 'logsock' );
                                resolve( result );
                        } else {
                                reject( new Error( 'Bad user' ) );
                        }
                } );
        } );
}

/**
* @param {Object} d
* @return {Object}
*/
function checkRegFields( d ) {
        console.log( 'check reg filed' );
        if ( !d.iname || !d.imail || !d.isocket ) {
                return undefined;
        } else {
                d.iname = d.iname.replace( /\W/g, '' );
                d.imail = d.iname.trim();
                d.isocket = d.isocket.trim();
                d.ieth = iscoinAddr( d.ieth )
                        ? d.ieth
                        : 'NONE';
                d = d.iname.length < 3 || d.imail < 8
                        ? undefined
                        : d.isocket.length < 10 || d.icurr.length != 3
                                ? undefined
                                : d;
                console.log( d );
        }
        return d;
}

/**
* @brief register a new user based on a toregister format
* @param {Object} data
* @return {Promise} result
* @TODO : Make toRegister stick with r_usermodel
*/
Auth.prototype.registerUsr = function( data ) {
        return new Promise( ( resolve, reject ) => {
                const crud = new Crud( 'test2' );
                let chk = checkRegFields( data );
                if ( chk != undefined ) {
                        let ne = {
                                'username': chk.iname,
                                'useremail': chk.imail,
                                'socketid': chk.isocket,
                                'ethaddr': chk.ieth,
                                'usercurrency': chk.icurr,
                        };
                        crud.insert( 'r_users', ne, function( result ) {
                                if ( result ) {
                                        resolve( result );
                                }
                                reject( new Error( 'Db Error' ) );
                        } );
                } else {
                        reject( new Error( 'Invalid data submitted' ) );
                }
        } );
};

Auth.prototype.checkRegData = function( data, socket, io ) {
        if ( data && data.iname && data.imail && data.isocket ) {
                if ( data['ieth'] && data['icurr'] ) {
                        const auth = new Auth();
                        auth.registerUsr( data ).then( function( res ) {
                                let u = socket.id;
                                io.of( '/register' ).to( u ).emit( 'nm', res );
                                return true;
                        } ).catch( function( rej, err ) {
                                console.error( rej.message );
                                let emsg = {
                                        errcode: 22,
                                        msg: rej.message,
                                };
                                let u = socket.id;
                                io.of( '/register' ).to( u ).emit( 'em', emsg );
                                if ( err ) {
                                        throw ( err );
                                }
                                return false;
                        } );
                }
        }
};

Auth.prototype.checkcoData = function( data, socket, io ) {
        if ( data['iname'] && data['isocket'] ) {
                checkUsr( data ).then( function( res ) {
                        const crypt = new Crypt();
                        let enc = crypt.encryptuid( res );
                        let resp = {
                                _id: enc,
                        };
                        process.env.NODE_ENV == 'development'
                                ? console.log( resp )
                                : resp;
                        io.of( '/auth' ).to( socket.id ).emit( 'nm', resp );
                        return true;
                } ).catch( function( rej, err ) {
                        console.error( rej );
                        let emsg = {
                                errmsg: rej.message,
                        };
                        io.of( '/auth' ).to( socket.id ).emit( 'em', emsg );
                        if ( err ) {
                                throw ( err );
                        }
                        return false;
                } );
        }
        return false;
};

Auth.prototype.userisAuth = function( eUid, page ) {
        const crypt = new Crypt();
        let cuid = crypt.decryptuid( eUid );
        return new Promise( ( resolve, reject ) => {
                checkUid( cuid, page ).then( function( res ) {
                        resolve( res );
                } ).catch( function( rej, err ) {
                        if ( err ) {
                                throw err;
                        }
                        reject( new Error( 'user not found' ) );
                } );
        } );
};

Auth.prototype.isvaliduid = function( eUid ) {
        const crypt = new Crypt();
        let test = crypt.decryptuid( eUid );
        return test
                ? true
                : false;
};

module.exports = Auth;
