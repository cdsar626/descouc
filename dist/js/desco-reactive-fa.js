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
    order: [[0, 'desc']],
    createdRow: function(row, data, dataIndex) {
      if (data.tipo == 1) {
        data.tipo = 'Servicio Comunitario';
      } else if (data.tipo == 2) {
        data.tipo = 'Extensión';
      }
      switch(data.status) {
        case 0: data.status = 'esperando correccion'; break;
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
        case 'esperando correccion': $('td:eq(5)', row).html('esperando correccion'); break;
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
    $('#projectModal').addClass('isloading');
    $("#projectModal").modal('toggle');
    $('#projectModal').off('shown.bs.modal').on('shown.bs.modal', function () {

      let fields = {};
      fields.id = document.getElementById('projectModalLabel');
      fields.nombre = document.getElementById('projectModalNombre');
      fields.org = document.getElementById('projectModalOrgResponsable');
      fields.responsables = document.getElementById('projectModalResponsables');
      fields.ubicacion = document.getElementById('projectModalUbGeo');
      fields.benefD = document.getElementById('projectModalBenefD');
      fields.benefI = document.getElementById('projectModalBenefI');
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
      fields.ubicacion.innerText = rowData.ubicacionGeografica;
      fields.benefD.innerText = rowData.beneficiariosDirectos;
      fields.benefI.innerText = rowData.beneficiariosIndirectos;
      fields.tipoP.innerText = rowData.tipoProyecto;
      fields.duracion.innerText = rowData.duracionProyecto;
      fields.fechaI.innerText = rowData.fechaInicio;
      fields.fechaF.innerText = rowData.fechaFin;
      fields.objGen.innerText = rowData.objGeneral;
      fields.objsEsp.innerText = rowData.objsEspecificos;

      // Para mostrar los documentos del proyecto
      $.ajax({
        method: 'get',
        url: '/getDocsFromProject?id='+rowData.id,
      }).done(function(res){
        $('#projectModal').removeClass('isloading');
        rowData.files = res.data;
        // Obtenemos cuantos tipos de documentos tiene el proyecto
        let nTipos = [];
        for( let i = 0; i < res.data.length; i++) {
          if(!nTipos.find(x => x == res.data[i].tipo)) nTipos.push(res.data[i].tipo);
        };
        nTipos.sort();
        //Se obtiene un arreglo donde cada indice tiene todos los documentos de un mismo tipo
        let filesByTipo = [];
        let cabeceraHtml = '';
        for( let i = 0; i < nTipos.length; i++) {
          let cabezera = '';
          switch(nTipos[i]){
            case 1: cabezera = 'Originales'; break;
            case 2: cabezera = 'Actualizados'; break;
            case 3: cabezera = 'Aval'; break;
            case 4: cabezera = 'Avances'; break;
            case 5: cabezera = 'Final'; break;
          };
          cabeceraHtml = cabeceraHtml + `<th>${cabezera}</th>`;
          filesByTipo.push(res.data.filter(x => x.tipo == nTipos[i]));
        }
        fields.filesHeads.innerHTML = cabeceraHtml;
        // Obtenemos el maximo doc.numero 
        let maxNumero = Math.max.apply(Math, res.data.map(x => x.numero));
        let htmlFiles = '';
        for(let k = 0; k < maxNumero; k++) {
          htmlFiles = htmlFiles + `<tr>`;
          for (let i = 0; i < filesByTipo.length; i++) {
            filesByTipo[i].sort((a,b) => a.numero - b.numero);
            if (filesByTipo[i][k]){
              htmlFiles = htmlFiles +
              `<td><a target="_blank" href="${filesByTipo[i][k].ruta}">Archivo ${filesByTipo[i][k].numero}</a></td>`;
            } else {
              htmlFiles = htmlFiles +
              `<td> ------- </td>`;
            }
          }
          htmlFiles = htmlFiles + `</tr>`;
        }
        fields.files.innerHTML = htmlFiles;

        // Para mostrar detalles segun estatus
        let plusesHtml = '';
        plusesHtml = `<br>
        <table id="projectPluses" class="table-bordered ${status2Num(rowData.status) == 0? 'atention':'no-prob'}"
        cellpadding="5" cellspacing="0" border="0"
        style="padding-left:50px; margin:auto;">
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
        if(status2Num(rowData.status) == 6) {
          fields.pluses.innerHTML = fields.pluses.innerHTML + 
          `<div class="text-right text-white">
            <a id="showParticipantes" class="btn btn-info 2ndModal" style="float: left; margin-right: 5px;">Ver participantes</a>
            <a id="showAvances" class="btn btn-info 2ndModal" style="float: left; margin-right: 5px;">Ver avances</a>
            <a id="addAvances" class="btn btn-primary 2ndModal">Añadir avances</a>
            <a id="addParticipantes" class="btn btn-primary 2ndModal">Añadir participantes</a>
          </div>`;
        
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

        //colorear en rojo la tabla de estatus
        if(status2Num(rowData.status) == 0) $('#projectPluses').addClass('atention');

        $('.custom-file-input').change(function(e) {
          let campoInputFile = document.getElementById(this.id + 'Label');
          campoInputFile.innerText = $('#' + this.id).val().replace('C:\\fakepath\\','');
        })

      });// fin ajax proyectos

    });// fin evento shown modal proyecto

  });//fin evento click table

  function status2Num(status) {
    switch(status) {
      case 'esperando correccion': return 0; break;
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
      case 0: return 'esperando correccion'; break;
      case 1: return 'recibido'; break;
      case 2: return 'para revisar'; break;
      case 3: return 'rechazado por desco'; break;
      case 4: return 'validado'; break;
      case 5: return 'rechazado por consejo'; break;
      case 6: return 'aprobado'; break;
    }
  }

  function tipo2Num(tipo) {
    switch(tipo) {
      case 'Servicio Comunitario': return 1; break;
      case 'Extensión': return 2; break;
    }
  }
 




});
