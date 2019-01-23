const express = require('express');
const multer = require('multer');
const pool = require('./bd.js');
const pdfUC = require('./pdfUC');
const app = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Elije la carpeta donde guardar segun el tipo de proyecto
    let tipo; 
    switch(req.body.tipo) {
      case '1': tipo = 'Extension/' ;break;
      case '2': tipo = 'SocioProductivo/' ;break;
      case '3': tipo = 'SocioComunitario/' ;break;
      case '4': tipo = 'Integrador/' ;break;
    }
    console.log(tipo);
    cb(null, 'proyectos/' + tipo);
  },
  filename: function (req, file, cb) {
    //console.log(file);
    // Extraemos la extension del archivo
    let ext = file.originalname.split('.');
    ext = ext[ext.length - 1];
    // En dado que el nombre del archivo tenga un timestamp como el usado aqui, se le quita el viejo stamp
    let nombre = req.body.nombreProyecto.replace(/-[0-9]{13}/,'');
    // En el nombre del archivo se sustituyen los espacios por _ 
    cb(null,`${ nombre.replace(/ /g, '_') }-${ Date.now() }.${ext}`);
  }
})

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5 // aka 1MB * 5
  }
  /*fileFilter: function(req, file, cb) {
    if(req.session.rol == 2 || req.session.rol == 3) {
      cb(null, true);
    } else {
      cb(null, false);
    }
  }*/
});


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

app.get('/areas', asyncMiddleware( async (req, res) => {
  if(await isValidSessionAndRol(req, 2)) {
    send(res, 'desco/areas.html');
  } else {
    forbid(res);
  }
}) );

app.get('/constancia', asyncMiddleware( async (req, res) => {
  console.log(req.query);
  if(Number.isSafeInteger(Number(req.query.proyecto))) {
    let data = await pool.query('SELECT * FROM participantes WHERE refProyecto=? && cedula=?', [req.query.proyecto, req.query.participante]);
    console.log(data[0]);
    if(data[0]) {
      console.log('Existe');
      enviarConstanciaParticipante(res, req.query.proyecto, data[0]);
    } else {
      forbid(res);
    }
  } else {
    forbid(res);
  }
}) );

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

app.get('/enviarProyecto', asyncMiddleware( async (req, res) => {
  if(await isValidSessionAndRol(req, 3)) {
    send(res, 'facultad/enviarProyecto.html');
  } else {
    forbid(res);
  }
}) );

app.get('/getAreasPrioritarias', asyncMiddleware( async (req, res) => {
  if(await isValidSessionAndRol(req, 2, 3)) {
    let data;
    data = await pool.query('SELECT * FROM areasPrioritarias;');
    res.json({ data });
  } else {
    forbid(res);
  }
}) );

app.get('/getAvancesFromProject', asyncMiddleware( async (req, res) => {
  if(Number.isSafeInteger(Number(req.query.id)) && await isValidSessionAndRol(req, 2, 3)) {
    let data = await pool.query('SELECT * FROM avances WHERE refProyecto=?',[req.query.id]);
    res.json({ data });
  } else {
    forbid(res);
  }
}) );

app.get('/getDocsFromProject', asyncMiddleware( async (req, res) => {
  if(Number.isSafeInteger(Number(req.query.id)) && await isValidSessionAndRol(req, 2, 3)) {
    let data = await pool.query('SELECT ruta,tipo,numero,refAvance,nombreDoc FROM documentos WHERE refProyecto=?',[req.query.id]);
    res.json({ data });
  } else {
    forbid(res);
  }
}) );

app.get('/getEstados', asyncMiddleware( async (req, res) => {
  if(await isValidSessionAndRol(req, 2, 3)) {
    let data;
    data = await pool.query('SELECT * FROM estados;');
    res.json({ data });
  } else {
    forbid(res);
  }
}) );

app.get('/getMunicipios', asyncMiddleware( async (req, res) => {
  if(Number.isSafeInteger(Number(req.query.estado)) && await isValidSessionAndRol(req, 2, 3)) {
    console.log(req.query);
    let data = await pool.query('SELECT * FROM municipios WHERE estado=?',[req.query.estado]);
    res.json({ data });
  } else {
    forbid(res);
  }
}) );

