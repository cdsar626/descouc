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
    cb(null,`${ req.body.nombreProyecto.replace(/ /g, '_') }-${ Date.now() }.pdf`);
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
//// 2: Desco
//// 3: Facultad

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
    send(res, 'desco/dashboard.html');
  } else if(req.session.rol == 3) {
    send(res, 'facultad/dashboard.html');
  } else {
    forbid(res);
  }
})
// Ya no existe algo llamado coordinador
app.get('/getCoords', (req, res) => {
  let data = users.filter(x => x.tipo == 2);
  if(req.session.rol == 4) {
    res.json(data);
    console.log(`enviando coords:`);
    console.log(data);
  }
})

app.get('/getUsers', asyncMiddleware( async (req, res) => {
  if(await isValidSessionAndRol(req, 1)) {
    let data = await pool.query('SELECT * FROM usuarios');
    res.json({ data });
    console.log('enviando usuarios');
  } else {
    forbid(res);
  }
}) );

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

app.get('/success', asyncMiddleware( async (req, res) => {
  if(await isValidSessionAndRol(req, 3)) {
    send(res, 'facultad/success.html');
  } else {
    forbid(res);
  }
}) );

// POST Requests ---------------------------------

app.post('/login', asyncMiddleware( async(req, res) => {
  let user = await verificarUser(req);
  console.log('ey');
  console.log(user.email);
  if(user) { //valid user
    req.session.user = user.email;
    req.session.rol = user.rol;
    res.redirect('/dashboard');
  } else {
    forbid(res);
  }
}) );

app.post('/editUser', asyncMiddleware( async (req, res) => {
  console.log(req.body);
  if(await isValidSessionAndRol(req, 1)) {
    if(req.body.pass == undefined) {
      await pool.query('UPDATE usuarios SET email=?, rol=?, facultad=?  WHERE email = ?',
      [req.body.email, req.body.rol, req.body.facultad, req.body.email]);
    } else {
      await pool.query('UPDATE usuarios SET email=?, pass=SHA(?), rol=?, facultad=?  WHERE email = ?',
      [req.body.email, req.body.pass, req.body.rol, req.body.facultad, req.body.email]);
    }
    res.json({data: 'ok'});
  }
}) );

app.post('/register', asyncMiddleware( async (req, res) => {
  let user = req.body;
  if(await isValidSessionAndRol(req, 1)) {
    await pool.query('INSERT INTO usuarios VALUES (?,SHA(?),?,?)', [user.email, user.pass, user.rol, user.facultad]);
    res.redirect('/dashboard');
  } else {
    forbid(res);
  }
}) );

app.post('/uploadProject', upload.single('inputFile'),asyncMiddleware(async (req, res) => {
  console.log(req.body);
  console.log(req.file);
  let proyData = [
    req.body.nombreProyecto,
    req.body.orgResponsable,
    req.body.responsables,
    req.body.ubicacionGeografica,
    req.body.beneficiariosDirectos,
    req.body.beneficiariosIndirectos,
    req.body.tipoProyecto,
    req.body.areaAtencion,
    req.body.duracionProyecto,
    `${req.body.anoInicio}-${req.body.mesInicio}-${req.body.diaInicio}`,//fecha inicio
    `${req.body.anoFin}-${req.body.mesFin}-${req.body.diaFin}`,//fechafin
    req.body.objGeneral,
    req.body.objsEspecificos,
    req.body.tipo,
    0,
    /* status-----------------------
    /* 0: propuesta
    /* 1: a revisar
    /* 2: rechazado por desco
    /* 3: validado
    /* 4: rechazado por consejo
    /* 5: aprobado 
    /* ------------------------- */
    //nota
  ]
  let qryRes = await pool.query('INSERT INTO proyectos VALUES(0,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,NULL)', proyData);
  let docData = [
    req.file.path,
    req.file.filename,
    qryRes.insertId
  ]
  await pool.query('INSERT INTO documentos VALUES(0,?,?,?)', docData);
  res.redirect('/success');
}) );

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

// Verifica que el usuario y la clave coincidan
async function verificarUser(req) {
  console.log(req.body);
  let resp = await pool.query('SELECT * FROM usuarios WHERE email = ? AND pass = SHA(?)', [req.body.email,req.body.pass]);
  return resp.length ? resp[0] : false;
}

// Verifica que el usuario y rol concuerden con la bd
// y que sea el rol que se requiere (parametro rol)
async function isValidSessionAndRol(req, rol) {
  let resp = await pool.query('SELECT * FROM usuarios WHERE email = ? AND rol = ?', [req.session.user,req.session.rol]);
  if (resp.length) {
    return req.session.rol == rol;
  } else {
    return false;
  }
}

module.exports = app;
