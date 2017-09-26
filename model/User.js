const bookshelf = require('./bookshelf');

class UserModel extends bookshelf.Model {
    get tableName() {
        return 'users';
    }
}

class PasswordResetModel extends bookshelf.Model {
    get tableName() {
        return 'password_reset';
    }

    get user() {
        return this.belongsTo(UserModel, 'user_id');
    }
}

module.exports = { UserModel, PasswordResetModel };