# Notes :

    Please read doc before asking for help
    (jsdoc html format + Markdown in each
    subdir README's)

<a name="module_cbexpressapp"></a>

## cbexpressapp
### Coin_Board [Express](expressjs.com) app module


* [cbexpressapp](#module_cbexpressapp)
    * [~CbExpressApp](#module_cbexpressapp..CbExpressApp)
        * [.express](#module_cbexpressapp..CbExpressApp+express)
        * [.path](#module_cbexpressapp..CbExpressApp+path)
        * [.logger](#module_cbexpressapp..CbExpressApp+logger)
        * [.Crypt](#module_cbexpressapp..CbExpressApp+Crypt)
        * [.allowedMethods](#module_cbexpressapp..CbExpressApp+allowedMethods)
        * [.app](#module_cbexpressapp..CbExpressApp+app)
        * [.httpopts](#module_cbexpressapp..CbExpressApp+httpopts)
        * [.favOptions](#module_cbexpressapp..CbExpressApp+favOptions)
        * [.setAppLog()](#module_cbexpressapp..CbExpressApp+setAppLog)
            * [~outputavert](#module_cbexpressapp..CbExpressApp+setAppLog..outputavert)
        * [.pollSecret()](#module_cbexpressapp..CbExpressApp+pollSecret)
    * [~miexpressapp](#module_cbexpressapp..miexpressapp)

<a name="module_cbexpressapp..CbExpressApp"></a>

### cbexpressapp~CbExpressApp
A new express app overloaded class/ module
Yeah yeah it's dirty code I know i'll rewrite later (maybe)

**Kind**: inner class of [<code>cbexpressapp</code>](#module_cbexpressapp)  

* [~CbExpressApp](#module_cbexpressapp..CbExpressApp)
    * [.express](#module_cbexpressapp..CbExpressApp+express)
    * [.path](#module_cbexpressapp..CbExpressApp+path)
    * [.logger](#module_cbexpressapp..CbExpressApp+logger)
    * [.Crypt](#module_cbexpressapp..CbExpressApp+Crypt)
    * [.allowedMethods](#module_cbexpressapp..CbExpressApp+allowedMethods)
    * [.app](#module_cbexpressapp..CbExpressApp+app)
    * [.httpopts](#module_cbexpressapp..CbExpressApp+httpopts)
    * [.favOptions](#module_cbexpressapp..CbExpressApp+favOptions)
    * [.setAppLog()](#module_cbexpressapp..CbExpressApp+setAppLog)
        * [~outputavert](#module_cbexpressapp..CbExpressApp+setAppLog..outputavert)
    * [.pollSecret()](#module_cbexpressapp..CbExpressApp+pollSecret)

<a name="module_cbexpressapp..CbExpressApp+express"></a>

#### cbExpressApp.express
[Express doc](http://expressjs.com/en/api.html)

**Kind**: instance property of [<code>CbExpressApp</code>](#module_cbexpressapp..CbExpressApp)  
<a name="module_cbexpressapp..CbExpressApp+path"></a>

#### cbExpressApp.path
[Path module](https://nodejs.org/api/path.html)

**Kind**: instance property of [<code>CbExpressApp</code>](#module_cbexpressapp..CbExpressApp)  
<a name="module_cbexpressapp..CbExpressApp+logger"></a>

#### cbExpressApp.logger
[Morgan](https://github.com/expressjs/morgan) logger

**Kind**: instance property of [<code>CbExpressApp</code>](#module_cbexpressapp..CbExpressApp)  
<a name="module_cbexpressapp..CbExpressApp+Crypt"></a>

#### cbExpressApp.Crypt
[module:crypt](module:crypt) import for
[module:crypt~Crypt#genrandomtocken](module:crypt~Crypt#genrandomtocken) method routine

**Kind**: instance property of [<code>CbExpressApp</code>](#module_cbexpressapp..CbExpressApp)  
<a name="module_cbexpressapp..CbExpressApp+allowedMethods"></a>

#### cbExpressApp.allowedMethods
Allowed methods settings

**Kind**: instance property of [<code>CbExpressApp</code>](#module_cbexpressapp..CbExpressApp)  
<a name="module_cbexpressapp..CbExpressApp+app"></a>

#### cbExpressApp.app
Yes this is an express app

**Kind**: instance property of [<code>CbExpressApp</code>](#module_cbexpressapp..CbExpressApp)  
<a name="module_cbexpressapp..CbExpressApp+httpopts"></a>

#### cbExpressApp.httpopts
Http header sec settings

**Kind**: instance property of [<code>CbExpressApp</code>](#module_cbexpressapp..CbExpressApp)  
<a name="module_cbexpressapp..CbExpressApp+favOptions"></a>

#### cbExpressApp.favOptions
Favicon static param

**Kind**: instance property of [<code>CbExpressApp</code>](#module_cbexpressapp..CbExpressApp)  
<a name="module_cbexpressapp..CbExpressApp+setAppLog"></a>

#### cbExpressApp.setAppLog()
blabla logging output

**Kind**: instance method of [<code>CbExpressApp</code>](#module_cbexpressapp..CbExpressApp)  
<a name="module_cbexpressapp..CbExpressApp+setAppLog..outputavert"></a>

##### setAppLog~outputavert
Remove console log in production mode

**Kind**: inner property of [<code>setAppLog</code>](#module_cbexpressapp..CbExpressApp+setAppLog)  
<a name="module_cbexpressapp..CbExpressApp+pollSecret"></a>

#### cbExpressApp.pollSecret()
Refresh AES encrypt key every 2 hour

**Kind**: instance method of [<code>CbExpressApp</code>](#module_cbexpressapp..CbExpressApp)  
<a name="module_cbexpressapp..miexpressapp"></a>

### cbexpressapp~miexpressapp
Main launcher for Express App

**Kind**: inner constant of [<code>cbexpressapp</code>](#module_cbexpressapp)  
