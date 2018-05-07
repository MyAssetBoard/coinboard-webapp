const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/test3');
const bcrypt = require('bcrypt');

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
    },
});

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
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
            bcrypt.hash(user.telegramid, 10, function(err, hash) {
                user.telegramid = hash;
                next();
            });
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

UserSchema.statics.getappis = function(id, callback) {
    User.findOne({_id: id}, (error, user) => {
        if (user.Apis.length()) {
            return callback && callback(user.Apis);
        } else {
            return callback && callback(error ? error : user ? user : error);
        }
    });
};

let Apis = mongoose.model('Apis', ApiSchema);
let User = mongoose.model('User', UserSchema);

module.exports = User;
