$(document).ready(function() {
  $('.fecha').text((new Date().toLocaleString()));
  function format ( d ) {
    // `d` is the original data object for the row
    return '<table cellpadding="5" cellspacing="0" border="0" style="padding-left:50px; margin:auto">'+
        `<tr>
          <td>Nombre:</td>
          <td colspan="3">${d.nombreProyecto}</td>
        </tr>
        <tr>
          <td>Organización Responsable:</td>
          <td colspan="3">${d.orgResponsable}</td>
        </tr>
        <tr>
          <td>Responsables:</td>
          <td colspan="3">-${d.responsables.replace('\n','<br>-')}</td>
        </tr>
        <tr>
          <td>Ubicación geográfica:</td>
          <td colspan="3">${d.ubicacionGeografica}</td>
        </tr>
        <tr>
          <td>Beneficiarios directos:</td>
          <td colspan="3">${d.beneficiariosDirectos}</td>
        </tr>
        <tr>
          <td>Beneficiarios indirectos:</td>
          <td colspan="3">${d.beneficiariosIndirectos}</td>
        </tr>
        <tr>
          <td>Tipo de Proyecto:</td>
          <td>${d.tipoProyecto}</td>
          <td>Duración del proyecto:</td>
          <td>${d.duracionProyecto}</td>
        </tr>
        <tr>
          <td>Fecha de inicio:</td>
          <td>${d.fechaInicio.split('T')[0]}</td>
          <td>Fecha de fin:</td>
          <td>${d.fechaFin.split('T')[0]}</td>
        </tr>
        <tr>
          <td>Objetivo general:</td>
          <td colspan="3">${d.objGeneral}</td>
        </tr>
        <tr>
          <td>Objetivos Específicos:</td>
          <td colspan="3">-${d.objsEspecificos.replace('\n','<br>-')}</td>
        </tr>`+
          d.htmlFiles+
    '</table>'+
    `<form method="post" action="/descoUpdate">
    <input class="d-none" name="id" value="${d.id}"></id>
    <div class="form-group descoDetails">
      <label for="nota">Nota  para el usuario que subió el proyecto</label>
      <textarea class="form-control descoDetails" id="nota" name="nota">${d.nota ? d.nota:''}</textarea>
    </div>
    <br>
    <div class="input-group mb-3 descoDetails">
      <div class="input-group-prepend">
        <label class="input-group-text" for="status">Estatus</label>
      </div>
      <select required name="status" class="custom-select" id="status">
        ${d.htmlSelect}
      </select>
    </div>
    <input class="btn btn-primary btn-block descoDetails" type="submit" value="Actualizar">
  </form>`
  }
  let dataProyectos = []
  let user;
  let tabla = $('#dataTable').DataTable({
    ajax: '/getProyectos',
    columns: [
    {
      className: 'details-control',
      data: 'id',
      "render": function (data) {
        return data + '<i class="fa fa-plus-square icon-fa" aria-hidden="true"></i>';
      },
    },
    { data: 'nombreProyecto' },
    { data: 'responsables' },
    { data: 'ubicacionGeografica' },
    { data: 'tipo' },
    { data: 'status' },
    ],
    order: [[0, 'desc']],
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


  $('#dataTable tbody').on('click', 'tr', function () {
    let tr = $(this).closest('tr');
    let tdi = tr.find("i.fa");
    let row = tabla.row(tr);
    let rowData = row.data();
    if(rowData){
      if (row.child.isShown()) {
          // This row is already open - close it
          row.child.hide();
          tr.removeClass('shown');
          tdi.first().removeClass('fa-minus-square');
          tdi.first().addClass('fa-plus-square');
      }
      else {
        tr.addClass('isloading');
          $.ajax({
            method: 'get',
            url: '/getDocsFromProject?id='+rowData.id,
          }).done( function(res) {
            tr.removeClass('isloading');
            rowData.files = res.data;
            console.log(rowData.files);
            let htmlFiles = '';
            for(let i = 0; i < rowData.files.length; i++){
              htmlFiles = htmlFiles+`<tr><td colspan="4"><a href="${rowData.files[i].ruta}" target="_blank">Archivo ${i+1}</a></td></tr>`
            }
            let htmlSelect = '<option value="">Seleccione...</option>';
            for(let i = 0; i < 6; i++) {
              htmlSelect = htmlSelect+`<option value="${i+1}" ${status2Num(rowData.status) == i+1? 'selected' : ''} ${ i+1 < status2Num(rowData.status)? 'disabled':'' }>
              ${num2Status(i+1)}</option>`
            }
            console.log(rowData.status);
            rowData.htmlFiles = htmlFiles;
            rowData.htmlSelect = htmlSelect;
            // Open this row
            row.child(format(rowData)).show();
            tr.addClass('shown');
            $(tr).next().addClass('shown');
            tdi.first().removeClass('fa-plus-square');
            tdi.first().addClass('fa-minus-square');
          })
          
      }
    }
});
  
  function status2Num(status) {
    switch(status) {
      case 'recibido': return 1; break;
      case 'para revisar': return 2; break;
      case 'rechazado por desco': return 3; break;
      case 'validado': return 4; break;
      case 'rechazado por consejo': return 5; break;
      case 'aprobado': return 6; break;
    }
  }

  function num2Status(num) {
    switch(num) {
      case 1: return 'recibido'; break;
      case 2: return 'para revisar'; break;
      case 3: return 'rechazado por desco'; break;
      case 4: return 'validado'; break;
      case 5: return 'rechazado por consejo'; break;
      case 6: return 'aprobado'; break;
    }
  }

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