$(document).ready(function () {

  $('.fecha').text((new Date().toLocaleString()));

  let dataProyectos = []
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

  tabla.on('xhr', function () {
    dataProyectos = tabla.ajax.json().data;
  });

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
      fields.areaP = document.getElementById('projectModalAreaP');
      fields.planP = document.getElementById('projectModalPlanP');
      fields.tipoP = document.getElementById('projectModalTipoP');
      fields.duracion = document.getElementById('projectModalDuracion');
      fields.fechaI = document.getElementById('projectModalFechaI');
      fields.fechaF = document.getElementById('projectModalFechaF');
      fields.objGen = document.getElementById('projectModalObjGeneral');
      fields.objsEsp = document.getElementById('projectModalObjsEspecificos');
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
      fields.areaP.innerText = rowData.areaPrioritaria;
      fields.planP.innerText = rowData.planPatria;
      fields.tipoP.innerText = rowData.tipo;
      fields.duracion.innerText = rowData.duracionProyecto;
      fields.fechaI.innerText = (new Date(rowData.fechaInicio)) == 'Invalid Date' ? rowData.fechaInicio.split('T')[0] : (new Date(rowData.fechaInicio)).toLocaleDateString();
      fields.fechaF.innerText = (new Date(rowData.fechaFin)) == 'Invalid Date' ? rowData.fechaFin.split('T')[0] : (new Date(rowData.fechaFin)).toLocaleDateString();
      fields.objGen.innerText = rowData.objGeneral;
      fields.objsEsp.innerText = rowData.objsEspecificos;

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
        <form method="post" action="/descoUpdate">
          <input class="d-none" name="id" value="${rowData.id}"></id>
          <div class="form-group descoDetails">
            <label for="nota">Nota  para el usuario que subió el proyecto</label>
            <textarea ${status2Num(rowData.status) >= 4? 'disabled' : ''} class="form-control descoDetails" id="nota" name="nota">${rowData.nota ? rowData.nota : ''}</textarea>
          </div>
          <br>
          ${status2Num(rowData.status) >= 4? textStatusHtml : selectHtml}
        </form>`;

      
        // Si está aprobado & no ha subido el aval
        if (status2Num(rowData.status) >= 4 && !(filesByTipo.find(x => x[0].tipo == 3)) ) { // Falta modificar para que ingrese aval, no cualquier archivo
          plusesHtml = plusesHtml +
            `<span>Subir aval de aprobación.</span>
            <form method="post" action="/subirAval" enctype="multipart/form-data">
          <input class="d-none" type="text" name="nombreProyecto" value="${rowData.nombreProyecto}"/>
          <input class="d-none" name="tipo" value="${tipo2Num(rowData.tipo)}"/>
          <input class="d-none" name="refProyecto" value="${rowData.id}"/>`;
            plusesHtml = plusesHtml +
              `<div class="input-group mb-3">
            <div class="input-group-prepend">
              <span class="input-group-text">Aval</span>
            </div>
            <div class="custom-file">
              <input type="file" class="custom-file-input" name="aval" id="aval" accept=".pdf, .doc, .docx, .xlsx, .xls">
              <label id="avalLabel" class="custom-file-label" for="aval">Escoger Archivo PDF, Word, Excel</label>
            </div>
          </div>`
          plusesHtml = plusesHtml +
            `<input class="btn btn-primary mx-auto d-block" type="submit" value="Actualizar">
          </form>`;
        }

        fields.pluses.innerHTML = plusesHtml;

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
                <h6>Avance ${ (i+1) != res.data.length ? i+1 : 'Final' } <small>${(new Date(res.data[i].fecha)).toLocaleDateString()}</small></h6>
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
                  <a target="_blank" href="${docsFromiAvance[j].ruta}">Archivo ${j+1}</a>
                `
              }
              if(filesByTipo[4] && i == res.data.length-1) {
                let docsFromFinal = filesByTipo[4].filter(x => x.refAvance == finalIds[0]);
                console.log(docsFromFinal);
                for(let j = 0; j < docsFromFinal.length; j++) {
                  avancesHtml = avancesHtml + `
                    <a target="_blank" href="${docsFromFinal[j].ruta}">Archivo ${j+1}</a>
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

        $('.custom-file-input').change(function (e) {
          let campoInputFile = document.getElementById('aval' + 'Label');
          campoInputFile.innerText = $('#' + 'aval').val().replace('C:\\fakepath\\', '');

        })
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

  function uniqueArrayDocsObjects( ar ) {
    var j = {};
  
    ar.forEach( function(v) {
      j[v.refAvance+ '::' + typeof v.refAvance] = v.refAvance;
    });
  
    return Object.keys(j).map(function(v){
      return j[v];
    });
  } 

});