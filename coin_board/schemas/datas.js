/**
 * @file Mongoose {@link Datas} Schema definitions
 * @author based on whatever its take to suceed boilerplate by Trevis Gulby
 */

const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/test3');

/** Base 'crawling feeds' organisation
 * @constructor
 * @memberof module:models~
 * @property {String} url the original source url
 * @property {function} url.set the default setter to put url to lowercase
 * @property {String} title the Info title
 * @property {String} content the Info content
 * @property {String} tags a string of tag separed by ';' symbol
 * @property {Object} Date the Info gathering date
 */
const InfosSchema = new mongoose.Schema({
    url: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        set: function(a) {
            return a.toLowerCase();
        },
    },
    title: {
        type: String,
        unique: true,
        required: true,
        trim: true,
    },
    content: {
        type: String,
        unique: true,
        required: true,
        trim: false,
    },
    tags: {
        type: String,
        required: true,
        trim: true,
    },
    Date: {
        type: Date,
        default: Date.now,
    },
});

/** Clean ordering , easy math !
 * @constructor
 * @memberof module:models~
 * @property {String} fsym the first symbol of the traded pair
 * @property {String} tsym the second symbol
 * @property {String} type Is the gathered price a type.enum type ?
 * @property {Array} type.enum the Price attributes
 * @property {String} tags a string of tag separed by ';' symbol
 * @property {Object} Date the Price gathering date or if histo, the timestamp
 */
const PricesSchema = new mongoose.Schema({
    fsym: {
        type: String,
        required: true,
        trim: true,
    },
    tsym: {
        type: String,
        required: true,
        trim: true,
    },
    type: {
        type: String,
        enum: [
            'histoday',
            'histohour',
            'histominute',
            'dayAvg',
        ],
    },
    Date: {
        type: Date,
        default: Date.now,
    },
});

/** A way to data mining !
 * @constructor
 * @memberof module:models~
 * @property {String} Type the Trend type
 * @property {Array} Type.enum bullish or bearish
 * @property {Number} Coef how bullish / bearish it is ?
 * @property {Number} Coef.type Coef is float
 * @property {Array} Coef.min the 0 min value and the error message
 * @property {Array} Coef.max the 10 max value and the error message
 */
const TrendSchema = new mongoose.Schema({
    Type: {
        type: String,
        enum: ['bullish', 'bearish'],
        required: true,
    },
    Coef: {
        type: Number,
        min: [0, 'Coef: Value not in [0-10] range'],
        max: [10, 'Coef: Value not in [0-10] range'],
        required: true,
    },
});

/** The gathering sources models, regexes for parsing etc
 * @constructor
 * @memberof module:models~
 * @property {String} url the 'to scrap' url
 * @property {function} url.set the setter for url (WIP)
 */
const SourcesSchema = new mongoose.Schema({
    url: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        set: (a) => {
            return a.toLowerCase();
        },
    },
});

/** Yeah I know this now seems more logical
 * to do a Bank {info, prices} rather than a info[Bank, ...] but hey still wip!
 * @constructor
 * @memberof module:models~
 * @property {Object} Infos the textual in datas ordered by their main subject
 * ( see {@link module:models~InfosSchema} )
 * @property {Array} Infos.Bank the fiat datas
 * @property {Array} Infos.Crypto the crypto datas
 * @property {Array} Infos.Markets the stock Markets datas
 * @property {Object} Prices the price datas
 * ( see {@link module:models~PricesSchema} )
 * @property {Array} Prices.Bank the fiat prices
 * @property {Array} Prices.Crypto the crypto prices
 * @property {Array} Prices.Markets the stock Markets prices
 * @property {Object} Trends Trend overview object
 * ( see {@link module:models~TrendSchema} )
 * @property {Array} Trends.Bank the fiat trends
 * @property {Array} Trends.Crypto the crypto trends
 * @property {Array} Trends.Markets the stock Markets trends
 * @property {Object} Sources The different methods and urls for each sources
 * ( see {@link module:models~SourcesSchema} )
 * @property {Array} Sources.Bank the bank/fiat sources
 * @property {Array} Sources.Crypto the crypto sources
 * @property {Array} Sources.Markets the stock Markets sources
 */
const DatasSchema = new mongoose.Schema({
    Infos: {
        Bank: [InfosSchema],
        Crypto: [InfosSchema],
        Markets: [InfosSchema],
    },
    Prices: {
        Bank: [PricesSchema],
        Crypto: [PricesSchema],
        Markets: [PricesSchema],
    },
    Trends: {
        Bank: [TrendSchema],
        Crypto: [TrendSchema],
        Markets: [TrendSchema],
    },
    Sources: {
        Bank: [SourcesSchema],
        Crypto: [SourcesSchema],
        Markets: [SourcesSchema],
    },
});

/** Getters for schemas => tojson */
InfosSchema.set('toJSON', {getters: true, virtuals: false});
/** hashing a password before saving it to the database */
InfosSchema.pre('save', function(next) {
    next();
});

DatasSchema.statics.addinfos = function(datasubject, dataarray, callback) {
    Infos.create(dataarray, (error, info) => {
        if (error) {
            throw error;
        } else {
            return info;
        }
    });
};

DatasSchema.statics.addprices = function(datasubject, dataarray, callback) {
    Prices.create(dataarray, (error, price) => {
        if (error) {
            throw error;
        } else {
            return price;
        }
    });
};

DatasSchema.statics.addsources = function(datasubject, dataarray, callback) {
    Sources.create(dataarray, (error, source) => {
        if (error) {
            throw error;
        } else {
            return source;
        }
    });
};

DatasSchema.statics.addtrends = function(datasubject, dataarray, callback) {
    Trends.create(dataarray, (error, trend) => {
        if (error) {
            throw error;
        } else {
            return trend;
        }
    });
};


let Prices = mongoose.model('Prices', PricesSchema);
let Infos = mongoose.model('Infos', InfosSchema);
let Sources = mongoose.model('Sources', SourcesSchema);
let Trends = mongoose.model('Trends', TrendSchema);
let Datas = mongoose.model('Datas', DatasSchema);

module.exports = Datas;
