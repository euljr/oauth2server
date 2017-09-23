const {
    User,
    OAuthAccessToken,
    OAuthClient,
    OAuthAuthorizationCode,
    OAuthRefreshToken,
    OAuthScope
} = require('./repository');

module.exports = {
    // generateAccessToken: (client, user, scope) => { },
    // generateRefreshToken: (client, user, scope) => { },
    // generateAuthorizationCode: (client, user, scope) => { },
    getAccessToken: access_token => {
        return OAuthAccessToken
            .where({ access_token })
            .fetch({ withRelated: ['client', 'user'] })
            .then(token => {
                if (!token)
                    return false;
                return {
                    accessToken: token.attributes.access_token,
                    accessTokenExpiresAt: new Date(token.attributes.expires),
                    scope: token.attributes.scope, // to-do
                    client: token.relations.client,
                    user: token.relations.user
                }
            });
    },
    getRefreshToken: refreshToken => {
        return OAuthRefreshToken
            .where({refresh_token: refreshToken})
            .fetch({ withRelated: ['client', 'user'] })
            .fetch()
            .then(token => {
                return {
                    refreshToken: token.attributes.refresh_token,
                    refreshTokenExpiresAt: new Date(token.attributes.expires),
                    scope: token.attributes.scope,
                    client: token.relations.client,
                    user: token.relations.user
                }
            });
    },
    getAuthorizationCode: authorization_code => {
        return OAuthAuthorizationCode
            .where({ authorization_code })
            .fetch({ withRelated: ['client', 'user'] })
            .fetch()
            .then(authCode => {
                if (!authCode)
                    return false;
                return {
                    code: authorization_code,
                    client: authCode.relations.client,
                    expiresAt: new Date(authCode.attributes.expires),
                    redirectUri: authCode.relations.client.redirect_uri,
                    user: authCode.relations.user,
                    scope: authCode.attributes.scope
                };
            });
    },
    getClient: (client_id, client_secret) => {
        let where = { client_id };
        if (client_secret)
            where.client_secret = client_secret;
        return OAuthClient
            .where(where)
            .fetch()
            .then(client => {
                if (!client)
                    return false;
                return {
                    id: client.attributes.id,
                    redirectUris: [client.attributes.redirect_uri],
                    grants: ['password'] // to-do
                }
            });
    },
    getUser: (username, password) => {
        return User
            .where({ username, password })
            .fetch()
            .then(user => user.attributes);
    },
    getUserFromClient: ({ client_id }) => {
        return OAuthClient
            .where({ client_id })
            .fetch({ withRelated: ['user'] })
            .then(client => {
                if (!client || !client.relations.user)
                    return false;
                return client.relations.user;
            });
    },
    saveToken: (token, client, user) => {
        let toAdd = [new OAuthAccessToken({
            access_token: token.accessToken,
            expires: token.accessTokenExpiresAt,
            client_id: client.id,
            user_id: user.id,
            scope: token.scope
        })];
        if (token.refreshToken) {
            toAdd.push(new OAuthRefreshToken({
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
        return new OAuthAuthorizationCode({
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
        return OAuthRefreshToken
            .where({ refresh_token: refreshToken })
            .destroy()
            .then(() => true)
            .catch(() => false);
    },
    revokeAuthorizationCode: ({ authorizationCode }) => {
        return OAuthAuthorizationCode
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