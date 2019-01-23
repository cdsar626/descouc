$(document).ready(function() {
  let searchParams = new URLSearchParams(window.location.search);
  let id = searchParams.get('proyecto');
  $.ajax({
    method: 'get',
    url:'/getProyecto?id=' + id,
  }).done(function (res) {
    let info = res.data[0];

    // Obtenemos los campos
    let fields = {};
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
    //fields. = document.getElementById('');
    

    // Seteamos los campos
    fields.nombre.value = info.nombreProyecto;
    fields.descripcion.value = info.descripcionGeneral;
    fields.orgResp.value = info.orgResponsable;

    fields.responsables.value = info.responsables;
    fields.ubiEstado.value = info.ubiEstado;
    fields.estadoText.value = info.estadoText;
    fields.ubiMunicipio.value = info.ubiMunicipio;
    fields.municipioText.value = info.municipioText;
    fields.ubiParroquia.value = info.ubiParroquia;
    fields.parroquiaText.value = info.parroquiaText;
    fields.direccion.value = info.direccion;
    fields.beneficiariosDirectos.value = info.beneficiariosDirectos;
    fields.beneficiariosIndirectos.value = info.beneficiariosIndirectos;
    fields.areaAtencion.value = info.areaAtencion;
    fields.areaPrioritaria.value = info.areaPrioritaria;
    fields.planesPatria.value = info.planesPatria;
    fields.duracionProyecto.value = info.duracionProyecto;
    fields.anoInicio.value = info.anoInicio;
    fields.mesInicio.value = info.mesInicio;
    fields.diaInicio.value = info.diaInicio;
    fields.anoFin.value = info.anoFin;
    fields.mesFin.value = info.mesFin;
    fields.diaFin.value = info.diaFin;
    fields.objGeneral.value = info.objGeneral;
    fields.objsEspecificos.value = info.objsEspecificos;
    fields.tipo.value = info.tipo;

  })

});
