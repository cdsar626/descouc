$(document).ready(function() {
  let currDate = new Date();
  let months = [
    'Enero',
    'Febrero',
    'Marzo',
    'Abril',
    'Mayo',
    'Junio',
    'Julio',
    'Agosto',
    'Septiembre',
    'Octubre',
    'Noviembre',
    'Diciembre',
  ]
  
  // Set años
  for(let i = currDate.getFullYear() - 10; i < currDate.getFullYear() + 20; i++) {
    let opt = document.createElement('option');
    let opt2 = document.createElement('option');

    opt2.value = opt.value = i;
    opt2.text = opt.text = i;
    if (i == currDate.getFullYear()) {
      opt.setAttribute('selected','selected');
      opt2.setAttribute('selected','selected');
    }
    document.getElementById('anoInicio').appendChild(opt);
    document.getElementById('anoFin').appendChild(opt2);

  }

  // Set meses
  for (let i = 0; i < 12; i++){
    let opt = document.createElement('option');
    let opt2 = document.createElement('option');
    opt2.value = opt.value = i + 1;
    opt2.text = opt.text = months[i];
    document.getElementById('mesInicio').appendChild(opt);
    document.getElementById('mesFin').appendChild(opt2);

  }
  $('#mesInicio').append($(document.createElement('option')).text('-------------------').prop({disabled:true}));
  $('#mesInicio').append($(document.createElement('option')).text('Incierto').val(0));
  $('#mesFin').append($(document.createElement('option')).text('-------------------').prop({disabled:true}));
  $('#mesFin').append($(document.createElement('option')).text('Incierto').val(0));
  
  
  //Set dias inicio
  $('#mesInicio').change( function() {
    let diasSelect = document.getElementById('diaInicio');
    diasSelect.innerHTML = '';
    for(let i = 0; i < diasEn(this.value); i++) {
      let opt = document.createElement('option');
      opt.value = i + 1;
      opt.text = i + 1;
      document.getElementById('diaInicio').appendChild(opt);
    }
    $(diasSelect).append($(document.createElement('option')).text('----------------------').prop({disabled:true}));
    $(diasSelect).append($(document.createElement('option')).text('Incierto').val(0) );
  })
  //Set dias fin
  $('#mesFin').change( function() {
    let diasSelect = document.getElementById('diaFin');
    diasSelect.innerHTML = '';
    for(let i = 0; i < diasEn(this.value); i++) {
      let opt = document.createElement('option');
      opt.value = i + 1;
      opt.text = i + 1;
      document.getElementById('diaFin').appendChild(opt);
    }
    $(diasSelect).append($(document.createElement('option')).text('----------------------').prop({disabled:true}));
    $(diasSelect).append($(document.createElement('option')).text('Incierto').val(0) );
  })



  // Select2 Ubicacion
  $.fn.select2.defaults.set('theme', 'bootstrap4');
  let allEstados;
  let allMunicipios;
  let allParroquias;
  let municipios;
  let parroquias;

  $.ajax({
    method: 'get',
    url: '/getAllPlaces',
  }).done(function (res) {
    console.log(res.data);
    allEstados = res.data.estados;
    allMunicipios = res.data.municipios;
    allParroquias = res.data.parroquias;
    allEstados.map(x => x.text = x.nombre); // para cumplir con la estructura de Select2
    allEstados.unshift({id:'', text: 'Estado',selected: true, disabled: true});
    console.log(allMunicipios);
    $('#ubiEstado').html('').select2({
      placeholder: 'Estado',
      data: allEstados,
      width: '100%',
    });
  })
  
// On Estado change carga los municipios correspondientes
  $('#ubiEstado').select2({
    placeholder: 'Estado',
    width: '100%',
  }).change(function () {
    let id = this.value;
    $('#estadoText').val(allEstados.find(x => x.id === parseInt(id)).nombre);
    municipios = allMunicipios.filter(x => x.estado === parseInt(id));
    municipios.map(x => x.text = x.nombre); // para cumplir con la estructura de Select2
    municipios.unshift({id:'', text: 'Municipio',selected: true, disabled: true});
    $('#ubiParroquia').html('');
    $('#ubiMunicipio').html('').prop('disabled', false).select2({
      data: municipios,
      placeholder: 'Municipio',
      width: '100%',
    })
  });

// On Municipio change carga las parroquias correspondientes
  $('#ubiMunicipio').select2({
    placeholder: 'Municipio',
    width: '100%',
  }).change(function () {
    let id = this.value;
    $('#municipioText').val(municipios.find(x => x.id === parseInt(id)).nombre);
    parroquias = allParroquias.filter(x => x.municipio == parseInt(id));
    parroquias.map(x => x.text = x.nombre); // para cumplir con la estructura de Select2
    parroquias.unshift({id:'', text: 'Parroquia',selected: true, disabled: true});
    $('#ubiParroquia').html('').prop('disabled', false).select2({
      data: parroquias,
      placeholder: 'Parroquia',
      width: '100%',
    })
  });

  $('#ubiParroquia').select2({
    placeholder: 'Parroquia',
    width: '100%',
  }).change(function () {
    let id = this.value;
    $('#parroquiaText').val(parroquias.find(x => x.id === parseInt(id)).nombre);
  });

  // Select2 Areas Prioritarias
  let areasP;

  $.ajax({
    method: 'get',
    url: '/getAreasPrioritarias',
  }).done(function (res) {
    areasP = res.data;
    areasP.map(x => x.text = x.descripcion); // para cumplir con la estructura de Select2
    areasP.map(x => x.id = x.text);
    areasP.unshift({id:'', text: 'Áreas Prioritarias',selected: true, disabled: true});
    $('#areaPrioritaria').select2({
      placeholder: 'Áreas Prioritarias',
      data: areasP,
      width: '100%',
    });
  })

  // Select2 Planes de Patria

  let planesP;

  $.ajax({
    method: 'get',
    url: '/getPlanesPatria',
  }).done(function (res) {
    planesP = res.data;
    planesP.map(x => x.text = x.descripcion); // para cumplir con la estructura de Select2
    planesP.map(x => x.id = x.text);
    planesP.unshift({id:'', text: 'Plan de Patria',selected: true, disabled: true});
    $('#planesPatria').select2({
      placeholder: 'Plan de Patria',
      data: planesP,
      width: '100%',
    });
  })

  // Coloca el nombre del archivo en el campo de file1 cuando cambia
  function showNameFileOnChange(id) {
    $('#'+id).change(function(e) {
      let campoInputFile = document.getElementsByClassName('custom-file-label')[id[4]-1];
      if(document.getElementById(id).files.length > 1) {
        campoInputFile.innerText = `${document.getElementById(id).files.length} archivos seleccionados.`
      } else {
        campoInputFile.innerText = $('#'+id).val().replace('C:\\fakepath\\','');
        $('#tagDoc'+(id[4])).val( $('#'+id).val().replace('C:\\fakepath\\','').split('.')[0] );
      }
    })
  }
  
  showNameFileOnChange('file1');
  showNameFileOnChange('file2');
  showNameFileOnChange('file3');
  showNameFileOnChange('file4');
  showNameFileOnChange('file5');

  
  
  document.addEventListener('invalid', (function(){
    return function(e){
      //prevent the browser from showing default error bubble/ hint
      //e.preventDefault();
      // optionally fire off some custom validation handler
      // myvalidationfunction();
      let errorPlace = document.getElementById('errorPlace');
      errorPlace.style.color = 'red'
      errorPlace.innerHTML = '<b>Todos los campos son requeridos (mínimo 1 documento).</b>';
    };
  })(), true);
  
  function diasEn(mes) {
    switch(Number(mes)){
      case 1: case 3: case 5: case 7: case 8: case 10: case 12:
        return 31;
      case 4: case 6: case 9: case 11:
        return 30;
      case 2: return 28;
    }
  }
});