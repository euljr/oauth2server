const bookshelf = require('../model/bookshelf');

const User = bookshelf.Model.extend({
    tableName: 'users'
});

const OAuthAccessToken = bookshelf.Model.extend({
    tableName: 'oauth_access_tokens',
    user: function () {
        return this.belongsTo(User, 'user_id');
    },
    client: function () {
        return this.belongsTo(OAuthClient, 'client_id');
    }
});

const OAuthClient = bookshelf.Model.extend({
    tableName: 'oauth_clients',
    user: function () {
        return this.belongsTo(User, 'user_id');
    }
});

const OAuthAuthorizationCode = bookshelf.Model.extend({
    tableName: 'oauth_authorization_codes',
    client: function () {
        return this.belongsTo(OAuthClient, 'user_id');
    },
    user: function () {
        return this.belongsTo(User, 'user_id');
    }
});

const OAuthRefreshToken = bookshelf.Model.extend({
    tableName: 'oauth_refresh_tokens',
    client: function () {
        return this.belongsTo(OAuthClient, 'client_id');
    },
    user: function () {
        return this.belongsTo(User, 'user_id');
    }
});

const OAuthScope = bookshelf.Model.extend({
    tableName: 'oauth_scopes'
});

module.exports = {
    User,
    OAuthAccessToken,
    OAuthClient, 
    OAuthAuthorizationCode,
    OAuthRefreshToken,
    OAuthScope
}