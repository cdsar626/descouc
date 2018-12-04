$(document).ready(function() {


  
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
