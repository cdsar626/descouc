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

    fields.nProj.innerText = res.data.nProj;
    fields.nProjDevuelto.innerText = res.data.devuelto;
    fields.nProjRecibido.innerText = res.data.recibido;
    fields.nProjRevision.innerText = res.data.revision;
    fields.nProjRechazado.innerText = res.data.rechazado;
    fields.nProjAprobado.innerText = res.data.aprobado;
    fields.nProjFinalizado.innerText = res.data.finalizado;

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