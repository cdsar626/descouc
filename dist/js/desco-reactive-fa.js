$(document).ready(function() {
  let coords = [];

  $.ajax({
    url: '/getCoords',
    method: 'get',
  }).done(function(res) {
    coords = res;
    console.log(coords);
  }).fail(function(err) {
    console.error(err);
  });

});



function tipoNum2Str(n) {
  return n == 1 ? 'Administrador' : n == 2 ? 'Coordinador' : n == 3 ?
    'Extensión' : n == 4 ? 'Facultad' : 'Servicio Comunitario';
};

function tipoStr2Num(str) {
  return str == 'Administrador' ? 1 : str == 'Coordinador' ? 2 : str == 'Extensión' ?
    3 : str == 'Facultad' ? 4 : 5;
}