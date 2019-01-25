$(document).ready(function() {
  let meses = [
    'Enero',
    'Febrero',
    'Marzo',
    'Abril',
    'Mayo',
    'Junio',
    'Agosto',
    'Septiembre',
    'Octubre',
    'Noviembre',
    'Diciembre',
  ]
  let searchParams = new URLSearchParams(window.location.search);
  let id = searchParams.get('proyecto');
  
  // Obtenemos los campos
  let fields = {};
  fields.id = document.getElementById('id');
  fields.nombre = document.getElementById('nombreProyecto');
  fields.descripcion = document.getElementById('descripcionGeneral');
  fields.orgResp = document.getElementById('orgResponsable');
  fields.responsables = document.getElementById('responsables');
  fields.ubiEstado = document.getElementById('ubiEstado');
  fields.estadoText = document.getElementById('estadoText');
  fields.ubiMunicipio = document.getElementById('ubiMunicipio');
  fields.municipioText = document.getElementById('municipioText');
  fields.ubiParroquia = document.getElementById('ubiParroquia');
  fields.parroquiaText = document.getElementById('parroquiaText');
  fields.direccion = document.getElementById('direccion');
  fields.beneficiariosDirectos = document.getElementById('beneficiariosDirectos');
  fields.beneficiariosIndirectos = document.getElementById('beneficiariosIndirectos');
  fields.areaAtencion = document.getElementById('areaAtencion');
  fields.areaPrioritaria = document.getElementById('areaPrioritaria');
  fields.planesPatria = document.getElementById('planesPatria');
  fields.duracionProyecto = document.getElementById('duracionProyecto');
  fields.anoInicio = document.getElementById('anoInicio');
  fields.mesInicio = document.getElementById('mesInicio');
  fields.diaInicio = document.getElementById('diaInicio');
  fields.anoFin = document.getElementById('anoFin');
  fields.mesFin = document.getElementById('mesFin');
  fields.diaFin = document.getElementById('diaFin');
  fields.objGeneral = document.getElementById('objGeneral');
  fields.objsEspecificos = document.getElementById('objsEspecificos');
  fields.tipo = document.getElementById('tipo');
  fields.nuevosDocs = document.getElementById('nuevosDocs');
  fields.docsFields = document.getElementById('docsFields');
  fields.docsContainer = document.getElementById('docsContainer');

  $.ajax({
    method: 'get',
    url:'/getProyecto?id=' + id,
  }).done(function (res) {
    let info = res.data[0];    

    // Seteamos los campos
    fields.id.value = info.id;
    fields.nombre.value = info.nombreProyecto;
    fields.descripcion.value = info.descripcionGeneral;
    fields.orgResp.value = info.orgResponsable;
    fields.responsables.value = info.responsables;
    fields.direccion.value = info.direccion;
    fields.beneficiariosDirectos.value = info.beneficiariosDirectos;
    fields.beneficiariosIndirectos.value = info.beneficiariosIndirectos;
    fields.areaAtencion.value = info.areaAtencion;
    $(fields.areaPrioritaria).val(info.areaPrioritaria).trigger('change');
    $(fields.planesPatria).val(info.planPatria).trigger('change');
    fields.duracionProyecto.value = info.duracionProyecto;
    fields.anoInicio.value = info.fechaInicio.split('-')[0];
    $(fields.mesInicio).val(Number(info.fechaInicio.split('-')[1])).trigger('change');
    fields.diaInicio.value = Number(info.fechaInicio.split('-')[2].split('T')[0]);
    fields.anoFin.value = info.fechaFin.split('-')[0];
    $(fields.mesFin).val(Number(info.fechaFin.split('-')[1])).trigger('change');
    fields.diaFin.value = Number(info.fechaFin.split('-')[2].split('T')[0]);
    fields.objGeneral.value = info.objGeneral;
    fields.objsEspecificos.value = info.objsEspecificos;
    fields.tipo.value = info.tipo;


    // Seteamos estado
    $(fields.ubiEstado).val(estado2Num(info.estado)).trigger('change');

    // Convertimos los options en un arreglo para usar .find()
    let idMunicipio = Array.apply(null, fields.ubiMunicipio.options);
    // Buscamos el municipio y obtenemos su id (value del option)
    idMunicipio = idMunicipio.find(x => x.innerText == info.municipio).value;
    // Seteamos municipio
    $(fields.ubiMunicipio).val(idMunicipio).trigger('change');

    let idParroquia = Array.apply(null, fields.ubiParroquia.options);
    idParroquia = idParroquia.find(x => x.innerText == info.parroquia).value;
    // Seteamos parroquia
    $(fields.ubiParroquia).val(idParroquia).trigger('change');

    // Esto proximo es para remover del DOM la parte de los archivos si no está checked el checkbox
    let docsDiv = $(fields.docsFields).detach();
    if (fields.nuevosDocs.checked) {
      docsDiv.appendTo('#docsContainer');
    } 
    $(fields.nuevosDocs).change(function () {
      if (fields.nuevosDocs.checked) {
        docsDiv.appendTo('#docsContainer');
      } else {
        docsDiv = $(fields.docsFields).detach();
      }
    })
  })

  function estado2Num(estado) {
    switch (estado) {
      case 'Cojedes': return 0;
      case 'Carabobo': return 1;
      case 'Aragua': return 2;
    }
  }
});
