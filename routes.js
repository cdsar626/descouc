const express = require('express');
const multer = require('multer');
const pool = require('./bd.js');
const app = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Elije la carpeta donde guardar segun el tipo de proyecto
    let tipo = req.body.tipo == 1 ? 'ServicioComunitario/' : 'Extension/';
    cb(null, 'proyectos/' + tipo);
  },
  filename: function (req, file, cb) {
    console.log(file);
    // Extraemos la extension del archivo
    let ext = file.originalname.split('.');
    ext = ext[ext.length - 1];
    // En dado que el nombre del archivo tenga un timestamp como el usado aqui, se le quita el viejo stamp
    let nombre = req.body.nombreProyecto.replace(/-[0-9]{13}/,'');
    // En el nombre del archivo se sustituyen los espacios por _ 
    cb(null,`${ nombre.replace(/ /g, '_') }-${ Date.now() }.${ext}`);
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



app.get('/getDocsFromProject', asyncMiddleware( async (req, res) => {
  if(Number.isSafeInteger(Number(req.query.id)) && await isValidSessionAndRol(req, 2)) {
    console.log(req.query);
    let data = await pool.query('SELECT ruta FROM documentos WHERE refProyecto=?',[req.query.id]);
    res.json({ data });
  } else {
    forbid(res);
  }
}) );

app.get('/getUsers', asyncMiddleware( async (req, res) => {
  if(await isValidSessionAndRol(req, 1)) {
    let data = await pool.query('SELECT * FROM usuarios');
    res.json({ data });
  } else {
    forbid(res);
  }
}) );

app.get('/getProyectos', asyncMiddleware( async (req, res) => {
  if(await isValidSessionAndRol(req, 2)) {
    let data = await pool.query('SELECT * FROM proyectos');
    res.json({ data });
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

app.get('/proyectos/:tipo/:nombre', (req, res) => {
  console.log(req.params);
  res.sendFile(`${req.params.tipo}/${req.params.nombre}`, {root: __dirname + '/proyectos/'});
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
  if(user) { //valid user
    req.session.user = user.email;
    req.session.rol = user.rol;
    if(user.rol == 3) req.session.facultad = user.facultad;
    res.redirect('/dashboard');
  } else {
    forbid(res);
  }
}) );

app.post('/descoUpdate', asyncMiddleware( async (req, res) => {
  console.log(req.body);
  if (await isValidSessionAndRol(req, 2)) {
    let nota = req.body.nota == ''? null : req.body.nota;
    await pool.query('UPDATE proyectos SET nota=?, status=? WHERE id=?', [nota, req.body.status, req.body.id]);
    res.redirect('/dashboard');
  } else {
    forbid(res);
  }
}) );


app.post('/editUser', asyncMiddleware( async (req, res) => {
  if(await isValidSessionAndRol(req, 1)) {
    if(req.body.pass == undefined) {
      await pool.query('UPDATE usuarios SET email=?, rol=?, facultad=?  WHERE email = ?',
      [req.body.email, req.body.rol, req.body.facultad, req.body.email]);
    } else {
      await pool.query('UPDATE usuarios SET email=?, pass=SHA(?), rol=?, facultad=?  WHERE email = ?',
      [req.body.email, req.body.pass, req.body.rol, req.body.facultad, req.body.email]);
    }
    res.json({data: 'ok'});
  } else {
    forbid(res);
  }
}) );

app.post('/register', asyncMiddleware( async (req, res) => {
  let user = req.body;
  if (await isValidSessionAndRol(req, 1)) {
    await pool.query('INSERT INTO usuarios VALUES (?,SHA(?),?,?)', [user.email, user.pass, user.rol, user.facultad]);
    res.redirect('/dashboard');
  } else {
    forbid(res);
  }
}) );

app.post('/uploadProject', upload.array('inputFile', 10),asyncMiddleware(async (req, res) => {
  console.log(req.body);
  console.log(req.files);
  if (await isValidSessionAndRol(req,3)) {
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
      /* ^ tipo-------------------------
      /* 1: Servicio Comunitario
      /* 2: Extension
      /* ------------------------------*/
      1,
      /* ^ status-----------------------
      /* 1: propuesta
      /* 2: a revisar
      /* 3: rechazado por desco
      /* 4: validado
      /* 5: rechazado por consejo
      /* 6: aprobado 
      /* ------------------------- */
      //nota
    ]
    let qryRes = await pool.query('INSERT INTO proyectos VALUES(0,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,NULL)', proyData);
    for(let i = 0; i < req.files.length; i++) {
      let docData = [
        qryRes.insertId,
        req.files[i].path,
        req.files[i].filename,
        (new Date()).toISOString().split('T')[0], // Obtiene solo la fecha en formato yyyy-mm-dd
      ];
      console.log(docData);
      await pool.query('INSERT INTO documentos VALUES(0,?,?,?,?,1)', docData);
    }
    res.redirect('/success');
  } else {
    forbid(res);
  }


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
  if(req.session.isPopulated){
    let resp = await pool.query('SELECT * FROM usuarios WHERE email = ? AND rol = ?', [req.session.user,req.session.rol]);
    if (resp.length) {
      return req.session.rol == rol;
    } else {
      return false;
    }
  } else {
    return false;
  }
}

module.exports = app;
