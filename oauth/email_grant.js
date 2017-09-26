'use strict';

/**
 * Module dependencies.
 */

const {
    AbstractGrantType,
    InvalidArgumentError,
    InvalidGrantError,
    InvalidRequestError
} = require('oauth2-server');
var Promise = require('bluebird');
var promisify = require('promisify-any').use(Promise);
var is = require('oauth2-server/lib/validator/is');
var util = require('util');

/**
 * Constructor.
 */

function EmailGrantType(options) {
    options = options || {};

    if (!options.model) {
        throw new InvalidArgumentError('Missing parameter: `model`');
    }

    if (!options.model.getUser) {
        throw new InvalidArgumentError('Invalid argument: model does not implement `getUserByEmail()`');
    }

    if (!options.model.saveToken) {
        throw new InvalidArgumentError('Invalid argument: model does not implement `saveToken()`');
    }

    AbstractGrantType.call(this, options);
}

/**
 * Inherit prototype.
 */

util.inherits(EmailGrantType, AbstractGrantType);

EmailGrantType.prototype.handle = function (request, client) {
    if (!request) {
        throw new InvalidArgumentError('Missing parameter: `request`');
    }

    if (!client) {
        throw new InvalidArgumentError('Missing parameter: `client`');
    }

    var scope = this.getScope(request);

    return Promise.bind(this)
        .then(function () {
            return this.getUserByEmail(request);
        })
        .then(function (user) {
            return this.saveToken(user, client, scope);
        });
};

EmailGrantType.prototype.getUserByEmail = function (request) {
    if (!request.body.email) {
        throw new InvalidRequestError('Missing parameter: `email`');
    }

    if (!request.body.password) {
        throw new InvalidRequestError('Missing parameter: `password`');
    }

    if (!is.uchar(request.body.email)) {
        throw new InvalidRequestError('Invalid parameter: `email`');
    }

    if (!is.uchar(request.body.password)) {
        throw new InvalidRequestError('Invalid parameter: `password`');
    }

    return promisify(this.model.getUserByEmail, 2).call(this.model, request.body.email, request.body.password)
        .then(function (user) {
            if (!user) {
                throw new InvalidGrantError('Invalid grant: user credentials are invalid');
            }

            return user;
        });
};


EmailGrantType.prototype.saveToken = function (user, client, scope) {
    var fns = [
        this.validateScope(user, client, scope),
        this.generateAccessToken(client, user, scope),
        this.generateRefreshToken(client, user, scope),
        this.getAccessTokenExpiresAt(),
        this.getRefreshTokenExpiresAt()
    ];

    return Promise.all(fns)
        .bind(this)
        .spread(function (scope, accessToken, refreshToken, accessTokenExpiresAt, refreshTokenExpiresAt) {
            var token = {
                accessToken: accessToken,
                accessTokenExpiresAt: accessTokenExpiresAt,
                refreshToken: refreshToken,
                refreshTokenExpiresAt: refreshTokenExpiresAt,
                scope: scope
            };

            return promisify(this.model.saveToken, 3).call(this.model, token, client, user);
        });
};

/**
 * Export constructor.
 */


module.exports = EmailGrantType;