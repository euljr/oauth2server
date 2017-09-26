class CustomError extends Error {
    constructor(message, extra) {
        super(message, extra);
        Error.captureStackTrace(this, this.constructor);
        this.name = this.constructor.name;
        this.message = message + '';
        this.extra = extra;
        this.statusCode = 500;
    }
}

class UserNotFoundError extends CustomError {
    constructor(message, extra) {
        super(message, extra);
        this.statusCode = 404;
    }
}

class UsernameNotAvailableError extends CustomError {
    constructor(message, extra) {
        super(message, extra);
        this.statusCode = 400;
    }
}

class EmailNotAvailableError extends CustomError {
    constructor(message, extra) {
        super(message, extra);
        this.statusCode = 400;
    }
}

class TokenNotFoundError extends CustomError {
    constructor(message, extra) {
        super(message, extra);
        this.statusCode = 404;
    }
}

class TokenExpiredError extends CustomError {
    constructor(message, extra) {
        super(message, extra);
        this.statusCode = 401;
    }
}

const errorMiddleware = (err, req, res, next) => {
    let json = {
        success: false,
        data:err
    };
    if(process.env.NODE_ENV === 'development')
        json.stack = err.stack;
    res.status(err.statusCode || 500).send(json);
};

module.exports = {
    CustomError,
    UserNotFoundError,
    TokenNotFoundError,
    TokenExpiredError,
    UsernameNotAvailableError,
    EmailNotAvailableError,
    errorMiddleware
}
