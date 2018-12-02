$(document).ready(function() {
  $('.fecha').text((new Date().toLocaleString()));
  let dataUsers = []
  let user;
  let tabla = $('#dataTable').DataTable({
    ajax: '/getUsers',
    columns: [
    { data: 'nick' },
    { data: 'nombre' },
    { data: 'apellido' },
    { data: 'tipo' }
    ],
    createdRow: function(row, data, dataIndex) {
      //dataUsers.push(data);
      if (data.tipo == 1) {
        data.tipo = 'Administrador';
      } else if (data.tipo == 2) {
        data.tipo = 'Coordinador';
      } else if (data.tipo == 3) {
        data.tipo = 'Extensión';
      } else if (data.tipo == 4) {
        data.tipo = 'Facultad';
      } else if (data.tipo == 5) {
        data.tipo = 'Servicio Comunitario';
      }
    },
    rowCallback: function(row, data) {
      if (data.tipo == 'Administrador'){
        $('td:eq(3)', row).html('Administrador');
      } else if (data.tipo == 'Coordinador'){
        $('td:eq(3)', row).html('Coordinador');
      } else if (data.tipo == 'Extensión'){
        $('td:eq(3)', row).html('Extensión');
      } else if (data.tipo == 'Facultad'){
        $('td:eq(3)', row).html('Facultad');
      } else if (data.tipo == 'Servicio Comunitario'){
        $('td:eq(3)', row).html('Servicio Comunitario');
      }
    },
  });

  tabla.on( 'xhr', function () {
    dataUsers = tabla.ajax.json().data;
  });

  $('#dataTable tbody').on('click', 'tr', function() {
    user = dataUsers.find(x => x.nick == $(this)[0].cells[0].innerText);
    $('#firstName').val(user.nombre);
    $('#lastName').val(user.apellido);
    $('#inputEmail').val(user.nick);
    $('#inputGroupSelect01').val(tipoStr2Num(user.tipo));
    $('#editModal').modal();
  });


  $('#editButton').on('click', function(e,) {
    e.preventDefault();
    let dataEdit = {
      nick: user.nick,
      tipo: $('#inputGroupSelect01').val() ? $('#inputGroupSelect01').val() : tipoStr2Num(user.tipo),
      clave: ($('#inputPassword').val() == $('#confirmPassword').val()) ? 
        $('#inputPassword').val() ? $('#inputPassword').val() : user.clave : user.clave,
      nombre: $('#firstName').val() ? $('#firstName').val() : user.nombre,
      apellido: $('#lastName').val() ? $('#lastName').val() : user.apellido,
    }

    $.ajax({
      url: '/editUser',
      method: 'POST',
      data: dataEdit,
    }).done(function(res) {
      location.reload();
    }).fail(function(err) {
      $('#errorHolder').html('<b>Ocurrió un error</b>');
      console.error(err);
    })
  })



});



function tipoNum2Str(n) {
  return n == 1 ? 'Administrador' : n == 2 ? 'Coordinador' : n == 3 ?
    'Extensión' : n == 4 ? 'Facultad' : 'Servicio Comunitario';
};

function tipoStr2Num(str) {
  return str == 'Administrador' ? 1 : str == 'Coordinador' ? 2 : str == 'Extensión' ?
    3 : str == 'Facultad' ? 4 : 5;
}