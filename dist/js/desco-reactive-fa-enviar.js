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
    console.log(`${diasSelect.value}-${this.value}-${$('#anoFin').val()}`);
    console.log(diasSelect.value);
    console.log(this.value);
    console.log($('#anoFin').val())
    console.log(new Date($('#anoFin').val(), this.value-1, diasSelect.value))
  })
    
  // Coloca el nombre del archivo en el campo de inputFile cuando cambia
  $('#inputFile').change(function(e) {
    let campoInputFile = document.getElementsByClassName('custom-file-label')[0];
    if(document.getElementById('inputFile').files.length > 1) {
      campoInputFile.innerText = `${document.getElementById('inputFile').files.length} archivos seleccionados.`
    } else {
      campoInputFile.innerText = $('#inputFile').val().replace('C:\\fakepath\\','');
    }

  })
  
  document.addEventListener('invalid', (function(){
    return function(e){
      //prevent the browser from showing default error bubble/ hint
      e.preventDefault();
      // optionally fire off some custom validation handler
      // myvalidationfunction();
      let errorPlace = document.getElementById('errorPlace');
      errorPlace.style.color = 'red'
      errorPlace.innerHTML = '<b>Todos los campos son requeridos.</b>';
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