$(document).ready(function () {

  $('.fecha').text((new Date().toLocaleString()));

  let dataProyectos = [];
  let user;
  let tabla = $('#dataTable').DataTable({
    ajax: '/getProyectos',
    columns: [
      { data: 'id' },
      { data: 'nombreProyecto' },
      { data: 'responsables' },
      { data: 'estado' },
      { data: 'municipio' },
      { data: 'parroquia' },
      { data: 'tipo' },
      { data: 'status' },
    ],
    order: [[0, 'desc']],
    createdRow: function (row, data, dataIndex) {
      switch (data.tipo) {
        case 1: data.tipo = 'Extensión'; break;
        case 2: data.tipo = 'Socio Productivo'; break;
        case 3: data.tipo = 'Socio Comunitario'; break;
        case 4: data.tipo = 'Integrador'; break;
      }
      switch (data.status) {
        case 0: data.status = 'Devuelto para modificar'; break;
        case 1: data.status = 'Recibido'; break;
        case 2: data.status = 'En revision'; break;
        case 3: data.status = 'Rechazado'; break;
        case 4: data.status = 'Aprobado'; break;
        case 5: data.status = 'Finalizado'; break;
      }
    },
    rowCallback: function (row, data) {
      $('td:eq(6)', row).html(data.tipo);
      $('td:eq(7)', row).html(data.status);
      $('td:eq(2)', row).html(data.responsables.split('\n')[0]);
    },
  });

  // Cuando termina de ejecutar el ajax datatable
  tabla.on('xhr', function () {
    dataProyectos = tabla.ajax.json().data;
  });

  // Para mostrar los datos de un proyecto al hacer click en la tabla
  $('#dataTable tbody').on('click', 'tr', function () {
    let tr = $(this).closest('tr');
    let tdi = tr.find("i.fa");
    let row = tabla.row(tr);
    let rowData = row.data();

    $('#projectModal').addClass('isloading');
    $("#projectModal").modal('toggle');
    $('#projectModal').off('shown.bs.modal').on('shown.bs.modal', function () {

      let fields = {};
      fields.id = document.getElementById('projectModalLabel');
      fields.nombre = document.getElementById('projectModalNombre');
      fields.org = document.getElementById('projectModalOrgResponsable');
      fields.responsables = document.getElementById('projectModalResponsables');
      fields.estado = document.getElementById('projectModalEstado');
      fields.municipio = document.getElementById('projectModalMunicipio');
      fields.parroquia = document.getElementById('projectModalParroquia');
      fields.direccion = document.getElementById('projectModalDireccion');
      fields.benefD = document.getElementById('projectModalBenefD');
      fields.benefI = document.getElementById('projectModalBenefI');
      fields.areaAtencion = document.getElementById('projectModalAreaAtencion');
      fields.areaP = document.getElementById('projectModalAreaP');
      fields.planP = document.getElementById('projectModalPlanP');
      fields.planUC = document.getElementById('projectModalPlanUC');
      fields.agenda2030 = document.getElementById('projectModalAgenda2030');
      fields.tipoP = document.getElementById('projectModalTipoP');
      fields.duracion = document.getElementById('projectModalDuracion');
      fields.fechaI = document.getElementById('projectModalFechaI');
      fields.fechaF = document.getElementById('projectModalFechaF');
      fields.objGen = document.getElementById('projectModalObjGeneral');
      fields.objsEsp = document.getElementById('projectModalObjsEspecificos');
      fields.facultad = document.getElementById('projectModalFacultad');
      fields.filesHeads = document.getElementById('projectModalFilesHeads');
      fields.files = document.getElementById('tableProjectFiles');
      fields.pluses = document.getElementById('projectModalPluses');

      fields.id.innerText = 'Proyecto id: ' + rowData.id;
      fields.nombre.innerText = rowData.nombreProyecto;
      fields.org.innerText = rowData.orgResponsable;
      fields.responsables.innerText = rowData.responsables;
      fields.estado.innerText = rowData.estado;
      fields.municipio.innerText = rowData.municipio;
      fields.parroquia.innerText = rowData.parroquia;
      fields.direccion.innerText = rowData.direccion;
      fields.benefD.innerText = rowData.beneficiariosDirectos;
      fields.benefI.innerText = rowData.beneficiariosIndirectos;
      fields.areaAtencion.innerText = rowData.areaAtencion;
      fields.areaP.innerText = rowData.areaPrioritaria;
      fields.planP.innerText = rowData.planPatria;
      fields.planUC.innerText = rowData.planUC;
      fields.agenda2030.innerText = rowData.agenda2030;
      fields.tipoP.innerText = rowData.tipo;
      fields.duracion.innerText = rowData.duracionProyecto;
      fields.fechaI.innerText = (new Date(rowData.fechaInicio)) == 'Invalid Date' ? rowData.fechaInicio.split('T')[0] : (new Date(rowData.fechaInicio)).toLocaleDateString();
      fields.fechaF.innerText = (new Date(rowData.fechaFin)) == 'Invalid Date' ? rowData.fechaFin.split('T')[0] : (new Date(rowData.fechaFin)).toLocaleDateString();
      fields.objGen.innerText = rowData.objGeneral;
      fields.objsEsp.innerText = rowData.objsEspecificos;
      fields.facultad.innerText = facultad2Text(rowData.facultad);

      // Para mostrar los documentos del proyecto
      $.ajax({
        method: 'get',
        url: '/getDocsFromProject?id=' + rowData.id,
      }).done(function (res) {
        $('#projectModal').removeClass('isloading');
        rowData.files = res.data;
        // Obtenemos cuantos tipos de documentos tiene el proyecto
        let nTipos = [];
        for (let i = 0; i < res.data.length; i++) {
          if (!nTipos.find(x => x == res.data[i].tipo)) nTipos.push(res.data[i].tipo);
        };
        nTipos.sort();
        //Se obtiene un arreglo donde cada indice tiene todos los documentos de un mismo tipo
        let filesByTipo = [];
        let cabeceraHtml = '';
        for (let i = 0; i < nTipos.length; i++) {
          let cabecera = '';
          switch (nTipos[i]) {
            case 1: cabecera = 'Originales'; break;
            case 2: cabecera = 'Actualizados'; break;
            case 3: cabecera = 'Aval'; break;
            case 4: cabecera = 'Avances'; break;
            case 5: cabecera = 'Finales'; break;
          };
          if (cabecera != 'Avances') cabeceraHtml = cabeceraHtml + `<th colspan="${nTipos[i] < 3 ? 2 : 1}">${cabecera}</th>`;
          filesByTipo.push(res.data.filter(x => x.tipo == nTipos[i]));
        }
        fields.filesHeads.innerHTML = cabeceraHtml;
        // Obtenemos el maximo doc.numero 
        let maxNumero = Math.max.apply(Math, res.data.map(x => x.numero));
        let htmlFiles = '';
        // Armamos la tabla donde se muestran los archivos
        for (let k = 0; k < maxNumero; k++) {
          htmlFiles = htmlFiles + `<tr>`;
          for (let i = 0; i < filesByTipo.length; i++) {
            filesByTipo[i].sort((a, b) => a.numero - b.numero);
            if(filesByTipo[i][0].tipo == 3) {
              if (filesByTipo[i][k]) {
                console.log(filesByTipo[i][k]);
                htmlFiles = htmlFiles +
                `<td colspan="1"><a target="_blank" href="${filesByTipo[i][k].ruta}">Aval de aprobación</a></td>`;
              } else {
                htmlFiles = htmlFiles + '<td colspan="1"></td>'
              }
            } else if(filesByTipo[i][0].tipo == 5) {
              if (filesByTipo[i][k]) {
                console.log(filesByTipo[i][k]);
                htmlFiles = htmlFiles +
                `<td colspan="1"><a target="_blank" href="${filesByTipo[i][k].ruta}">Documento de cierre ${k+1}</a></td>`;
              }
            } else if(filesByTipo[i][0].tipo < 3){
              if (filesByTipo[i][k]) {
                console.log(filesByTipo[i][k]);
                htmlFiles = htmlFiles +
                `<td colspan="2"><a target="_blank" href="${filesByTipo[i][k].ruta}">Archivo ${filesByTipo[i][k].numero} - ${filesByTipo[i][k].nombreDoc}</a></td>`;
              } else {
                htmlFiles = htmlFiles + '<td colspan="2"></td>'
              }
            }
          }
          htmlFiles = htmlFiles + `</tr>`;
        }
        fields.files.innerHTML = htmlFiles;

        // PAra mostrar el select de estatus si aun no está aprobado
        let selectHtml = `
        <div class="input-group mb-3 descoDetails">
          <div class="input-group-prepend">
            <label class="input-group-text" for="status">Estatus</label>
          </div>
          <select required name="status" class="custom-select" id="status">
            <option value="0" ${status2Num(rowData.status) == 0 ? 'selected' : ''}>${num2Status(0)}</option>
            <option value="1" ${status2Num(rowData.status) == 1 ? 'selected' : ''}>${num2Status(1)}</option>
            <option value="2" ${status2Num(rowData.status) == 2 ? 'selected' : ''}>${num2Status(2)}</option>
            <option value="3" ${status2Num(rowData.status) == 3 ? 'selected' : ''}>${num2Status(3)}</option>
            <option value="4" ${status2Num(rowData.status) == 4 ? 'selected' : ''}>${num2Status(4)}</option>
            <option value="5" ${status2Num(rowData.status) == 5 ? 'selected' : ''}>${num2Status(5)}</option>
          </select>
        </div>
        <div id="avalPlus"></div>
        <input class="btn btn-primary btn-block descoDetails" type="submit" value="Actualizar">`;
        let textStatusHtml = `
        <div class="form-group descoDetails" >
          <div class="form-label-group mx-auto" style="width: fit-content">
            <input value="${rowData.status}" id="status" class="form-control text-center" placeholder="Estatus" disabled name="status">
            <label for="status">Estatus</label>
          </div>
        </div>
        <br>`

        // Para mostrar detalles segun estatus
        let plusesHtml = '';
        plusesHtml =
        `<br><table id="projectPluses" class="table-bordered no-prob"
      cellpadding="5" cellspacing="0" border="0"
      style="padding-left:50px; margin:auto;">
        <tr>
          <td>Fecha de envío del proyecto:</td>
          <td>${(new Date(rowData.fechaEnvio)).toLocaleDateString()}</td>
        </tr>
        <tr>
          <td>Fecha de última actualización de estatus:</td>
          <td>${(new Date(rowData.fechaStatus)).toLocaleDateString()}</td>
        </tr>
        </table>
        <br>
        <form method="post" action="/descoUpdate" enctype="multipart/form-data">
          <input class="d-none" name="id" value="${rowData.id}"></id>
          <div class="form-group descoDetails">
            <label for="nota">Nota  para el usuario que subió el proyecto</label>
            <textarea ${status2Num(rowData.status) >= 4? 'disabled' : ''} class="form-control descoDetails" id="nota" name="nota">${rowData.nota ? rowData.nota : ''}</textarea>
          </div>
          <br>
          ${status2Num(rowData.status) >= 4? textStatusHtml : selectHtml}
        </form>`;

      /*
        // Si está aprobado & no ha subido el aval
        if (status2Num(rowData.status) >= 4 && !(filesByTipo.find(x => x[0].tipo == 3)) ) { // Falta modificar para que ingrese aval, no cualquier archivo
          plusesHtml = plusesHtml +
            `<span>Subir aval de aprobación.</span>
            <form method="post" action="/subirAval" enctype="multipart/form-data">
          <input class="d-none" type="text" name="nombreProyecto" value="${rowData.nombreProyecto}"/>
          <input class="d-none" name="tipo" value="${tipo2Num(rowData.tipo)}"/>
          <input class="d-none" name="refProyecto" value="${rowData.id}"/>`;
            plusesHtml = plusesHtml + `
            <div class="input-group mb-3">
              <div class="input-group-prepend">
                <span class="input-group-text">Aval</span>
              </div>
              <div class="custom-file">
                <input type="file" class="custom-file-input" name="aval" id="aval" accept=".pdf, .doc, .docx, .xlsx, .xls, .jpg">
                <label id="avalLabel" class="custom-file-label" for="aval">Escoger Archivo PDF, Word, Excel</label>
              </div>
            </div>`
          plusesHtml = plusesHtml +
            `
            <input class="btn btn-primary mx-auto d-block" type="submit" value="Actualizar">
          </form>`;
        }
*/
        fields.pluses.innerHTML = plusesHtml;

        $('#status').on('change', function(ev) {
          console.log(this.value);
          if(this.value == 4) {
            $('#avalPlus').html(`
            <span>Subir aval de aprobación.</span>
            <form method="post" action="/subirAval" enctype="multipart/form-data">
              <input class="d-none" type="text" name="nombreProyecto" value="${rowData.nombreProyecto}"/>
              <input class="d-none" name="tipo" value="${tipo2Num(rowData.tipo)}"/>
              <input class="d-none" name="refProyecto" value="${rowData.id}"/>
              <div class="input-group mb-3">
                <div class="input-group-prepend">
                  <span class="input-group-text">Aval</span>
                </div>
                <div class="custom-file">
                  <input type="file" class="custom-file-input" name="aval" id="aval" accept=".pdf, .doc, .docx, .xlsx, .xls, .jpg">
                  <label id="avalLabel" class="custom-file-label" for="aval">Escoger Archivo PDF, Word, Excel</label>
                </div>
              </div>`
            );
            $('.custom-file-input').change(function (e) {
              let campoInputFile = document.getElementById('aval' + 'Label');
              campoInputFile.innerText = $('#' + 'aval').val().replace('C:\\fakepath\\', '');
            });
          } else {
            $('#avalPlus').html('');
          }
        })

        // Si esta aprobado
        if(status2Num(rowData.status) >= 4) {
          fields.pluses.innerHTML = fields.pluses.innerHTML + 
          `<div class="text-right text-white">
            <a id="showParticipantes" class="btn btn-info 2ndModal">Ver participantes</a>
            <a id="showAvances" class="btn btn-info 2ndModal">Ver avances</a>
          </div>`;
        
          $('.2ndModal').on('click', function(ev) {
            ev.preventDefault();
            let altura = document.getElementById('projectModal').scrollTop;
            let projectModal = $('#projectModal');
            let targetModal;
            switch(this.innerText){
              case 'Ver participantes': targetModal = $('#participantesModal'); break;
              case 'Ver avances': targetModal = $('#avancesModal'); break;
            }

            projectModal.modal('hide');
            projectModal.on('hidden.bs.modal', function () {
              targetModal.modal('show');
              projectModal.off('hidden.bs.modal');
            });
            targetModal.on('hidden.bs.modal', function () {
              projectModal.modal('show');
              projectModal.on('shown.bs.modal', function () {
                this.scrollTop = altura; // Baja el modal hasta el final
                projectModal.off('shown.bs.modal');
              });
              targetModal.off('hidden.bs.modal');
            });
          });
        } // fin if(aprobado)

        // Definicion del comportamiento al abrir los diferentes modales
        let avancesModal = $('#avancesModal');
        let participantesModal = $('#participantesModal');

        participantesModal.off('show.bs.modal').on('show.bs.modal', function() {
          let participantesHtml = `
          <table class="table">
            <thead>
              <tr class="text-center">
                <td>Nombre</td>
                <td>Apellido</td>
                <td>Cedula</td>
                <td>Lugar</td>
                <td>Genero</td>
                <td>Nacimiento</td>
                <td>Constancia</td>
              </tr>
            </thead>
            <tbody class="text-center">
            
          `
          $('#participantesModalTitle').text(rowData.nombreProyecto);
          $.ajax({
            method: 'get',
            url: '/getParticipantesFromProject?id=' + rowData.id,
          }).done(function(res){
            for (let i = 0; i < res.data.length; i++) {
              participantesHtml = participantesHtml + `
              <tr>
                <td>${res.data[i].nombre}</td>
                <td>${res.data[i].apellido}</td>
                <td>${res.data[i].cedula}</td>
                <td>${res.data[i].lugar}</td>
                <td>${res.data[i].genero}</td>
                <td>${(new Date(res.data[i].nacimiento)).toLocaleDateString()}</td>
                <td><a href="/constancia?proyecto=${rowData.id}&participante=${res.data[i].cedula}" target="_blank"><i class="fas fa-file-download"></i></a></td>
              </tr>
              `;
            }
            participantesHtml += '</tbody></table>';
            document.getElementById('participantesModalBody').innerHTML = participantesHtml;
          });
        });

        avancesModal.off('show.bs.modal').on('show.bs.modal', function() {
          let avancesHtml = '';
          $('#avancesModalTitle').text(rowData.nombreProyecto);
          $.ajax({
            method:'get',
            url: '/getAvancesFromProject?id=' + rowData.id,
          }).done(function(res){
            for (let i = 0; i < res.data.length; i++) {
              // Verificación en caso de que haya avances pero no haya el aval
              let numTipo = filesByTipo[3] ? 3 : 2;
              let avancesIds = uniqueArrayDocsObjects(filesByTipo[numTipo]);
              let finalIds;
              if (filesByTipo[4]) finalIds = uniqueArrayDocsObjects(filesByTipo[4]);
              console.log(avancesIds);
              avancesHtml = avancesHtml + `
              <h6>Avance ${filesByTipo[4] ? (i+1) != res.data.length ? i+1 : 'Final' : i+1 } <small>${(new Date(res.data[i].fecha)).toLocaleDateString()}</small></h6>
              <div>
                  
                </div>
                <div>
                  ${res.data[i].nota}
                </div>
              `
              let docsFromiAvance = filesByTipo[numTipo].filter(x => x.refAvance == avancesIds[i]);
              console.log(docsFromiAvance);
              for(let j = 0; j < docsFromiAvance.length; j++) {
                avancesHtml = avancesHtml + `
                <a target="_blank" href="${docsFromiAvance[j].ruta}">Archivo ${j+1}: ${docsFromiAvance[j].nombreDoc}</a><br>
                `
              }
              // Si los archivos son avances finales y es la ultima iteracion
              if(filesByTipo[4] && i == res.data.length-1) {
                let docsFromFinal = filesByTipo[4].filter(x => x.refAvance == finalIds[0]);
                console.log(docsFromFinal);
                for(let j = 0; j < docsFromFinal.length; j++) {
                  avancesHtml = avancesHtml + `
                    <a target="_blank" href="${docsFromFinal[j].ruta}">Archivo ${j+1}: ${docsFromFinal[j].nombreDoc}</a><br>
                  `
                }
              }
              avancesHtml += '<hr>';
            }
            document.getElementById('avancesModalBody').innerHTML = avancesHtml;
          });
        }); // fin evento aparicion avances modal


        //colorear en rojo la tabla de estatus
        if (status2Num(rowData.status) == 0) $('#projectPluses').addClass('atention');

       
      });// fin ajax proyectos
    });// fin evento modal

  });// evento click table

  function status2Num(status) {
    switch(status) {
      case 'Devuelto para modificar': return 0; break;
      case 'Recibido': return 1; break;
      case 'En revision': return 2; break;
      case 'Rechazado': return 3; break;
      case 'Aprobado': return 4; break;
      case 'Finalizado': return 5; break;
    }
  }

  function num2Status(num) {
    switch(num) {
      case 0: return 'Devuelto para modificar'; break;
      case 1: return 'Recibido'; break;
      case 2: return 'En revision'; break;
      case 3: return 'Rechazado'; break;
      case 4: return 'Aprobado'; break;
      case 5: return 'Finalizado'; break;
    }
  }

  function tipo2Num(tipo) {
    switch(tipo) {
      case 'Extensión': return 1; break;
      case 'Socio Productivo': return 2; break;
      case 'Socio Comunitario': return 3; break;
      case 'Integrador': return 4; break;
    }
  }

  function facultad2Text(fac) {
    switch (fac) {
    case "FCJP": return 'Ciencias Jurídicas y Políticas (FCJP)';
    case "FCS": return 'Ciencias de la Salud (FCS)';
    case "FaCES": return 'Ciencias Económicas y Sociales (FaCES)';
    case "FaCE": return 'Ciencias de la Educación (FaCE)';
    case "FaCyT": return 'Experimental de Ciencia y Tecnología (FaCyT)';
    case "Ingenieria": return 'Ingeniería';
    case "Odontologia": return 'Odontología';
    case "Aragua_FCS": return 'Aragua - Ciencias de la Salud (FCS)';
    case "Aragua_FaCES": return 'Aragua - Ciencias Económicas y Sociales (FaCES)';
    case "Cojedes_FCS": return 'Cojedes - Ciencias de la Salud (FCS)';
    }
  }

  function uniqueArrayDocsObjects( ar ) {
    var j = {};
  
    ar.forEach( function(v) {
      j[v.refAvance+ '::' + typeof v.refAvance] = v.refAvance;
    });
  
    return Object.keys(j).map(function(v){
      return j[v];
    });
  } 

  // Para crear filtro de los proyectos
  let filtrosActivos = false;
  let filtros = document.getElementById('filtros');
  let filtrosHtml =`
  <div class="card mb-3 d-flex flex-row flex-wrap" id="filtrosContent">

    <div class="d-flex flex-column mr-3">

      <span><b>Subidos por:</b></span>
      <ul class="ulFiltro">
        <li><span><small><i class="fas fa-angle-right fa-xs fa-fw"></i> <a class="aFiltro aFiltroFacultad">Ciencias Jurídicas y Políticas (FCJP)</a></small></span></li>
        <li><span><small><i class="fas fa-angle-right fa-xs fa-fw"></i> <a class="aFiltro aFiltroFacultad">Ciencias de la Salud (FCS)</a></small></span></li>
        <li><span><small><i class="fas fa-angle-right fa-xs fa-fw"></i> <a class="aFiltro aFiltroFacultad">Ciencias Económicas y Sociales (FaCES)</a></small></span></li>
        <li><span><small><i class="fas fa-angle-right fa-xs fa-fw"></i> <a class="aFiltro aFiltroFacultad">Ciencias de la Educación (FaCE)</a></small></span></li>
        <li><span><small><i class="fas fa-angle-right fa-xs fa-fw"></i> <a class="aFiltro aFiltroFacultad">Experimental de Ciencia y Tecnología (FaCyT)</a></small></span></li>
        <li><span><small><i class="fas fa-angle-right fa-xs fa-fw"></i> <a class="aFiltro aFiltroFacultad">Ingeniería</a></small></span></li>
        <li><span><small><i class="fas fa-angle-right fa-xs fa-fw"></i> <a class="aFiltro aFiltroFacultad">Odontología</a></small></span></li>
        <li><span><small><i class="fas fa-angle-right fa-xs fa-fw"></i> <a class="aFiltro aFiltroFacultad">Aragua - Ciencias de la Salud (FCS)</a></small></span></li>
        <li><span><small><i class="fas fa-angle-right fa-xs fa-fw"></i> <a class="aFiltro aFiltroFacultad">Aragua - Ciencias Económicas y Sociales (FaCES)</a></small></span></li>
        <li><span><small><i class="fas fa-angle-right fa-xs fa-fw"></i> <a class="aFiltro aFiltroFacultad">Cojedes - Ciencias de la Salud (FCS)</a></small></span></li>
      </ul>

      <span><b>Tipo:</b></span>
      <ul class="ulFiltro">
        <li><span><small><i class="fas fa-angle-right fa-xs fa-fw"></i> <a class="aFiltro aFiltroTipo">Extensión</a></small></span></li>
        <li><span><small><i class="fas fa-angle-right fa-xs fa-fw"></i> <a class="aFiltro aFiltroTipo">Socio Productivo</a></small></span></li>
      </ul>

      <span><b>Estatus:</b></span>
      <ul class="ulFiltro">
        <li><span><small><i class="fas fa-angle-right fa-xs fa-fw"></i> <a class="aFiltro aFiltroEstatus">Recibido</a></small></span></li>
        <li><span><small><i class="fas fa-angle-right fa-xs fa-fw"></i> <a class="aFiltro aFiltroEstatus">En revision</a></small></span></li>
      </ul>

    </div>
    <div class="d-flex flex-column mr-3">

      <span><b>Fecha de Envio (rango):</b></span>
      <div class="input-daterange input-group input-group-sm" id="filtroFechaEnvio">
        <input type="text" class="input-sm form-control" id="filtroFechaEnvioInicio" placeholder="Inicio Rango"/>
        <input type="text" class="input-sm form-control" id="filtroFechaEnvioFin" placeholder="Fin Rango"/>
      </div>
      <button class="btn btn-primary btnFiltroFecha" id="btnFiltroFechaEnvio">Filtrar</button>

      <span><b>Fecha de Inicio (rango):</b></span>
      <div class="input-daterange input-group input-group-sm" id="filtroFechaInicio">
        <input type="text" class="input-sm form-control" id="filtroFechaInicioInicio" placeholder="Inicio Rango"/>
        <input type="text" class="input-sm form-control" id="filtroFechaInicioFin" placeholder="Fin Rango"/>
      </div>
      <button class="btn btn-primary btnFiltroFecha" id="btnFiltroFechaInicio">Filtrar</button>

      <span><b>Fecha de Fin (rango):</b></span>
      <div class="input-daterange input-group input-group-sm" id="filtroFechaFin">
        <input type="text" class="input-sm form-control" id="filtroFechaFinInicio" placeholder="Inicio Rango"/>
        <input type="text" class="input-sm form-control" id="filtroFechaFinFin" placeholder="Fin Rango"/>
      </div>
      <button class="btn btn-primary btnFiltroFecha" id="btnFiltroFechaFin">Filtrar</button>

      <span class="invisible">Tipo:</span>
      <ul class="ulFiltro">
        <li><span><small><i class="fas fa-angle-right fa-xs fa-fw"></i> <a class="aFiltro aFiltroTipo">Socio Comunitario</a></small></span></li>
        <li><span><small><i class="fas fa-angle-right fa-xs fa-fw"></i> <a class="aFiltro aFiltroTipo">Integrador</a></small></span></li>
      </ul>

      <span class="invisible"><b>Estatus:</b></span>
      <ul class="ulFiltro">
        <li><span><small><i class="fas fa-angle-right fa-xs fa-fw"></i> <a class="aFiltro aFiltroEstatus">Rechazado</a></small></span></li>
        <li><span><small><i class="fas fa-angle-right fa-xs fa-fw"></i> <a class="aFiltro aFiltroEstatus">Aprobado</a></small></span></li>
      </ul>

    </div>
    <div class="d-flex flex-column mr-3 col-md-3">

      <span><b>Estado:</b></span>
      <div class="form-group">
        <select required id="ubiEstado" name="estado" placeholder="Estado"></select>
        <input class="d-none" id="estadoText" name="estadoText">
      </div>
      <button class="btn btn-primary btnFiltroLugar" id="btnFiltroEstado">Filtrar</button>

      <span><b>Municipio:</b></span>
      <div class="form-group">
        <select required id="ubiMunicipio" name="municipio" placeholder="Municipio" disabled></select>
        <input class="d-none" id="municipioText" name="municipioText">
      </div>
      <button class="btn btn-primary btnFiltroLugar" id="btnFiltroMunicipio">Filtrar</button>

      <span><b>Parroquia:</b></span>
      <div class="form-group">
        <select required id="ubiParroquia" name="parroquia" placeholder="Parroquia" disabled></select>
        <input class="d-none" id="parroquiaText" name="parroquiaText">
      </div>
      <button class="btn btn-primary btnFiltroLugar mb-3" id="btnFiltroParroquia">Filtrar</button>

      <span class="invisible"><b>Estatus:</b></span>
      <ul class="ulFiltro">
        <li><span><small><i class="fas fa-angle-right fa-xs fa-fw"></i> <a class="aFiltro aFiltroEstatus">Finalizado</a></small></span></li>
        <li><span><small><i class="fas fa-angle-right fa-xs fa-fw"></i> <a class="aFiltro aFiltroEstatus">Devuelto para modificar</a></small></span></li>
      </ul>

    </div>

    <div class="d-flex flex-column flex-fill ml-3 mr-3 mt-4 mb-3">
      <button class="btn btn-secondary btnFiltroLimpiar" id="btnFiltroLimpiar">Restaurar</button>
    </div>

  </div>
  `;
  
  $('#btnFiltros').on('click', function () {
    filtrosActivos = !filtrosActivos;
    this.innerText = filtrosActivos ? 'Ocultar Filtros' : 'Mostrar Filtros';
    if (filtrosActivos) {
      this.innerText = 'Ocultar Filtros';
      $(filtrosHtml).appendTo(filtros);
      if (typeof filtrosHtml === 'string') eventosFiltros();

    } else {
      this.innerText = 'Mostrar Filtros';
      filtrosHtml = $('#filtrosContent').detach();
    }
  })
  

  // filtros: ubicacion 
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
    allEstados = res.data.estados;
    allMunicipios = res.data.municipios;
    allParroquias = res.data.parroquias;
    allEstados.map(x => x.text = x.nombre); // para cumplir con la estructura de Select2
    allEstados.unshift({id:'', text: 'Estado',selected: true, disabled: true});
    $('#ubiEstado').html('').select2({
      placeholder: 'Estado',
      data: allEstados,
      width: '100%',
    });
  })

  function eventosFiltros() {
    // DatePickers
    $('#filtroFechaEnvio').datepicker({
      autoclose: true,
      todayHighlight: true,
      language: "es",
      clearBtn: true,
      maxViewMode: 2,
      startView: 2,
    });
    $('#filtroFechaInicio').datepicker({
      autoclose: true,
      todayHighlight: true,
      language: "es",
      clearBtn: true,
      maxViewMode: 2,
      startView: 2,
    });
    $('#filtroFechaFin').datepicker({
      autoclose: true,
      todayHighlight: true,
      language: "es",
      clearBtn: true,
      maxViewMode: 2,
      startView: 2,
    });
  
    // Selects
    $('#ubiEstado').html('').select2({
      placeholder: 'Estado',
      data: allEstados,
      width: '100%',
    });

    $('#ubiMunicipio').html('').select2({
      placeholder: 'Municipio',
      width: '100%',
    });

    $('#ubiParroquia').html('').select2({
      placeholder: 'Parroquia',
      width: '100%',
    });

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

    // Clicks para filtrar
    $('.btnFiltroFecha').on('click', function() {
      let tipo = this.id.split('a')[1]; // id == 'btnFiltroFecha' + ('Envio' | 'Inicio' | 'Fin')
      filtrarFecha(tipo);
    });

    $('.btnFiltroLimpiar').on('click', function() {
      tabla.clear();
      tabla.rows.add(dataProyectos);
      tabla.draw();
      $('#btnFiltros').trigger('click');
    });
    
    $('.btnFiltroLugar').on('click', function() {
      let tipo = this.id.split('Filtro')[1]; // id == 'btnFiltro' + lugar
      filtrarLugar(tipo);
    });

    $('.aFiltroFacultad').on('click', function() {
      filtrarFacultad(this.innerText);
    });

    $('.aFiltroTipo').on('click', function() {
      filtrarTipo(this.innerText);
    });

    $('.aFiltroEstatus').on('click', function() {
      console.log(dataProyectos);
      filtrarEstatus(this.innerText);
    });

  }
  
  function filtrarFecha(txt) { // txt == 'Envio' | 'Inicio' | 'Fin'
    if ($('#filtroFecha'+txt+'Inicio').val() && $('#filtroFecha'+txt+'Fin').val()) {
      let infoInicio = $('#filtroFecha'+txt+'Inicio').val().split(/\/|-/);
      let inicio = new Date(`${infoInicio[1]}/${infoInicio[0]}/${infoInicio[2]}`);
      let infoFin = $('#filtroFecha'+txt+'Fin').val().split(/\/|-/);
      let fin = new Date(`${infoFin[1]}/${infoFin[0]}/${infoFin[2]}`);

      let filtrados = dataProyectos.filter( x => {
        let fechaEnvio = new Date(x['fecha'+txt]);
        return inicio < fechaEnvio && fechaEnvio < fin;
      });
      
      tabla.clear();
      tabla.rows.add(filtrados);
      tabla.draw();
      $('#btnFiltros').trigger('click');
    }
  }

  function filtrarLugar(txt) {
    txt = txt.toLowerCase();
    let lugar = document.getElementById(txt+'Text').value;
    if(lugar) {
      let filtrados = dataProyectos.filter( x => x[txt] == lugar);
  
      tabla.clear();
      tabla.rows.add(filtrados);
      tabla.draw();
      $('#btnFiltros').trigger('click');
    }
  }

  function filtrarFacultad(fac) {
    let filtrados = dataProyectos.filter(x => facultad2Text(x.facultad) == fac);
    tabla.clear();
    tabla.rows.add(filtrados);
    tabla.draw();
    $('#btnFiltros').trigger('click');
  }

  function filtrarTipo(tipo) {
    let filtrados = dataProyectos.filter(x => x.tipo == tipo);
    tabla.clear();
    tabla.rows.add(filtrados);
    tabla.draw();
    $('#btnFiltros').trigger('click');
  }

  function filtrarEstatus(estatus) {
    let filtrados = dataProyectos.filter(x => x.status == estatus);
    tabla.clear();
    tabla.rows.add(filtrados);
    tabla.draw();
    $('#btnFiltros').trigger('click');
  }
  
  function facultad2Text(fac) {
    switch (fac) {
    case "FCJP": return 'Ciencias Jurídicas y Políticas (FCJP)';
    case "FCS": return 'Ciencias de la Salud (FCS)';
    case "FaCES": return 'Ciencias Económicas y Sociales (FaCES)';
    case "FaCE": return 'Ciencias de la Educación (FaCE)';
    case "FaCyT": return 'Experimental de Ciencia y Tecnología (FaCyT)';
    case "Ingenieria": return 'Ingeniería';
    case "Odontologia": return 'Odontología';
    case "Aragua_FCS": return 'Aragua - Ciencias de la Salud (FCS)';
    case "Aragua_FaCES": return 'Aragua - Ciencias Económicas y Sociales (FaCES)';
    case "Cojedes_FCS": return 'Cojedes - Ciencias de la Salud (FCS)';
    }
  }
});