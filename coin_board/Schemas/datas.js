const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/test3');

/** Return lowercase for url fields
 * @param {String} a the string to be converted
 * @return {String} the a param in lowercase
 */
function toLower(a) {
    return a.toLowerCase();
}

const InfosSchema = new mongoose.Schema({
    url: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        set: toLower,
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

const PricesSchema = new mongoose.Schemas({
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

const TrendSchema = new mongoose.Schemas({
    Type: {
        type: String,
        enum: ['bullish', 'bearish'],
        required: true,
    },
    Coef: {
        type: Number,
        min: [0, 'Coef: Value not in [0-10] range'],
        max: [10, 'Coef: Value not in [0-10] range'],
    },
});

const SourcesSchema = new mongoose.Schemas({
    url: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        set: toLower,
    },
});

const DatasSchemas = new mongoose.Schemas({
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

let Prices = mongoose.model('Prices', PricesSchema);
let Infos = mongoose.model('Infos', InfosSchema);
let Sources = mongoose.model('Sources', SourcesSchema);
let Datas = mongoose.model('Datas', DatasSchemas);

module.exports = Datas;
