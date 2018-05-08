const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
mongoose.connect('mongodb://localhost:27017/test3');

/** Return lowercase for email fields
 * @param {String} a the string to be converted
 * @return {String} the a param in lowercase
 */
function toLower(a) {
    return a.toLowerCase();
}

/** Return float value for assets.qtt field
 * @param {String} a the string to be converted
 * @return {String} the a float value
 */
function toFloat(a) {
    return parseFloat(a);
}

const AssetsSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    ticker: {
        type: String,
        required: true,
        trim: true,
    },
    qtt: {
        type: Number,
        required: true,
        set: toFloat,
    },
});

const ApiSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    key: {
        type: String,
        required: true,
    },
    secret: {
        type: String,
        required: true,
        trim: true,
    },
});

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        set: toLower,
    },
    username: {
        type: String,
        unique: true,
        required: true,
        trim: true,
    },
    usercurrency: {
        type: String,
        required: true,
        trim: true,
    },
    ethaddr: {
        type: String,
        unique: false,
        required: false,
        trim: false,
    },
    telegramid: {
        type: String,
        required: false,
    },
    password: {
        type: String,
        required: true,
    },
    Apis: {
        Bank: [ApiSchema],
        Crypto: [ApiSchema],
        Markets: [ApiSchema],
    },
    Assets: {
        Bank: [AssetsSchema],
        Crypto: [AssetsSchema],
        Markets: [AssetsSchema],
    },
    Date: {
        type: Date,
        default: Date.now,
    },
});
/** Getters for schemas => tojson */
UserSchema.set('toJSON', {getters: true, virtuals: false});
/** hashing a password before saving it to the database */
UserSchema.pre('save', function(next) {
    let user = this;
    bcrypt.hash(user.password, 10, function(err, hash) {
        if (err) {
            return next(err);
        } else {
            user.password = hash;
            return next();
        }
    });
});
/** Hash api secret too */
ApiSchema.pre('save', function(next) {
    let api = this;
    bcrypt.hash(api.secret, 10, function(err, hash) {
        api.secret = hash;
        next();
    });
});

UserSchema.statics.authenticate = function(username, password, callback) {
    User.findOne({username: username})
        .exec(function(err, user) {
            if (err) {
                return callback(err);
            } else if (!user) {
                let err = new Error('User not found.');
                err.status = 401;
                return callback(err);
            }
            bcrypt.compare(password, user.password, function(err, result) {
                if (result === true) {
                    return callback(null, user);
                } else {
                    return callback();
                }
            });
        });
};

UserSchema.statics.addapi = function(id,
    apitype, apiid, apikey, apisecret, callback) {
    let newapi = {
        name: apiid,
        key: apikey,
        secret: apisecret,
    };
    Apis.create(newapi, (error, api) => {
        let elemtype = {};
        elemtype['Apis.' + apitype] = api;
        User.findOneAndUpdate({_id: id}, {$push: elemtype},
            (error, success) => {
                if (error) {
                    console.log(error);
                    callback && callback(error);
                } else {
                    console.log(success);
                    callback && callback(null, success);
                }
            });
    });
};

UserSchema.statics.addasset = function(id,
    assettype, assetid, assetticker, assetqtt, callback) {
    let newasset = {
        name: assetid,
        ticker: assetticker,
        qtt: assetqtt,
    };
    Assets.create(newasset, (error, asset) => {
        let elemtype = {};
        elemtype['Assets.' + assettype] = asset;
        User.findOneAndUpdate({_id: id}, {$push: elemtype},
            (error, success) => {
                if (error) {
                    console.log(error);
                    callback && callback(error);
                } else {
                    console.log(success);
                    callback && callback(null, success);
                }
            });
    });
};

let Assets = mongoose.model('Assets', AssetsSchema);
let User = mongoose.model('User', UserSchema);
let Apis = mongoose.model('Apis', ApiSchema);

module.exports = User;
