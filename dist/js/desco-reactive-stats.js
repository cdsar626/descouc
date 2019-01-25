$(document).ready(function() {
  // Obtenemos todos los campos
  let fields = {}
  fields.nProj = document.getElementById('nProj');
  fields.nProjDevuelto = document.getElementById('nProjDevuelto');
  fields.nProjRecibido = document.getElementById('nProjRecibido');
  fields.nProjRevision = document.getElementById('nProjRevision');
  fields.nProjRechazado = document.getElementById('nProjRechazado');
  fields.nProjAprobado = document.getElementById('nProjAprobado');
  fields.nProjFinalizado = document.getElementById('nProjFinalizado');
  fields.nProjFCJP = document.getElementById('nProjFCJP');
  fields.nProjFCS = document.getElementById('nProjFCS');
  fields.nProjFaCES = document.getElementById('nProjFaCES');
  fields.nProjFaCE = document.getElementById('nProjFaCE');
  fields.nProjFaCyT = document.getElementById('nProjFaCyT');
  fields.nProjIng = document.getElementById('nProjIng');
  fields.nProjOdont = document.getElementById('nProjOdont');
  fields.nProjAraFCS = document.getElementById('nProjAraFCS');
  fields.nProjAraFaCES = document.getElementById('nProjAraFaCES');
  fields.nProjCojFCS = document.getElementById('nProjCojFCS');


  fields.nPart = document.getElementById('nPart');
  fields.nPartFCJP = document.getElementById('nPartFCJP');
  fields.nPartFCS = document.getElementById('nPartFCS');
  fields.nPartFaCES = document.getElementById('nPartFaCES');
  fields.nPartFaCE = document.getElementById('nPartFaCE');
  fields.nPartFaCyT = document.getElementById('nPartFaCyT');
  fields.nPartIng = document.getElementById('nPartIng');
  fields.nPartOdont = document.getElementById('nPartOdont');
  fields.nPartRango1 = document.getElementById('nPartRango1');
  fields.nPartRango2 = document.getElementById('nPartRango2');
  fields.nPartRango3 = document.getElementById('nPartRango3');
  fields.nPartMasc = document.getElementById('nPartMasc');
  fields.nPartFem = document.getElementById('nPartFem');
  fields.nPartOtros = document.getElementById('nPartOtros');
  
  $.ajax({
    method: 'get',
    url: '/getStats'
  }).done(function (res) {
    console.log(res.data);
    // Seteamos los Proyectos
    fields.nProj.innerText = res.data.nProj;
    fields.nProjDevuelto.innerText = res.data.devuelto;
    fields.nProjRecibido.innerText = res.data.recibido;
    fields.nProjRevision.innerText = res.data.revision;
    fields.nProjRechazado.innerText = res.data.rechazado;
    fields.nProjAprobado.innerText = res.data.aprobado;
    fields.nProjFinalizado.innerText = res.data.finalizado;

    
    fields.nProjFCJP.innerText = res.data.nProjectsByFac['FCJP'] | 0;
    fields.nProjFCS.innerText = res.data.nProjectsByFac['FCS'] | 0;
    fields.nProjFaCES.innerText = res.data.nProjectsByFac['FaCES'] | 0;
    fields.nProjFaCE.innerText = res.data.nProjectsByFac['FaCE'] | 0;
    fields.nProjFaCyT.innerText = res.data.nProjectsByFac['FaCyT'] | 0;
    fields.nProjIng.innerText = res.data.nProjectsByFac['Ingenieria'] | 0;
    fields.nProjOdont.innerText = res.data.nProjectsByFac['Odontologia'] | 0;
    fields.nProjAraFCS.innerText = res.data.nProjectsByFac['Aragua_FCS'] | 0;
    fields.nProjAraFaCES.innerText = res.data.nProjectsByFac['Aragua_FaCES'] | 0;
    fields.nProjCojFCS.innerText = res.data.nProjectsByFac['Cojedes_FCS'] | 0;

    // Seteamos los Participantes
    fields.nPart.innerText = res.data.nPart;
    fields.nPartMasc.innerText = res.data.masculino;
    fields.nPartFem.innerText = res.data.femenino;
    fields.nPartOtros.innerText = res.data.otro;

    fields.nPartRango1.innerText = res.data.rango1;
    fields.nPartRango2.innerText = res.data.rango2;
    fields.nPartRango3.innerText = res.data.rango3;

    fields.nPartFCJP.innerText = res.data.FCJP;
    fields.nPartFCS.innerText = res.data.FCS;
    fields.nPartFaCES.innerText = res.data.FaCES;
    fields.nPartFaCE.innerText = res.data.FaCE;
    fields.nPartFaCyT.innerText = res.data.FaCyT;
    fields.nPartIng.innerText = res.data.Ingenieria;
    fields.nPartOdont.innerText = res.data.Odontologia;


  })


});
