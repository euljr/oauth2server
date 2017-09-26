const bookshelf = require('./bookshelf');
const { UserModel } = require('./User');

class OAuthAccessTokenModel extends bookshelf.Model {
    get tableName() {
        return 'oauth_access_tokens';
    }
    user() {
        return this.belongsTo(UserModel, 'user_id');
    }
    client() {
        return this.belongsTo(OAuthClientModel, 'client_id');
    }
}

class OAuthClientModel extends bookshelf.Model {
    get tableName() {
        return 'oauth_clients';
    }
    user() {
        return this.belongsTo(UserModel, 'user_id');
    }
}

class OAuthAuthorizationCodeModel extends bookshelf.Model {
    get tableName() {
        return 'oauth_authorization_codes';
    }
    user() {
        return this.belongsTo(UserModel, 'user_id');
    }
    client() {
        return this.belongsTo(OAuthClientModel, 'user_id');
    }
}

class OAuthRefreshTokenModel extends bookshelf.Model {
    get tableName() {
        return 'oauth_refresh_tokens';
    }
    user() {
        return this.belongsTo(UserModel, 'user_id');
    }
    client() {
        return this.belongsTo(OAuthClientModel, 'client_id');
    }
}

class OAuthScopeModel extends bookshelf.Model {
    get tableName() {
        return 'oauth_scopes';
    }
}

module.exports = {
    OAuthAccessTokenModel,
    OAuthClientModel,
    OAuthAuthorizationCodeModel,
    OAuthRefreshTokenModel,
    OAuthScopeModel
}