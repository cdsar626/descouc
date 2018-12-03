$(document).ready(function() {

  $('.form-control .select2').css({
    'top': '30px'
  })


  let coords;
  let data;
  $.ajax({
    url: '/getCoords',
    method: 'get',
  }).done(function(res) {
    coords = res;
    console.log(coords);
    data = $.map(coords, function(obj) {
      obj.id = obj.nick;
      obj.text = `${obj.nombre} ${obj.apellido}`;
      return obj;
    })
    data.unshift({
      id: '',
      text: 'Seleccione...',
    })
    console.log(data);
    $('#selectCoordinador').select2({
      data: data,
      theme: 'bootstrap4',
      language: 'es',
    })
  }).fail(function(err) {
    console.error(err);
  });
  
// Coloca el nombre del archivo en el campo de inputFile cuando cambia
  $('#inputFile').change(function(e) {
    let campoInputFile = document.getElementsByClassName('custom-file-label')[0];
    campoInputFile.innerText = $('#inputFile').val().replace('C:\\fakepath\\','');
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

});
