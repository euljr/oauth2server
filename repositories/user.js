const { UserModel, PasswordResetModel } = require('../model/User');
const bcrypt = require('bcrypt');
const jwt = require('jwt-simple');
const crypto = require('crypto');
const error = require('../lib/error');

class UserRepository {
    static requestPasswordReset({ email }) {
        return UserModel
            .where({ email })
            .fetch()
            .then(user => {
                if (!user)
                    throw new error.UserNotFoundError();
                return PasswordResetModel.where({ user_id: user.attributes.id })
                    .fetch()
                    .then(res => {
                        let expires = new Date();
                        expires.setDate(expires.getDate() + 1);
                        let secret = crypto.randomBytes(64).toString('hex');
                        let token = jwt.encode({
                            user_id: user.attributes.id
                        }, secret);
                        let data = {
                            secret,
                            expires,
                            token,
                            user_id: user.attributes.id
                        };
                        if (res)
                            data['id'] = res.attributes.id;
                        return new PasswordResetModel(data).save();
                    });
            })
            .then(token => {
                let data = token.toJSON();
                delete data.id;
                delete data.secret;
                delete data.user_id;
                return data;
            });
    }

    static resetPassword({ token, newPassword }) {
        return PasswordResetModel
            .where({ token })
            .fetch()
            .then(resetToken => {
                if (!resetToken)
                    throw new error.TokenNotFoundError();
                if (new Date(resetToken.attributes.expires).getTime() < new Date().getTime())
                    throw new error.TokenExpiredError();
                let data = jwt.decode(token, resetToken.attributes.secret);
                return bcrypt.hash(newPassword, 10)
                    .then(hash => new UserModel({ id: data.user_id, password: hash }).save())
            });
    }

    static signup({ username, email, password, fullname }) {
        return UserModel
            .query({
                where: { email },
                orWhere: { username }
            })
            .fetch()
            .then(user => {
                if (user && user.attributes.username == username)
                    throw new error.UsernameNotAvailableError();
                if (user && user.attributes.email == email)
                    throw new error.EmailNotAvailableError();

            })
            .then(() => bcrypt.hash(password, 10))
            .then(hash => new UserModel({
                username,
                password: hash,
                email,
                fullname
            }).save());
    }
}

module.exports = UserRepository;