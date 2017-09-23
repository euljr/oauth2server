require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const oauth = require('./oauth');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
oauth.configure(app);

app.get('/protected', oauth.authorize(), (req, res) => res.send('protected'));
app.all('*', (req, res) => res.send('Hello World!'));


app.listen(3000);