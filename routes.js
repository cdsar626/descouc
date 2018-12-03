const express = require('express');
const multer = require('multer');
const pool = require('./bd.js');
const app = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Elije la carpeta donde guardar segun el tipo de proyecto
    let tipo = req.body.tipoProyecto == 1 ? 'ServicioComunitario/' : 'Extension/';
    cb(null, 'proyectos/' + tipo);
  },
  filename: function (req, file, cb) {
    // En el nombre del archivo se sustituyen los espacios por _ 
    cb(null,`${ req.body.nombre.replace(/ /g, '_') }-${ Date.now() }.pdf`);
  }
})

const upload = multer({ storage: storage });


const options = {
  root: __dirname + '/dist/pages/',
}

const asyncMiddleware = fn =>
  (req, res, next) => {
    Promise.resolve(fn(req, res, next))
      .catch(next);
  };

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
  } else {
    forbid(res);
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

app.get('/register', asyncMiddleware( async (req, res) => {
  if(await isValidSessionAndRol(req, 1)) {
    send(res, 'admin/register.html');
  } else {
    forbid(res);
  }
}) );

app.get('/success', (req, res) => {
  if(req.session.rol == 4) {
    send(res, 'facultad/success.html');
  } else {
    forbid(res);
  }
})

// POST Requests ---------------------------------

app.post('/login', asyncMiddleware( async(req, res) => {
  let user = await verificarUser(req);
  console.log(user.nick);
  if(user) { //valid user
    req.session.user = user.nick;
    req.session.rol = user.tipo;
    console.log(req.session);
    res.redirect('/dashboard');
  } else {
    forbid(res);
  }
}) );

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

app.post('/uploadProject', upload.single('inputFile'), (req, res) => {
  console.log(req.body);
  console.log(req.file);
  res.redirect('/success');
})

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

async function verificarUser(req) {
  console.log(req.body);
  let hashedPass = req.body.clave; 
  // Se debe 
  // hashear la clave
  let resp = await pool.query('SELECT * FROM usuario WHERE nick = ? AND clave = ?', [req.body.nick,hashedPass]);
  return resp.length ? resp[0] : false;
}

// Verifica que el usuario y rol concuerden con la bd
// y que sea el rol que se requiere (parametro rol)
async function isValidSessionAndRol(req, rol) {
  let resp = await pool.query('SELECT * FROM usuario WHERE nick = ? AND tipo = ?', [req.session.user,req.session.rol]);
  if (resp.length) {
    return req.session.rol == rol;
  } else {
    return false;
  }
}

module.exports = app;