app.get('/getParroquias', asyncMiddleware( async (req, res) => {
  if(Number.isSafeInteger(Number(req.query.municipio)) && await isValidSessionAndRol(req, 2, 3)) {
    console.log(req.query);
    let data = await pool.query('SELECT * FROM parroquias WHERE municipio=?',[req.query.municipio]);
    res.json({ data });
  } else {
    forbid(res);
  }
}) );

app.get('/getParticipantesFromProject', asyncMiddleware( async (req, res) => {
  if(Number.isSafeInteger(Number(req.query.id)) && await isValidSessionAndRol(req, 2, 3)) {
    let data = await pool.query('SELECT * FROM participantes WHERE refProyecto=?',[req.query.id]);
    res.json({ data });
  } else {
    forbid(res);
  }
}) );

app.get('/getPlanesPatria', asyncMiddleware( async (req, res) => {
  if(await isValidSessionAndRol(req, 2, 3)) {
    let data;
    data = await pool.query('SELECT * FROM planesPatria;');
    res.json({ data });
  } else {
    forbid(res);
  }
}) );

app.get('/getProyecto', asyncMiddleware( async (req, res) => {
  if(Number.isSafeInteger(Number(req.query.id)) && await isValidSessionAndRol(req, 3)) {
    console.log(req.query);
    if(await verificarAutoridad(req, req.query.id)) {
      let data;
      data = await pool.query('SELECT * FROM proyectos WHERE id=?', [req.query.id]);
      res.json({data});
    } else {
      forbid(res);
    }
  } else {
    forbid(res);
  }
}) );

