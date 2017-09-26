const UserRepository = require('../repositories/user');

class UserController {
    static requestPasswordReset(req, res, next) {
        UserRepository
            .requestPasswordReset(req.query)
            .then(res.success)
            .catch(next);
    }

    static resetPassword(req, res, next) {
        UserRepository
            .resetPassword(req.body)
            .then(res.success)
            .catch(next);
    }

    static signup(req, res, next) {
        UserRepository
            .signup(req.body)
            .then(res.success)
            .catch(next);
    }
}

module.exports = UserController;