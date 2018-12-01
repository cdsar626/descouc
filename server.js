const express = require('express');
const compress = require('compression');
const bodyParser = require('body-parser');
const session = require('cookie-session');
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(compress());
app.use(express.static('./dist'));

let expireDate = new Date(Date.now() + 60 * 60 * 1000) // 1h
app.use(session({
  name: 'session',
  keys: ['key1', 'key2', 'desco', 'vida'],
  cookie: {
    //secure: true,
    httpOnly: true,
    //domain: '',
    //path: '',
    expires: new Date(Date.now() + 60 * 60 * 1000),
  }
}))


const options = {
  root: __dirname + '/dist/',
}

app.get('/login', (req, res) => {
  if(req.session.isPopulated) {
    res.redirect('/admin');
  } else {
    console.log(req.session);
    res.sendFile('login.html', options);
  }
});

app.get('/register', (req, res) => {
  if(true) {
    res.sendFile('register.html', options);
  } else {
    res.sendFile('Forbid.html', options);
  }
});

app.get('/admin', (req, res) => {
  if(req.session.admin) {
    res.sendFile('dashAdmin.html', options);
  } else {
    res.sendFile('Forbid.html', options);
  }
});

app.get('/logout', (req, res) => {
  req.session = null;
  res.redirect('/');
})

app.post('/admin', (req, res) => {
  console.log(req.body);
  if(req.body.email == 'cdvsnp@gmail.com') {
    res.sendFile('dashAdmin.html', options);
    req.session.admin = true;
  } else {
    res.sendFile('Forbid.html', options);
  }
});

app.post('/register', (req, res) => {
  console.log(req.body);
  if(req.body.email == 'cdvsnp@gmail.com') {
    res.sendFile('dashAdmin.html', options);
  } else {
    res.sendFile('Forbid.html', options);
  }
});

app.get('*', function(req, res) {
  res.sendFile('Forbid.html', options);
})

app.listen(80, () => console.log('escuchando en puerto 80'));