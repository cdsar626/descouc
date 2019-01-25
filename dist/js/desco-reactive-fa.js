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
      fields.modificar = document.getElementById('btnModificar');
      fields.addAvancesNombre = document.getElementById('addAvancesNombreProyecto');
      fields.addAvancesTipo = document.getElementById('addAvancesTipo');
      fields.addAvancesRef = document.getElementById('addAvancesRefProyecto');
      fields.finalizarProyectoNombre = document.getElementById('finalizarProyectoNombreProyecto');
      fields.finalizarProyectoTipo = document.getElementById('finalizarProyectoTipo');
      fields.finalizarProyectoRef = document.getElementById('finalizarProyectoRefProyecto');

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
      fields.addAvancesNombre.value = rowData.nombreProyecto;
      fields.addAvancesTipo.value = tipo2Num(rowData.tipo);
      fields.addAvancesRef.value = rowData.id;
      fields.finalizarProyectoNombre.value = rowData.nombreProyecto;
      fields.finalizarProyectoTipo.value = tipo2Num(rowData.tipo);
      fields.finalizarProyectoRef.value = rowData.id;

      if(rowData.status == 'Recibido') {
        fields.modificar.innerHTML = `<a class="btn btn-primary" href="/modificar?proyecto=${rowData.id}">Modificar</a>`
      } else {
        fields.modificar.innerHTML = '';
      }

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

        // Para mostrar detalles segun estatus
        let plusesHtml = '';
        plusesHtml = `<br>
        <table id="projectPluses" class="table-bordered"
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
          <tr>
            <td>Estatus:</td>
            <td>${rowData.status}</td>
          </tr>
          <tr>
            <td>Nota:</td>
            <td>${rowData.nota ? rowData.nota:''}</td>
          </tr>
        </table>
        <br>`;

        // Si es para revisar v
        if(status2Num(rowData.status) == 0) {
          plusesHtml = plusesHtml + 
          `<form method="post" action="/actualizarDocs" enctype="multipart/form-data">
          <input class="d-none" type="text" name="nombreProyecto" value="${rowData.nombreProyecto}"/>
          <input class="d-none" name="tipo" value="${tipo2Num(rowData.tipo)}"/>
          <input class="d-none" name="refProyecto" value="${rowData.id}"/>`;
          for(let i = 0; i < maxNumero; i++){
            plusesHtml = plusesHtml + 
            `<div class="input-group mb-3">
            <div class="input-group-prepend">
              <span class="input-group-text">Archivo ${i+1}</span>
            </div>
            <div class="custom-file">
              <input type="file" class="custom-file-input" name="inputFile${i+1}" id="inputFile${i+1}" accept=".pdf, .doc, .docx, .xlsx">
              <label id="inputFile${i+1}Label" class="custom-file-label" for="inputFile${i+1}">Escoger Archivo PDF, Word, Excel</label>
            </div>
          </div>`
          }
          plusesHtml = plusesHtml + 
          `<input class="btn btn-primary mx-auto d-block" type="submit" value="Actualizar">
          </form>`;
        }
        
        fields.pluses.innerHTML = plusesHtml;
        
        // Si esta aprobado
        if(status2Num(rowData.status) >= 4) {
          fields.pluses.innerHTML = fields.pluses.innerHTML + 
          `<div class="text-right text-white">
          ${status2Num(rowData.status) == 4 ? '<a id="addParticipantes" class="btn btn-primary 2ndModal" style="float: left; margin-right: 5px;">Añadir participantes</a>' : ''}
          ${status2Num(rowData.status) == 4 ? '<a id="addAvances" class="btn btn-primary 2ndModal" style="float: left; margin-right: 5px;">Añadir avances</a>' : ''}
            <a id="showParticipantes" class="btn btn-info 2ndModal">Ver participantes</a>
            <a id="showAvances" class="btn btn-info 2ndModal">Ver avances</a>
          </div>
          `;
          if (status2Num(rowData.status) == 4  && rowData.avances > 0) {
            fields.pluses.innerHTML = fields.pluses.innerHTML +
            `<div class="text-right text-white mt-5">
              <a id="finalizarProyecto" class="btn btn-danger 2ndModal">Añadir avance de cierre y finalizar proyecto</a>
            </div>`;
          }
        
          $('.2ndModal').on('click', function(ev) {
            ev.preventDefault();
            let altura = document.getElementById('projectModal').scrollTop;
            let projectModal = $('#projectModal');
            let targetModal;
            switch(this.innerText){
              case 'Ver participantes': targetModal = $('#participantesModal'); break;
              case 'Ver avances': targetModal = $('#avancesModal'); break;
              case 'Añadir avances': targetModal = $('#addAvancesModal'); break;
              case 'Añadir participantes': targetModal = $('#addParticipantesModal'); break;
              case 'Añadir avance de cierre y finalizar proyecto': targetModal = $('#finalizarProyectoModal'); break;
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
          }); // fin evento click botones de modales
        } // fin if(aprobado)

        // Definicion del comportamiento al abrir los diferentes modales
        let addAvancesModal = $('#addAvancesModal');
        let addParticipantesModal = $('#addParticipantesModal');
        let avancesModal = $('#avancesModal');
        let finalizarModal = $('#finalizarProyectoModal');
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
        
        addParticipantesModal.off('show.bs.modal').on('show.bs.modal', function() {
          document.getElementById('addParticipantesRefProyecto').value = rowData.id;
           // cuando cambia el tipo de participante al agregar participante
          $('#tipoParticipante').off('change').on('change', function() {
            let lugarComunidadHtml = `
            <div id="placeholderLugar">
              <div class="form-group">
                <div class="form-label-group">
                  <input type="text" id="lugar" class="form-control" placeholder="Facultad o ubicación" required autofocus name="lugar">
                  <label for="lugar">Facultad o ubicación</label>
                </div>
              </div>
            </div>
            `;
            let lugarUcHtml = `
            <div class="input-group mb-3">
              <div class="input-group-prepend">
                <label class="input-group-text" for="lugar">Facultad</label>
              </div>
              <select required name="lugar" class="custom-select" id="lugar">
                <option value='' selected disabled>Escoge...</option>
                <option value='' disabled>-- Carabobo --</option>
                <option value="FCJP">Ciencias Jurídicas y Políticas (FCJP)</option>
                <option value="FCS">Ciencias de la Salud (FCS)</option>
                <option value="FaCES">Ciencias Económicas y Sociales (FaCES)</option>
                <option value="FaCE">Ciencias de la Educación (FaCE)</option>
                <option value="FaCyT">Experimental de Ciencia y Tecnología (FaCyT)</option>
                <option value="Ingenieria">Ingeniería</option>
                <option value="Odontologia">Odontología</option>
                <option value='' disabled>-- Aragua --</option>
                <option value="Aragua_FCS">Ciencias de la Salud (FCS)</option>
                <option value="Aragua_FaCES">Ciencias Económicas y Sociales (FaCES)</option>
                <option value='' disabled>-- Cojedes --</option>
                <option value="Cojedes_FCS">Ciencias de la Salud (FCS)</option>
              </select>
            </div>
            `;
            if(this.value == 3) {
              $('#placeholderLugar').html(lugarComunidadHtml);
            } else {
              $('#placeholderLugar').html(lugarUcHtml);
            }
          });
          $('#addParticipantesModalTitle').text(rowData.nombreProyecto);
        })
        
        addAvancesModal.off('show.bs.modal').on('show.bs.modal', function() {
          $('#addAvancesModalTitle').text(rowData.nombreProyecto);
        })
        
        finalizarModal.off('show.bs.modal').on('show.bs.modal', function() {
          $('#finalizarProyectoTitle').text(rowData.nombreProyecto);
          //let finalizarHtml = '';
        })

        //colorear en la tabla de estatus
        if(status2Num(rowData.status) == 0 || status2Num(rowData.status) == 3){
          $('#projectPluses').addClass('atention');
        } else {
          $('#projectPluses').addClass('no-prob');
        }
        //Si se cambia el archivo al estar en el estatus "esperando correccion"
        $('.custom-file-input').change(function(e) {
          let campoInputFile = document.getElementById(this.id + 'Label');
          if (campoInputFile) campoInputFile.innerText = $('#' + this.id).val().replace('C:\\fakepath\\','');
        })

      });// fin ajax proyectos

    });// fin evento shown modal proyecto

  });//fin evento click table


  // Empieza tratamiento de formulario de fecha
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
  for(let i = currDate.getFullYear() - 10; i <= currDate.getFullYear(); i++) {
    let opt = document.createElement('option');
    let opt2 = document.createElement('option');

    opt.value = i;
    opt.text = i;
    opt2.value = i;
    opt2.text = i;
    if (i == currDate.getFullYear()) {
      opt.setAttribute('selected','selected');
      opt2.setAttribute('selected','selected');
    }
    document.getElementById('anoInicio').appendChild(opt);
    document.getElementById('anoInicioF').appendChild(opt2);

  }

  // Set meses
  for (let i = 0; i < 12; i++){
    let opt = document.createElement('option');
    let opt2 = document.createElement('option');
    opt.value = i + 1;
    opt.text = months[i];
    opt2.value = i + 1;
    opt2.text = months[i];
    document.getElementById('mesInicio').appendChild(opt);
    document.getElementById('mesInicioF').appendChild(opt2);
  }
  
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
  })

  //Set dias inicio
  $('#mesInicioF').change( function() {
    let diasSelect = document.getElementById('diaInicioF');
    diasSelect.innerHTML = '';
    for(let i = 0; i < diasEn(this.value); i++) {
      let opt = document.createElement('option');
      opt.value = i + 1;
      opt.text = i + 1;
      document.getElementById('diaInicioF').appendChild(opt);
    }
  })

 

  function diasEn(mes) {
    switch(Number(mes)){
      case 1: case 3: case 5: case 7: case 8: case 10: case 12:
        return 31;
      case 4: case 6: case 9: case 11:
        return 30;
      case 2: return 28;
    }
  }

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

  // Obtiene un arreglo con los valores únicos de v.refAvance dentro de un arreglo de objetos
  function uniqueArrayDocsObjects( ar ) {
    var j = {};
  
    ar.forEach( function(v) {
      j[v.refAvance+ '::' + typeof v.refAvance] = v.refAvance;
    });
  
    return Object.keys(j).map(function(v){
      return j[v];
    });
  } 
 
  $('textarea').each(function () {
    this.setAttribute('style', 'height:60px;overflow-y:hidden;');
  }).on('input', function () {
    this.style.height = 'auto';
    this.style.height = (this.scrollHeight) + 'px';
  });

  $('#inputFile').change(function(e) {
    let campoInputFile = document.getElementsByClassName('custom-file-label')[0];
    if(document.getElementById('inputFile').files.length > 1) {
      campoInputFile.innerText = `${document.getElementById('inputFile').files.length} archivos seleccionados.`
    } else {
      campoInputFile.innerText = $('#inputFile').val().replace('C:\\fakepath\\','');
    }
  })

  $('#inputFileF').change(function(e) {
    let campoInputFile = document.getElementsByClassName('custom-file-label')[1];
    if(document.getElementById('inputFileF').files.length > 1) {
      campoInputFile.innerText = `${document.getElementById('inputFileF').files.length} archivos seleccionados.`
    } else {
      campoInputFile.innerText = $('#inputFileF').val().replace('C:\\fakepath\\','');
    }
  })


});
