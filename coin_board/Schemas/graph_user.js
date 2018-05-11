/**
 * @file Mongoose {@link User} Schema definitions
 * @author based on whatever its take to suceed boilerplate by Trevis Gulby
 */

/** @module models */
let makeExecutableSchema = require('graphql-tools').makeExecutableSchema;

/** The saved user balances per asset object
 * @constructor
 * @property {String} name the asset full name
 * @property {String} ticker the asset ticker/symbol
 * @property {Float} qtt the asset qtt
 */
const AssetsSchema = `
    type Asset {
        name: String!
        ticker: String!
        qtt: Number!
    }
`;

/** The user api's model
 * @constructor
 * @property {String} name The new Api name like n26, coinbase ...
 * @property {String} key The user api key
 * @property {String} secret The user api secret (hashed)
 */
const ApiSchema = `
type Api {
        name: String!
        key: String!
        secret: String!
}
type Apiinput {
        name: String!
        key: String!
        secret: String!
}
type Query {
        apis(limit: Int): [Api]
        apis(name: String!): Api
}

type Mutation {
        addapis(api: Apiinput!): Api
}
`;
/** A tipical coin_board user
 * @constructor
 * @property {String} email the user email
 * @property {String} username the user username
 * @property {String} usercurrency the user default fiat or crypto currency
 * @property {String} ethaddr WIP around decentralisation and smart contracts
 * @property {String} telegramid user telegram id for bot access when registered
 * @property {String} password user password
 * @property {Array} Apis see {@link module:models~ApiSchema}
 * @property {Array} Assets see {@link module:models~AssetsSchema}
 * @property {Object} Date the user creation timestamp
 */
const UserSchema = `
type User {
        id: String!
        email: String
        username: String!
        usercurrency: String
        ethaddr: String
        telegramid: String
        password: String!
}

type Userinput {
        email: String
        username: String!
        usercurrency: String
        ethaddr: String
        telegramid: String
        password: String!
}

type Query {
       users(limit: Int): [User]
       user(name: String!): User
}

type Mutation {
       addUser(user: Userinput!): User
}
`;

let addUser = (obj, args, context, info) => {
    return {
        id: args.id,
    };
};

let getUser = (obj, args, context, info) => {
    return {
        name: args.name,
    };
};

let resolvers = {
    Query: {
        users: getUser,
    },
    Mutation: {
        addUser: addUser,
    },
};

module.exports = makeExecutableSchema({
    typeDefs: UserSchema,
    resolvers: resolvers,
});
