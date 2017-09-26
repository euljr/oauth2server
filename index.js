require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const oauth = require('./oauth');
const userRoutes = require('./routes/user');
const { errorMiddleware } = require('./lib/error');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(function(req, res, next) {
    res.success = function(data) {
        res.send({
            success: true,
            data
        });
    }
    next();
});
oauth.configure(app);

app.use('/user', userRoutes);

app.use(errorMiddleware)

app.listen(3000);