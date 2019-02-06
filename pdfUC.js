var documentoPDF = require('pdfkit');
var fs = require('fs');

module.exports.crearPDFUC = function (nombrePDF, rutaGuardar, rutaLogoIzquierdo, rutaLogoDerecho, nombreCompleto, cedula, rol, nombreProyecto, res){
    var pdf = new documentoPDF;

    //pdf.pipe(fs.createWriteStream(rutaGuardar+nombrePDF+'.pdf')); //para guardar el archivo
    pdf.moveDown(3);
    pdf
        .font('Times-Roman')
        .fontSize(15);
    pdf.text('UNIVERSIDAD DE CARABOBO', 
        {
            width: 450, 
            align: 'center' // tipo de alineación (left, center, right o justify)
        });
    pdf.text('República Bolivariana de Venezuela', 
        {
            width: 450, 
            align: 'center' // tipo de alineación (left, center, right o justify)
        });
    
    pdf.text('Dirección de Extensión y Servicio Comunitario', 
    {
        width: 450, 
        align: 'center' // tipo de alineación (left, center, right o justify)
    });
    pdf.moveDown(5);
    pdf.text('CONSTANCIA', 
    {
           
        align: 'center' // tipo de alineación (left, center, right o justify)
    });
    pdf.moveDown();
    /*
    pdf.text('Ciudadano: ' + receptor , 
    {
           
        align: 'left' // tipo de alineación (left, center, right o justify)
    });
    pdf.text( tituloReceptor, 
    {
           
        align: 'left' // tipo de alineación (left, center, right o justify)
    });
    */
    pdf.moveDown();
    pdf.moveDown();
    pdf.text('Por medio de la presente se hace constar que el ciudadano ' , 
    {
        align: 'justify', // tipo de alineación (left, center, right o justify)
        continued: true,
    }).font('Times-Bold').text(nombreCompleto + ', C.I. ' + cedula,
    {
        continued: true,
    }).font('Times-Roman').text(', participó en calidad de ', 
    {
        continued: true,
    }).font('Times-Bold').text(rol + ' ', 
    {
        continued: true,
    }).font('Times-Roman').text('en el Proyecto titulado: ',
    {
        continued: true,
    }).font('Times-Bold').text('"' + nombreProyecto + '"');
    pdf.moveDown();

    let now = new Date(Date.now());
    let mes = now.getMonth() + 1;
    switch(mes) {
        case 1: mes = 'Enero'; break;
        case 2: mes = 'Febrero'; break;
        case 3: mes = 'Marzo'; break;
        case 4: mes = 'Abril'; break;
        case 5: mes = 'Mayo'; break;
        case 6: mes = 'Junio'; break;
        case 7: mes = 'Julio'; break;
        case 8: mes = 'Agosto'; break;
        case 9: mes = 'Septiembre'; break;
        case 10: mes = 'Octubre'; break;
        case 11: mes = 'Noviembre'; break;
        case 12: mes = 'Diciembre'; break;
    };

    pdf.font('Times-Roman').text('Constancia emitida en Valencia, el ' + now.getDate() + ' de ' + mes + ' del año ' + now.getFullYear() + '.', 
    {
           
        align: 'justify' // tipo de alineación (left, center, right o justify)
    });
    pdf.moveDown(8);

    pdf.text('Prof. Everilda Arteaga', 
    {
           
        align: 'center' // tipo de alineación (left, center, right o justify)
    });
    pdf.text('Directora', 
    {
               
         align: 'center' // tipo de alineación (left, center, right o justify)
    });
    pdf.moveDown(5);
    pdf.fontSize(12);
    /*
    pdf.text(direccion, 
    {
               
        align: 'center' // tipo de alineación (left, center, right o justify)
    });
    pdf.text(telefono, 
    {
                   
        align: 'center' // tipo de alineación (left, center, right o justify)
    });
    */
// ancho de hoja 612~
    pdf.image(rutaLogoIzquierdo, 271, 20,  {
        width : 70,
        height :  90 
    });
/*
    pdf.image(rutaLogoDerecho, 500, 60,  {
        width : 50,
        height :  90 
    });
*/
    pdf.pipe(res);
    pdf.end();
};