/**
 * @file  personnal telegram client
 * @TODO implement an html view and js controllers to have
 * an inpage telegram chat element
 * @author based on Some github sample and edited by Trevis Gulby
 * @license MIT
 */

/** ### Coin_Board Telegram client methods
 * @module cbtelegramchatclient
 */

/** Private credentials json format import */
const creds = process.env.RUN_MODE == 'priv' ? require('../../creds') :
    require('../../dev_creds');
/** Telegram client main component import */
const {
    MTProto
} = require('telegram-mtproto')
/** @TODO -> add mongo connector */
const {
    Storage
} = require('mtproto-storage-fs')
const readline = require('readline')

/** The api_id and api_hash values can be obtained
 * here {@link https://my.telegram.org/}
 */
const config = {
    "phone_number": creds.TelegramClient.PHONE_NBR,
    "api_id": creds.TelegramClient.API_ID,
    "api_hash": creds.TelegramClient.API_HASH
}

const app = {
    storage: new Storage('./storage.json')
}

const phone = {
    num: config.phone_number
}

const api = {
    layer: 57,
    initConnection: 0x69796de9,
    api_id: config.api_id
}

const server = {
    dev: false
}

const client = MTProto({
    server,
    api,
    app
})

/** This function will stop execution of the program until you enter the code
 * that is sent via SMS or Telegram.
 */
const askForCode = () => {
    return new Promise((resolve) => {
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        })

        rl.question('Please enter passcode for ' + phone.num + ':\n', (num) => {
            rl.close()
            resolve(num)
        })
    })
}

/** First you will receive a code via SMS or Telegram, which you have to enter
 * directly in the command line. If you entered the correct code, you will be
 * logged in and the credentials are saved.
 */
const login = async (client, phone) => {
    const {
        phone_code_hash
    } = await client('auth.sendCode', {
        phone_number: phone.num,
        current_number: false,
        api_id: config.api_id,
        api_hash: config.api_hash
    })

    const phone_code = await askForCode()
    console.log(`Your code: ${phone_code}`)

    const {
        user
    } = await client('auth.signIn', {
        phone_number: phone.num,
        phone_code_hash: phone_code_hash,
        phone_code: phone_code
    })

    console.log('signed as ', user)
}

const getDialogs = async () => {
    const dialogs = await client('messages.getDialogs', {
        limit: 100,
    })
    console.log('dialogs', dialogs)
}

/** First check if we are already signed in (if credentials are stored).
 * If we are logged in, execution continues, otherwise the login process begins.
 */
(async function () {
    if (!(await app.storage.get('signedin'))) {
        console.log('not signed in')

        await login(client, phone).catch(console.error)

        console.log('signed in successfully')
        app.storage.set('signedin', true)
    } else {
        console.log('already signed in')
    }
    getDialogs()
})()