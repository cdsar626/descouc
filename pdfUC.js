var documentoPDF = require('pdfkit');
var fs = require('fs');

module.exports.crearPDFUC = function (nombrePDF, rutaGuardar, rutaLogoIzquierdo, rutaLogoDerecho,cabecera1,cabecera2,cabecera3,codigo,lugar,fecha,receptor,tituloReceptor,mensaje, emisor,tituloEmisor,direccion, telefono, res){
    var pdf = new documentoPDF;

    //pdf.pipe(fs.createWriteStream(rutaGuardar+nombrePDF+'.pdf')); //para guardar el archivo
    
    pdf
        .font('Times-Roman')
        .fontSize(15)
    pdf.text(cabecera1, 
        {
            width: 450, 
            align: 'center' // tipo de alineación (left, center, right o justify)
        });
    
    pdf.text(cabecera2, 
    {
        width: 450, 
        align: 'center' // tipo de alineación (left, center, right o justify)
    });
    pdf.text(cabecera3, 
    {
        width: 450, 
        align: 'center' // tipo de alineación (left, center, right o justify)
    });
    pdf.moveDown(5);
 
    pdf.text(codigo, 
    {
       
        align: 'left' // tipo de alineación (left, center, right o justify)
    });
    pdf.moveDown();
    pdf.text(lugar + ', ' + fecha , 
    {
           
        align: 'left' // tipo de alineación (left, center, right o justify)
    });
    pdf.moveDown();
    pdf.text('Ciudadano: ' + receptor , 
    {
           
        align: 'left' // tipo de alineación (left, center, right o justify)
    });
    pdf.text( tituloReceptor, 
    {
           
        align: 'left' // tipo de alineación (left, center, right o justify)
    });
    pdf.moveDown();
    pdf.moveDown();
    pdf.text(mensaje , 
    {
           
        align: 'justify' // tipo de alineación (left, center, right o justify)
    });
    pdf.moveDown();
    pdf.text('Atentamente: ', 
    {
           
        align: 'justify' // tipo de alineación (left, center, right o justify)
    });
    pdf.moveDown(7);

    pdf.text(emisor, 
    {
           
        align: 'center' // tipo de alineación (left, center, right o justify)
    });
    pdf.text(tituloEmisor, 
    {
               
         align: 'center' // tipo de alineación (left, center, right o justify)
    });
    pdf.moveDown(5);
    pdf.fontSize(12);
    pdf.text(direccion, 
    {
               
        align: 'center' // tipo de alineación (left, center, right o justify)
    });
    pdf.text(telefono, 
    {
                   
        align: 'center' // tipo de alineación (left, center, right o justify)
    });

    pdf.image(rutaLogoIzquierdo, 50, 60,  {
        width : 50,
        height :  90 
    });
    pdf.image(rutaLogoDerecho, 500, 60,  {
        width : 50,
        height :  90 
    });

    pdf.pipe(res);
    pdf.end();
};