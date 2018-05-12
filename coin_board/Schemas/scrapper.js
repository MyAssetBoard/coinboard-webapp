/**
 * @file Mongoose {@link scrapper} Schema definitions
 * @author based on whatever its take to suceed boilerplate by Trevis Gulby
 */

const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/test3');

/** The request model (to get rss feeds)
 * @constructor
 * @memberof module:models~
 * @property {String} host in fact its for now the yahoo api for rss to json
 * @property {String} path the path like /param=tto&otherparam=tonton
 * @property {Number} __v the mongoose version system
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
    __v: {
        type: Number,
        select: false,
    },
    _id: false,
});

/** The parsing model (to remove html markup and other garbage from feeds)
 * @constructor
 * @memberof module:models~
 * @property {String} regex the user submited regex for cleaning content
 */
const ParsingSchemas = new mongoose.Schema({
    regex: {
        type: String,
        required: true,
    },
    __v: {
        type: Number,
        select: false,
    },
    _id: false,
});

/** The scrapper sources schemas
 * @constructor
 * @memberof module:models~
 * @property {String} name the name of the feed like cointelegraph, cryptonews..
 * @property {String} url the feed url (must be linked with req.path)
 * @property {Object} req the req model to call rss > json yahoo api
 * @property {Object} parse the regex for cleaning feed
 * @property {Number} __v the mongoose version system
 */
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
        required: true,
    },
    parse: {
        type: ParsingSchemas,
        required: false,
    },
    __v: {
        type: Number,
        select: false,
    },
});

/** The Scrapper schemas
 * @constructor
 * @memberof module:models~
 */
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

/** Add a new Source object to a Scrapper
 * @param {Object} uinput the user inputs and param see below
 * @param {String} uinput.scrapperid the user scrapper to update
 * @param {String} uinput.sourcegenre from enum ['Bank', 'Crypto', 'Markets']
 * @param {String} uinput.sourcetype the source type (is feed, price or other ?)
 * @param {String} uinput.sourcename the source name
 * @param {String} uinput.sourceurl the source url
 * @param {String} uinput.sourcereqhost the source https base req host
 * @param {String} uinput.sourcereqpath the source https base req path
 * @param {function} callback to get the result data or error
 * @todo format insertion format before calling this function
 * @memberof module:models~ScrapperSchemas
 */
ScrapperSchemas.statics.addsource = (uinput, callback) => {
    let Sources = mongoose.model('Sources', SourcesSchema);
    let whatsource = 'Sources.' + uinput.sourcegenre + '.' + uinput.sourcetype;
    let newsource = {
        name: uinput.sourcename,
        url: uinput.sourceurl,
        req: {
            host: uinput.sourcereqhost,
            path: uinput.sourcereqpath,
        },
        parse: {
            regex: uinput.sourceregex,
        },
    };
    Sources.create(newsource, (error, source) => {
        let elemtype = {};
        elemtype[whatsource] = source;
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
};

/** Getters for schemas => tojson */
ScrapperSchemas.set('toJSON', {getters: true, virtuals: false});
/** Getters for schemas => tojson */
SourcesSchema.set('toJSON', {getters: true, virtuals: false});
/** Getters for schemas => tojson */
RequestSchemas.set('toJSON', {getters: true, virtuals: false});

let Scrapper = mongoose.model('Scrapper', ScrapperSchemas);

module.exports = Scrapper;
