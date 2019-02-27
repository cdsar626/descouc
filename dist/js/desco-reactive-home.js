$(document).ready(function() {

  $('#search_input').keyup(function (ev) {
    if(ev.keyCode == 13) {
      $('#search_icon').trigger('click');
    }
  })
  
  $('#search_icon').on('click', function (ev) {
    let codigo = $('#search_input').val();
    
    $.ajax({
      method: 'get',
      url: '/searchProjects?codigo=' + codigo,
    }).done(function (res) {
      console.log(res.data);
      if (!res.data.length) {
        let participantesHtml = `
        <div class="row">
          <div class="col-lg-12 text-center">
            <h2 class="section-heading text-uppercase">${codigo}</h2>
            <h3 class="section-subheading text-muted">Ésta cédula no ha sido participante en algún proyecto.</h3>
          </div>
        </div>
        `;
        document.getElementById('constanciasList').innerHTML = participantesHtml;
        return 1;
      }
      let participantesHtml = `
      <div class="row">
        <div class="col-lg-12 text-center">
          <h2 class="section-heading text-uppercase">${res.data[0].nombre + ' ' + res.data[0].apellido}</h2>
          <h3 class="section-subheading text-muted">Lista de proyectos en los que ha sido participante</h3>
        </div>
      </div>
      <table class="table">
        <thead>
          <tr class="text-center">
            <td>Proyecto</td>
            <td>Tipo</td>
            <td>Rol</td>
            <td>Fecha Inicio</td>
            <td>Fecha Fin</td>
            <td>Constancia</td>
          </tr>
        </thead>
        <tbody class="text-center">
      `
      for (let i = 0; i < res.data.length; i++) {
        participantesHtml = participantesHtml + `
        <tr>
          <td>${res.data[i].nombreProyecto}</td>
          <td>${num2Tipo(res.data[i].tipo)}</td>
          <td>${num2Rol(res.data[i].rol)}</td>
          <td>${res.data[i].fechaInicio.split('T')[0]}</td>
          <td>${res.data[i].fechaFin.split('T')[0]}</td>
          <td><a href="/constancia?proyecto=${res.data[i].id}&participante=${res.data[i].cedula}" target="_blank"><i class="fas fa-file-download"></i></a></td>
        </tr>
        `;
      }

      participantesHtml += '</tbody></table>';
      document.getElementById('constanciasList').innerHTML = participantesHtml;
    }); // Fin ajax.done
  }); // Fin on click

  function num2Tipo(num) {
    switch (num) {
      case 1: return 'Extensión';
      case 2: return 'Socio Productivo';
      case 3: return 'Socio Comunitario';
      case 4: return 'Integrador';
    }
  }

  function num2Rol(num) {
    switch(num) {
      case 1: return 'Alumno'; break;
      case 2: return 'Tutor'; break;
      case 3: return 'Comunidad'; break;
    }
  }
});
