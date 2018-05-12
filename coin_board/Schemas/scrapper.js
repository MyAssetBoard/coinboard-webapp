/**
 * @file Mongoose {@link scrapper} Schema definitions
 * @author based on whatever its take to suceed boilerplate by Trevis Gulby
 */

const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/test3');


/** The request model
 * @constructor
 * @property
 */
const RequestSchemas = new mongoose.Schema({
    host: {
        type: String,
        required: true,
        trim: true,
    },
    path: {
        type: String,
        required: true,
        trim: true,
    },
});

const SourcesSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    url: {
        type: String,
        required: true,
        trim: true,
    },
    req: {
        type: RequestSchemas,
    },
});
/** A req source schemas */
const ScrapperSchemas = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    Sources: {
        Bank: {
            infos: [SourcesSchema],
            prices: [SourcesSchema],
        },
        Crypto: {
            infos: [SourcesSchema],
            prices: [SourcesSchema],
        },
        Markets: {
            infos: [SourcesSchema],
            prices: [SourcesSchema],
        },
    },
    Date: {
        type: Date,
        default: Date.now,
    },
});

ScrapperSchemas.statics.addsource = (uinput, callback) => {
    let newreq = {};
    let newsource = {};
    newreq['host'] = uinput.sourcereqhost;
    newreq['path'] = uinput.sourcereqpath;
    newsource['name'] = uinput.sourcename;
    newsource['url'] = uinput.sourceurl;
    console.log(newreq);
    Requests.create(newreq, (error, request) => {
        newsource['req'] = request;
        console.log('new request');
        console.log(request);
        if (error) throw error;
        Sources.create(newsource, (error, source) => {
            let elemtype = {};
            let pos = 'Sources.' + uinput.sourcegenre + '.' + uinput.sourcetype;
            elemtype[pos] = source;
            console.log('newsource');
            console.log(source);
            if (error) throw error;
            Scrapper.findOneAndUpdate({
                    _id: uinput.scrapperid,
                }, {
                    $push: elemtype,
                },
                (error, success) => {
                    if (error) {
                        console.log(error);
                        callback && callback(error);
                    } else {
                        callback && callback(null, success);
                    }
                });
        });
    });
};

let Sources = mongoose.model('Sources', SourcesSchema);
let Requests = mongoose.model('Requests', RequestSchemas);
let Scrapper = mongoose.model('Scrapper', ScrapperSchemas);

module.exports = Scrapper;
