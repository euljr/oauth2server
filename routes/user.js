const express = require('express');
const validate = require('express-validation');
const validations = require('./validations/user');
const UserController = require('../controllers/user');

const router = express.Router();

router
    .post('/signup', validate(validations.signup), UserController.signup);

router
    .route('/passwordreset')
    .get(validate(validations.requestPasswordReset), UserController.requestPasswordReset)
    .post(validate(validations.passwordReset), UserController.resetPassword);

module.exports = router;