/**
 * @file GraphQl setters/ getter and db class definitions, {@link GraphUser}
 * @author based on whatever its take to suceed boilerplate by Trevis Gulby
 */

const graphql = require('graphql');

/** Still WIP work, this const will be replace by mongodb results
 * when @GraphQlAPI will be working
 */
const MOCKAPIS = [{
        name: 'n26',
        key: 'thisithekey',
        secret: 'thisisthesecret',
    },
    {
        name: 'etoro',
        key: 'thisithekey',
        secret: 'thisisthesecret',
    },
];

const MOCKASSET = [{
    name: 'Euro',
    ticker: 'EUR',
    qtt: 33.33,
}, {
    name: 'Ethereum',
    ticker: 'ETH',
    qtt: 42.42,
}];

const MOCKUSERS = [{
        email: 'foobi@foobar.dev',
        username: 'foobar',
        usercurrency: 'EUR',
        ethaddr: 'NONE',
        telegramid: '12345',
        password: 'toto',
        Apis: MOCKAPIS,
        Assets: MOCKASSET,
    },
    {
        email: 'foobar@foobi.dev',
        username: 'foobi',
        usercurrency: 'EUR',
        ethaddr: 'NONE',
        telegramid: '12345',
        password: 'tutu',
        Apis: MOCKAPIS,
        Assets: MOCKASSET,
    },
];

const MockApisType = new graphql.GraphQLObjectType({
    name: 'userapis',
    fields: function () {
        return {
            name: {
                type: graphql.GraphQLString,
            },
            key: {
                type: graphql.GraphQLString,
            },
            secret: {
                type: graphql.GraphQLString,
            },
        };
    },
});

const MockAssetType = new graphql.GraphQLObjectType({
    name: 'userasset',
    fields: function () {
        return {
            name: {
                type: graphql.GraphQLString,
            },
            ticker: {
                type: graphql.GraphQLString,
            },
            qtt: {
                type: graphql.GraphQLString,
            },
        };
    },
});

const MockUserType = new graphql.GraphQLObjectType({
    name: 'users',
    fields: function () {
        return {
            username: {
                type: graphql.GraphQLString,
            },
            email: {
                type: graphql.GraphQLString,
            },
            usercurrency: {
                type: graphql.GraphQLString,
            },
            ethaddr: {
                type: graphql.GraphQLString,
            },
            telegramid: {
                type: graphql.GraphQLString,
            },
            password: {
                type: graphql.GraphQLString,
            },
            Apis: {
                type: MockApisType,
            },
            Assets: {
                type: MockAssetType,
            },
        };
    },
});

const UserQueryType = new graphql.GraphQLObjectType({
    name: 'Query',
    fields: () => {
        return {
            users: {
                type: new graphql.GraphQLList(MockUserType),
                resolve: () => {
                    // INsert Mongoose results
                    return MOCKUSERS;
                },
            },
        };
    },
});

module.exports = new graphql.GraphQLSchema({
    query: UserQueryType,
});
