$(document).ready(function() {
  $('.fecha').text((new Date().toLocaleString()));
  let dataProyectos = []
  let user;
  let tabla = $('#dataTable').DataTable({
    ajax: '/getProyectos',
    columns: [
    { data: 'id' },
    { data: 'nombreProyecto' },
    { data: 'responsables' },
    { data: 'ubicacionGeografica' },
    { data: 'tipo' },
    { data: 'status' },
    ],
    createdRow: function(row, data, dataIndex) {
      if (data.tipo == 1) {
        data.tipo = 'Servicio Comunitario';
      } else if (data.tipo == 2) {
        data.tipo = 'Extensión';
      }
      switch(data.status) {
        case 1: data.status = 'recibido'; break;
        case 2: data.status = 'para revisar'; break;
        case 3: data.status = 'rechazado por desco'; break;
        case 4: data.status = 'validado'; break;
        case 5: data.status = 'rechazado por consejo'; break;
        case 6: data.status = 'aprobado'; break;
      }
    },
    rowCallback: function(row, data) {
      if (data.tipo == 'Servicio Comunitario'){
        $('td:eq(4)', row).html('Servicio Comunitario');
      } else if (data.tipo == 'Extensión'){
        $('td:eq(4)', row).html('Extensión');
      }
      switch(data.status) {
        case 'recibido': $('td:eq(5)', row).html('recibido'); break;
        case 'para revisar': $('td:eq(5)', row).html('para revisar'); break;
        case 'rechazado por desco': $('td:eq(5)', row).html('rechazado por desco'); break;
        case 'validado': $('td:eq(5)', row).html('validado'); break;
        case 'rechazado por consejo': $('td:eq(5)', row).html('rechazado por consejo'); break;
        case 'aprobado': $('td:eq(5)', row).html('aprobado'); break;
      }
      $('td:eq(2)', row).html(data.responsables.split('\n')[0]);
    },
  });

  tabla.on( 'xhr', function () {
    dataProyectos = tabla.ajax.json().data;
  });

  $('#dataTable tbody').on('click', 'tr', function() {
    proyecto = dataProyectos.find(x => x.email == $(this)[0].cells[0].innerText);
    $('#inputEmail').val(user.email);
    $('#selectRol').val(rolStr2Num(user.rol));
    rolStr2Num(user.rol) == 1 ? $('#selectRol').prop({disabled:true}) : $('#selectRol').prop({disabled:false});
    rolStr2Num(user.rol) == 3 ? $('#selectFacultad').prop({disabled:false}) : $('#selectFacultad').prop({disabled:true});
    $('#selectFacultad').val(user.facultad);
    $('#editModal').modal();
  });


  $('#editButton').on('click', function(e) {
    e.preventDefault();
    if(($('#inputPassword').val() == $('#confirmPassword').val())) {
      let dataEdit = {
        email: user.email,
        rol: $('#selectRol').val() ? $('#selectRol').val() : rolStr2Num(user.rol),
        facultad: $('#selectFacultad').val(),
        pass: $('#inputPassword').val() ? $('#inputPassword').val() : undefined,
      }
      $.ajax({
        url: '/editUser',
        method: 'POST',
        data: dataEdit,
      }).done(function(res) {
        location.reload();
      }).fail(function(err) {
        $('#errorHolder').html('<b>Ocurrió un error</b>').css('color', 'red');
        console.error(err);
      })
    } else {
      $('#errorHolder').html('<b>Contraseñas no coinciden</b>').css('color','red');
    }

  })

  $('#selectRol').change(function() {
    this.value != 3 ?
    $('#selectFacultad').prop('disabled', true).val('').prop('required', false) :
    $('#selectFacultad').prop('disabled', false).prop('required', true);
  })

  function rolNum2Str(n) {
    return n == 1 ? 'Administrador' : n == 2 ? 'DESCO' : 'Facultad';
  };
  
  function rolStr2Num(str) {
    return str == 'Administrador' ? 1 : str == 'DESCO' ? 2 : 3;
  }

});