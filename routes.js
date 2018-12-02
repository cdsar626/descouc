const express = require('express');
const session = require('cookie-session');
const app = express.Router();

const options = {
  root: __dirname + '/dist/pages/',
}

//rol: 
//// 1: Admin
//// 2: Coordinador
//// 3: Extension
//// 4: Facultad
//// 5: SC

let users = [
  {
    nick: 'ad@gm.com',
    tipo: 1,
    clave: '',
    nombre: 'DeAdmin',
    apellido: 'Sudo Su',
  },
  {
    nick: 'co@gm.com',
    tipo: 2,
    clave: '',
    nombre: 'Coor',
    apellido: 'Dina',
  },
  {
    nick: 'ex@gm.com',
    tipo: 3,
    clave: '',
    nombre: 'Ex',
    apellido: 'Tension',
  },
  {
    nick: 'fa@gm.com',
    tipo: 4,
    clave: '',
    nombre: 'Facu',
    apellido: 'Edad',
  },
  {
    nick: 'sc@gm.com',
    tipo: 5,
    clave: '',
    nombre: 'Servicio',
    apellido: 'Comuna',
  },
  ]


//GET Requests ------------------------------------

app.get('/dashboard', (req, res) => {
  if(req.session.rol == 1) {
    send(res, 'admin/dashboard.html');
  } else if(req.session.rol == 2) {
    send(res, 'coordinador/dashboard.html');
  } else if(req.session.rol == 3) {
    send(res, 'extension/dashboard.html');
  } else if(req.session.rol == 4) {
    send(res, 'facultad/dashboard.html');
  } else if(req.session.rol == 5) {
    send(res, 'sc/dashboard.html');
  }else {
    forbid(res);
  }
})

app.get('/getCoords', (req, res) => {
  let data = users.filter(x => x.tipo == 2);
  if(req.session.rol == 4) {
    res.json(data);
    console.log(`enviando coords:`);
    console.log(data);
  }
})

app.get('/getUsers', (req, res) => {
  if(req.session.rol == 1) {
    res.json({ data: users });
    console.log('enviando usuarios');
  }
})

app.get('/login', (req, res) => {
  if(req.session.isPopulated) {
    res.redirect('/dashboard');
  } else {
    send(res, 'login.html');
  }
});

app.get('/logout', (req, res) => {
  req.session = null;
  res.redirect('/');
})

app.get('/register', (req, res) => {
  console.log(users);
  if(req.session.rol == 1) {
    send(res, 'admin/register.html');
  } else {
    forbid(res);
  }
});

// POST Requests ---------------------------------

app.post('/login', (req, res) => {
  if(validar_user(req)) { //valid user
    req.session.user = req.body.email;
    if(`${req.body.email[0]+req.body.email[1]}` == 'ad'){
      req.session.rol = 1;
    } else if(`${req.body.email[0]+req.body.email[1]}` == 'co'){
      req.session.rol = 2;
    } else if(`${req.body.email[0]+req.body.email[1]}` == 'ex'){
      req.session.rol = 3;
    } else if(`${req.body.email[0]+req.body.email[1]}` == 'fa'){
      req.session.rol = 4;
    } else if(`${req.body.email[0]+req.body.email[1]}` == 'sc'){
      req.session.rol = 5;
    }
    res.redirect('/dashboard');
  } else {
    forbid(res);
  }
});

app.post('/editUser', (req, res) => {
  if(req.session.rol === 1) {
    console.log(req.body);
    res.json({data: 'ok'});
  }
})

app.post('/register', (req, res) => {
  console.log(req.body);
  if(req.session.rol === 1) {
    users.push(req.body);
    res.redirect('/dashboard');
  } else {
    forbid(res);
  }
});


// Else

app.get('*', function(req, res) {
  forbid(res);
})

function forbid(res) {
  res.status(403).sendFile('Forbid.html', options);
}

function send(res, file) {
  res.sendFile(file, options);
}

function validar_user(req) {
  return users.find(x => x.nick == req.body.email) ? true : false;
}

module.exports = app;
