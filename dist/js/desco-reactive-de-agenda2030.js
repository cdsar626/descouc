$(document).ready(function () {
  let allPlanes;
  let actualId;
  $.ajax({
    method: 'get',
    url: '/getAgenda2030'
  }).done(function (res) {
    allPlanes = res.data;
    let listHtml = '';
    for (let i = 0; i < allPlanes.length; i++) {
    listHtml += `<li class="list-group-item">${allPlanes[i].descripcion}<div idPlan='${allPlanes[i].id}' class="btn-group float-right btnsPlan" role="group"><button type="button" class="btn btn-secondary" data-toggle="modal" data-target="#editPlanModal">Modificar</button><button class="btn btn-danger" data-toggle="modal" data-target="#deletePlanModal">Eliminar</button></div></li>`;
    }
    document.getElementById('planesList').innerHTML = listHtml;
    console.log(allPlanes);
    // Para obtener el id del Plan
    $('.btnsPlan').on('click', '.btn', function (ev) {
      actualId = $(this).parent().attr('idPlan');
      console.log(actualId)
    })
  });

  $('#editPlanModal').on('show.bs.modal', function () {
    $('#editPlanTextarea').val(getPlanById(actualId)[0].descripcion);
    $('#editPlan').val(actualId);
  })
  
  $('#deletePlanModal').on('show.bs.modal', function () {
    $('#deletePlan').val(actualId);
  })

  function getPlanById(id) {
    return allPlanes.filter(x => x.id == id);
  }
});