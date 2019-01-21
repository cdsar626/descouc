$(document).ready(function () {
  let allAreas;
  let actualId;
  $.ajax({
    method: 'get',
    url: '/getAreasPrioritarias'
  }).done(function (res) {
    console.log('done');
    allAreas = res.data;
    let listHtml = '';
    for (let i = 0; i < allAreas.length; i++) {
    listHtml += `<li class="list-group-item">${allAreas[i].descripcion}<div idArea='${allAreas[i].id}' class="btn-group float-right btnsArea" role="group"><button type="button" class="btn btn-secondary" data-toggle="modal" data-target="#editAreaModal">Modificar</button><button class="btn btn-danger" data-toggle="modal" data-target="#deleteAreaModal">Eliminar</button></div></li>`;
    }
    document.getElementById('areasList').innerHTML = listHtml;
    console.log(allAreas);
    // Para obtener el id del Area
    $('.btnsArea').on('click', '.btn', function (ev) {
      actualId = $(this).parent().attr('idArea');
      console.log(actualId)
    })
  });

  $('#editAreaModal').on('show.bs.modal', function () {
    $('#editAreaTextarea').val(getAreaById(actualId)[0].descripcion);
    $('#editArea').val(actualId);
  })
  
  $('#deleteAreaModal').on('show.bs.modal', function () {
    $('#deleteArea').val(actualId);
  })

  function getAreaById(id) {
    return allAreas.filter(x => x.id == id);
  }
});