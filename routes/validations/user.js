const Joi = require('joi');

module.exports = {
    signup: {
        body: {
            username: Joi.string().required(),
            password: Joi.string().required(),
            fullname: Joi.string().required(),
            email: Joi.string().email().required()
        }
    },
    login: {
        body: {
            login: Joi.string().required(),
            password: Joi.string().required()
        }
    },
    passwordReset: {
        body: {
            token: Joi.string().required(),
            password: Joi.string().required()
        }
    },
    requestPasswordReset: {
        query: {
            email: Joi.string().email().required()
        }
    }
};