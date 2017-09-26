const {
    OAuthAccessTokenModel,
    OAuthClientModel,
    OAuthAuthorizationCodeModel,
    OAuthRefreshTokenModel,
    OAuthScopeModel
} = require('../model/OAuth');
const bcrypt = require('bcrypt');

const { UserModel } = require('../model/User');

module.exports = {
    // generateAccessToken: (client, user, scope) => { },
    // generateRefreshToken: (client, user, scope) => { },
    // generateAuthorizationCode: (client, user, scope) => { },
    getAccessToken: access_token => {
        return OAuthAccessTokenModel
            .where({ access_token })
            .fetch({ withRelated: ['client', 'user'] })
            .then(token => {
                if (!token)
                    return false;
                return {
                    accessToken: token.attributes.access_token,
                    accessTokenExpiresAt: new Date(token.attributes.expires),
                    scope: token.attributes.scope, // to-do
                    client: token.relations.client.toJSON(),
                    user: token.relations.user.toJSON()
                }
            });
    },
    getRefreshToken: refreshToken => {
        return OAuthRefreshTokenModel
            .where({ refresh_token: refreshToken })
            .fetch({ withRelated: ['client', 'user'] })
            .fetch()
            .then(token => {
                return {
                    refreshToken: token.attributes.refresh_token,
                    refreshTokenExpiresAt: new Date(token.attributes.expires),
                    scope: token.attributes.scope,
                    client: token.relations.client.toJSON(),
                    user: token.relations.user.toJSON()
                }
            });
    },
    getAuthorizationCode: authorization_code => {
        return OAuthAuthorizationCodeModel
            .where({ authorization_code })
            .fetch({ withRelated: ['client', 'user'] })
            .fetch()
            .then(authCode => {
                if (!authCode)
                    return false;
                return {
                    code: authorization_code,
                    client: authCode.relations.client.toJSON(),
                    expiresAt: new Date(authCode.attributes.expires),
                    redirectUri: authCode.relations.client.toJSON().redirect_uri,
                    user: authCode.relations.user.toJSON(),
                    scope: authCode.attributes.scope.toJSON()
                };
            });
    },
    getClient: (client_id, client_secret) => {
        let where = { client_id };
        if (client_secret)
            where.client_secret = client_secret;
        return OAuthClientModel
            .where(where)
            .fetch()
            .then(client => {
                if (!client)
                    return false;
                return {
                    id: client.attributes.id,
                    redirectUris: [client.attributes.redirect_uri],
                    grants: ['password', 'email']
                }
            });
    },
    getUser: (username, password) => {
        return UserModel
            .where({ username })
            .fetch()
            .then(user => user ?
                bcrypt.compare(password, user.attributes.password)
                    .then(res => res ? user.attributes : false) : false
            );
    },
    getUserByEmail: (email, password) => {
        return UserModel
            .where({ email })
            .fetch()
            .then(user => user ?
                bcrypt.compare(password, user.attributes.password)
                    .then(res => res ? user.attributes : false) : false
            );
    },
    getUserFromClient: ({ client_id }) => {
        return OAuthClientModel
            .where({ client_id })
            .fetch({ withRelated: ['user'] })
            .then(client => {
                if (!client || !client.relations.user)
                    return false;
                return client.relations.user.toJSON();
            });
    },
    saveToken: (token, client, user) => {
        let toAdd = [new OAuthAccessTokenModel({
            access_token: token.accessToken,
            expires: token.accessTokenExpiresAt,
            client_id: client.id,
            user_id: user.id,
            scope: token.scope
        })];
        if (token.refreshToken) {
            toAdd.push(new OAuthRefreshTokenModel({
                refresh_token: token.refreshToken,
                expires: token.refreshTokenExpiresAt,
                client_id: client.id,
                user_id: user.id,
                scope: token.scope
            }));
        }
        return Promise.all(toAdd.map(item => item.save()))
            .then(([at, et]) => ({
                accessToken: at.attributes.access_token,
                accessTokenExpiresAt: new Date(at.attributes.expires),
                refreshToken: et.attributes.refresh_token,
                refreshTokenExpiresAt: new Date(et.attributes.expires),
                scope: [],//to-do
                client: at.attributes.client_id,
                user
            }));
    },
    saveAuthorizationCode: (code, client, user) => {
        return new OAuthAuthorizationCodeModel({
            expires: code.expiresAt,
            client_id: client.id,
            authorization_code: code.authorizationCode,
            user_id: user.id,
            scope: code.scope
        }).save().then(() => ({
            code: code.authorizationCode
        }));
    },
    revokeToken: ({ refreshToken }) => {
        return OAuthRefreshTokenModel
            .where({ refresh_token: refreshToken })
            .destroy()
            .then(() => true)
            .catch(() => false);
    },
    revokeAuthorizationCode: ({ authorizationCode }) => {
        return OAuthAuthorizationCodeModel
            .where({ authorization_code: authorizationCode })
            .destroy()
            .then(() => true)
            .catch(() => false);
    },
    validateScope: (user, client, scope) => {
        return true; // to-do
    },
    verifyScope: (token, scope) => {
        if (!token.scope)
            return false;
        let requestedScopes = scope.split(' ');
        let authorizedScopes = token.scope.split(' ');
        return requestedScopes.every(s => authorizedScopes.indexOf(s) >= 0);
    }
}