const express = require('express');
const compress = require('compression');
const bodyParser = require('body-parser');
const session = require('cookie-session');
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(compress());
app.use(express.static('./dist'));

app.use(session({
  name: 'session',
  keys: ['key1', 'key2', 'desco', 'vida'],
  cookie: {
    //secure: true,
    httpOnly: true,
    //domain: '',
    //path: '',
    maxAge: 1000 * 60,
  }
}))

app.use(require('./routes.js'));

app.listen(80, () => console.log('escuchando en puerto 80'));