app.get('/getProyectos', asyncMiddleware( async (req, res) => {
  if(await isValidSessionAndRol(req, 2, 3)) {
    let data;
    if(req.session.rol == 3) {
      data = await pool.query('SELECT * FROM proyectos WHERE email=?',[req.session.user]);
    } else {
      data = await pool.query('SELECT * FROM proyectos');
    }
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

app.get('/modificar', asyncMiddleware( async (req, res) => {
  if(Number.isSafeInteger(Number(req.query.proyecto)) && await isValidSessionAndRol(req, 3)) {
    console.log(req.query);
    if(await verificarAutoridad(req, req.query.proyecto)) {
      send(res, 'facultad/modificarProyecto.html');
    } else {
      forbid(res);
    }
  } else {
    forbid(res);
  }
}) );

app.get('/planes', asyncMiddleware( async (req, res) => {
  if(await isValidSessionAndRol(req, 2)) {
    send(res, 'desco/planes.html');
  } else {
    forbid(res);
  }
}) );

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
  if(await isValidSessionAndRol(req, 3, 2)) {
    if(req.session.rol == 3){
      send(res, 'facultad/success.html');
    } else {
      send(res, 'desco/success.html');
    }
  } else {
    forbid(res);
  }
}) );

// POST Requests ---------------------------------

app.post('/actualizarDocs', asyncMiddleware(async (req, res) => {
  if(await isValidSessionAndRol(req, 3)) { // Si es valida la sesion
    await upload.any()(req, res, async function(err) { // Sube los archivos
      if (!(await verificarAutoridad(req, req.body.refProyecto))) {
        res.send(`${new Date().toLocaleString()} -> ${req.path}: Fallo en la autorización por ${req.session.user}`);
        throw new Error(`${new Date().toLocaleString()} -> ${req.path}: Fallo en la autorización por ${req.session.user}`);
      }
      if(err) {
        return res.end('Error al subir archivos. Esto puede ocurrir si algun archivo es mayor a 5MB.');
      } else {
        console.log(req.files);
        console.log(req.files[0].fieldname[9]);
        for(let i = 0; i < req.files.length; i++) {
          //obtiene el numero de archivo
          let nArchivo = req.files[i].fieldname[9];
          let ruta = req.files[i].path;
          let data = [
            ruta,
            req.body.refProyecto,
            nArchivo,
          ]
          await pool.query('UPDATE documentos SET ruta=?, fechaSubida=NOW() WHERE refProyecto=? && tipo=2 && numero=?', data);
          await pool.query('UPDATE proyectos SET status=2, fechaStatus=NOW() WHERE id=?',[req.body.refProyecto]);
          console.log(req.body.refProyecto);
        }
        res.redirect('/success');

      }
    });


  } else {
    forbid(res);
  }
}))

app.post('/agregarAreaPrioritaria', asyncMiddleware( async (req, res) => {
  if (await isValidSessionAndRol(req, 2)) {
    console.log(req.body);
    await pool.query('INSERT INTO areasPrioritarias VALUES (0,?)', [req.body.area.trim()]);
    res.redirect('/success');
  } else {
    forbid(res);
  }
}) );

app.post('/agregarParticipantes', asyncMiddleware( async (req, res) => {
  if (await isValidSessionAndRol(req, 3)) {
    if (!(await verificarAutoridad(req, req.body.refProyecto))) {
      res.send(`${new Date().toLocaleString()} -> ${req.path}: Fallo en la autorización por ${req.session.user}`);
      throw new Error(`${new Date().toLocaleString()} -> ${req.path}: Fallo en la autorización por ${req.session.user}`);
    }
    let fechaNac = req.body.fechaNac.split('/');
    let data = [
      //id -> 0
      req.body.nombre,
      req.body.apellido,
      req.body.cedula,
      req.body.lugar,
      req.body.genero,
      `${fechaNac[2]}-${fechaNac[1]}-${fechaNac[0]}`,
      req.body.tipoParticipante,
      req.body.refProyecto,
    ]
    await pool.query('INSERT INTO participantes VALUES(0,?,?,?,?,?,?,?,?,NULL)', data);
    res.redirect('/success');
  } else {
    forbid(res);
  }
}) );

app.post('/agregarPlanPatria', asyncMiddleware( async (req, res) => {
  if (await isValidSessionAndRol(req, 2)) {
    console.log(req.body);
    await pool.query('INSERT INTO planesPatria VALUES (0,?)', [req.body.plan.trim()]);
    res.redirect('/success');
  } else {
    forbid(res);
  }
}) );


app.post('/deleteAreaPrioritaria', asyncMiddleware( async (req, res) => {
  if (await isValidSessionAndRol(req, 2)) {
    console.log(req.body);
    await pool.query('DELETE FROM areasPrioritarias WHERE id=?', [req.body.id]);
    res.redirect('/success');
  } else {
    forbid(res);
  }
}) );

app.post('/deletePlanPatria', asyncMiddleware( async (req, res) => {
  if (await isValidSessionAndRol(req, 2)) {
    console.log(req.body);
    await pool.query('DELETE FROM planesPatria WHERE id=?', [req.body.id]);
    res.redirect('/success');
  } else {
    forbid(res);
  }
}) );

app.post('/descoUpdate', asyncMiddleware( async (req, res) => {
  console.log(req.body);
  if (await isValidSessionAndRol(req, 2)) {
    let nota = req.body.nota == ''? null : req.body.nota;
    await pool.query('UPDATE proyectos SET nota=?, status=?, fechaStatus=NOW() WHERE id=?', [nota, req.body.status, req.body.id]);
    res.redirect('/dashboard');
  } else {
    forbid(res);
  }
}) );

app.post('/editAreaPrioritaria', asyncMiddleware( async (req, res) => {
  if (await isValidSessionAndRol(req, 2)) {
    console.log(req.body);
    await pool.query('UPDATE areasPrioritarias SET descripcion=? WHERE id=?', [req.body.area, req.body.id]);
    res.redirect('/success');
  } else {
    forbid(res);
  }
}) );

app.post('/editPlanPatria', asyncMiddleware( async (req, res) => {
  if (await isValidSessionAndRol(req, 2)) {
    console.log(req.body);
    await pool.query('UPDATE planesPatria SET descripcion=? WHERE id=?', [req.body.plan, req.body.id]);
    res.redirect('/success');
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

app.post('/finalizarProyecto', asyncMiddleware(async (req, res) => {
  if (await isValidSessionAndRol(req, 3)) {
    await upload.array('inputFile',10)(req, res, async function(err) { // Sube los archivos
      console.log(req.body);
      if (!(await verificarAutoridad(req, req.body.refProyecto))) {
        res.send(`${new Date().toLocaleString()} -> ${req.path}: Fallo en la autorización por ${req.session.user}`);
        throw new Error(`${new Date().toLocaleString()} -> ${req.path}: Fallo en la autorización por ${req.session.user}`);
      }
      if(err) {
        return res.end('Error al subir archivos. Esto puede ocurrir si algun archivo es mayor a 5MB.');
      } else {
      console.log(req.files);
        console.log(req.body);
        let numerosAvance = await pool.query('SELECT numero FROM avances WHERE refProyecto=?', [req.body.refProyecto]);
        let lastAvance = Math.max.apply(Math, numerosAvance.map(x => x.numero));
        lastAvance < 0 ? lastAvance = 0 : '';
        let avanceData = [
          // id
          req.body.refProyecto,
          lastAvance + 1,
          `${req.body.anoInicio}-${req.body.mesInicio}-${req.body.diaInicio}`,
          req.body.notaAvance,
        ]
        let qryRes = await pool.query('INSERT INTO avances VALUES(0,?,?,?,?)', avanceData);
        await pool.query('UPDATE proyectos SET avances=avances+1 WHERE id=?', [req.body.refProyecto]);

        for(let i = 0; i < req.files.length; i++) {
          let docData = [
            // id
            req.body.refProyecto,
            qryRes.insertId,
            req.files[i].path,
            req.files[i].filename,
            // Fecha subida
            // tipo -> 5: finales
            i+1 // numero
          ]
          await pool.query('INSERT INTO documentos VALUES(0,?,?,?,?,NOW(),5,?)', docData);
        }
        await pool.query('UPDATE proyectos SET status=5, fechaStatus=NOW() WHERE id=?', [req.body.refProyecto]);
        res.redirect('/success');
      }
    });
   } else {
    forbid(res);
  }
}) );

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

app.post('/register', asyncMiddleware( async (req, res) => {
  let user = req.body;
  if (await isValidSessionAndRol(req, 1)) {
    await pool.query('INSERT INTO usuarios VALUES (?,SHA(?),?,?)', [user.email, user.pass, user.rol, user.facultad]);
    res.redirect('/dashboard');
  } else {
    forbid(res);
  }
}) );

app.post('/subirAval', asyncMiddleware(async (req, res) =>{
  if (await isValidSessionAndRol(req, 2)) {

    await upload.any()(req, res, async function(err) { // Sube los archivos
      if(err) {
        return res.end('Error al subir archivos. Esto puede ocurrir si el archivo es mayor a 5MB.');
      } else {
        console.log(req.body);
        console.log(req.files);
        let dataDoc = [
          //id
          req.body.refProyecto,
          //refAvance
          req.files[0].path,
          req.files[0].filename,
          //fechaSubida
          //tipo -> Aval -> 3
          //numero -> 1
        ];
        await pool.query('INSERT INTO documentos VALUES(0,?,NULL,?,?,NOW(),3,1)', dataDoc);
        res.redirect('/success');
      }
    });

  } else {
    forbid(res);
  }
}) );

app.post('/subirAvance', asyncMiddleware(async (req, res) => {
  if(await isValidSessionAndRol(req, 3)) { // Si es valida la sesion
    await upload.array('inputFile',10)(req, res, async function(err) { // Sube los archivos
      if (!(await verificarAutoridad(req, req.body.refProyecto))) {
        res.send(`${new Date().toLocaleString()} -> ${req.path}: Fallo en la autorización por ${req.session.user}`);
        throw new Error(`${new Date().toLocaleString()} -> ${req.path}: Fallo en la autorización por ${req.session.user}`);
      }
      if(err) {
        return res.end('Error al subir archivos. Esto puede ocurrir si algun archivo es mayor a 5MB.');
      } else {
        console.log(req.files);
        console.log(req.body);
        let numerosAvance = await pool.query('SELECT numero FROM avances WHERE refProyecto=?', [req.body.refProyecto]);
        let lastAvance = Math.max.apply(Math, numerosAvance.map(x => x.numero));
        lastAvance < 0 ? lastAvance = 0 : '';
        let avanceData = [
          // id
          req.body.refProyecto,
          lastAvance + 1,
          `${req.body.anoInicio}-${req.body.mesInicio}-${req.body.diaInicio}`,
          req.body.notaAvance,
        ]
        let qryRes = await pool.query('INSERT INTO avances VALUES(0,?,?,?,?)', avanceData);
        await pool.query('UPDATE proyectos SET avances=avances+1 WHERE id=?', [req.body.refProyecto]);

        for(let i = 0; i < req.files.length; i++) {
          let docData = [
            // id
            req.body.refProyecto,
            qryRes.insertId,
            req.files[i].path,
            req.files[i].filename,
            // Fecha subida
            // tipo -> 4: avances
            i+1 // numero
          ]
          await pool.query('INSERT INTO documentos VALUES(0,?,?,?,?,NOW(),4,?)', docData);
        }
        res.redirect('/success');
      }
    });


  } else {
    forbid(res);
  }
}))

let fileFieldsFromUploadProject = [
  {name: 'file1', maxCount: 1},
  {name: 'file2', maxCount: 1},
  {name: 'file3', maxCount: 1},
  {name: 'file4', maxCount: 1},
  {name: 'file5', maxCount: 1},
]
app.post('/uploadProject', upload.fields(fileFieldsFromUploadProject),asyncMiddleware(async (req, res) => {
  console.log(req.body);
  console.log(req.files);
  if (await isValidSessionAndRol(req,3)) {
    let proyData = [
      // id
      req.session.user, // email
      req.body.nombreProyecto,
      req.body.descripcionGeneral,
      req.body.orgResponsable,
      req.body.responsables,
      req.body.estadoText,
      req.body.municipioText,
      req.body.parroquiaText,
      req.body.direccion,
      req.body.beneficiariosDirectos,
      req.body.beneficiariosIndirectos,
      req.body.areaAtencion,
      req.body.areaPrioritaria,
      req.body.planesPatria,
      req.body.duracionProyecto,
      `${req.body.anoInicio}-${req.body.mesInicio}-${req.body.diaInicio}`,//fecha inicio
      `${req.body.anoFin}-${req.body.mesFin}-${req.body.diaFin}`,//fechafin
      req.body.objGeneral,
      req.body.objsEspecificos,
      req.body.tipo,
      /* ^ tipo-------------------------
      /* 1: Extension
      /* 2: Socio Productivo
      /* 3: Socio Comunitario
      /* 4: Integrador
      /* ------------------------------*/
      1,
      /* ^ status-----------------------
      /* 0: Devuelto para modificar
      /* 1: Recibido
      /* 2: En revision
      /* 3: Rechazado
      /* 4: Aprobado
      /* 5: Finalizado
      /* ------------------------- */
      //nota
      //avances -> 0
      //fecheEnvio
      //fechaStatus
    ]
    let qryRes = await pool.query('INSERT INTO proyectos VALUES(0,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,NULL,0,NOW(),NOW())', proyData);
    console.log(req.files['file'+1][0]);
    for(let i = 1; i <= 5; i++) {
      if(req.files['file'+i] && req.body['tagDoc'+i]){
        let docData = [
          //id: 0: auto
          qryRes.insertId,
          //refAvance: NULL
          req.files['file'+i][0].path,
          req.body['tagDoc'+i],
          (new Date()).toISOString().split('T')[0], // Obtiene solo la fecha en formato yyyy-mm-dd
          //tipo: inicio, actualizado, etc.
          i, //numero
        ];
        console.log(docData);
        await pool.query('INSERT INTO documentos VALUES(0,?,NULL,?,?,?,1,?)', docData);
        await pool.query('INSERT INTO documentos VALUES(0,?,NULL,?,?,?,2,?)', docData);
      }
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

async function verificarAutoridad(req, id) {

  let resp = await pool.query('SELECT id,email FROM proyectos WHERE id=? AND email=?', [id,req.session.user]);
  return resp.length ? true : false;
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

async function isValidSessionAndRol(req, rol1, rol2) {
  if(req.session.isPopulated){
    let resp = await pool.query('SELECT * FROM usuarios WHERE email = ? AND rol = ?', [req.session.user,req.session.rol]);
    if (resp.length) {
      return (req.session.rol == rol1 || req.session.rol == rol2);
    } else {
      return false;
    }
  } else {
    return false;
  }
}

function enviarConstanciaParticipante(res, idProy, persona) {
  pdfUC.crearPDFUC(idProy+persona.cedula,'./constancias/','./uc.png','./facyt.png','Republica Bolivariana de Venezuela',
 'Vicerectorado Academico','Direccion General de Docencia y Desarrollo Curricular',
 'DD-003-58','Valencia', 'Julio 14 de 2018', persona.nombre + ' ' + persona.apellido,'Coordinador de doctorado',
 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
 'Licd Maria Remedios',
 'Coordinador de departamento','Edif Facultad de Ciencias de la Educacion',
 'Telf.: 0245-258 74 74', res);
}

module.exports = app;
