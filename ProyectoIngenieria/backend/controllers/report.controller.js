import { getDateCR } from "../libs/date.js";
import Config from "../models/config.model.js";
import db from '../db.js';
import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { QueryTypes } from 'sequelize';
import XLSX from 'xlsx';

// See page sizes
// https://pdfkit.org/docs/paper_sizes.html

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const pdfDir = path.join(__dirname, '../uploads/pdf');
const excelDir = path.join(__dirname, '../uploads/excel');
// Create routes if they do not exist
if (!fs.existsSync(pdfDir)) {
    fs.mkdirSync(pdfDir, { recursive: true });
}
if (!fs.existsSync(excelDir)) {
    fs.mkdirSync(excelDir, { recursive: true });
}

export const createReport = async (req, res) => {

    const { EXTENSION = '', TYPE = '', MIN_FEC = '', MAX_FEC = '' } = req.body;

    // validate extension {PDF / EXCEL}
    if (EXTENSION === '' || (EXTENSION !== 'pdf' && EXTENSION !== 'xlsx'))
        return res.status(400).json({ message: "El formato a generar no es valido. Debe ser pdf o excel" })

    // validate dates
    const min_f = validateDate(MIN_FEC);
    const max_f = validateDate(MAX_FEC);
    if (!min_f.isValid || !max_f.isValid) {
        const message = "La fecha de inicio " + min_f.message + " y la fecha de corte " + max_f.message;
        return res.status(400).json({ message: message })
    }

    const currentDate = await getDateCR();
    const store = await Config.findAll();
    if (EXTENSION === 'pdf') {
        try {
            const outputPDF = await switchPDF(store, currentDate, TYPE, MIN_FEC, MAX_FEC)
            return res.status(outputPDF.status).json(outputPDF.data);
        } catch (error) {
            console.error("Error al generar el PDF:", error);
            return res.status(500).json({ message: "Error interno al generar el PDF." });
        }
    } else if (EXTENSION === 'xlsx') {
        try {
            const outputExcel = await switchEXCEL(store, currentDate, TYPE, MIN_FEC, MAX_FEC);
            return res.status(outputExcel.status).json(outputExcel.data);
        } catch (error) {
            console.error("Error al generar el PDF:", error);
            return res.status(500).json({ message: "Error interno al generar el PDF." });
        }
    }

    return res.status(400).json({ message: "El formato a generar no es valido. Debe ser pdf o excel" })
}

export const downloadReport = async (req, res) => {
    const fileName = req.query.file;
    if (!fileName) {
        return res.status(400).json({ error: "Nombre del archivo es requerido" });
    }

    let filePath;
    if (fileName.endsWith('.pdf')) {
        filePath = path.join(pdfDir, fileName);
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'inline; filename="' + fileName + '"');
    } else if (fileName.endsWith('.xlsx')) {
        filePath = path.join(excelDir, fileName);
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'inline; filename="' + fileName + '"'); // Intentando visualización inline
    } else {
        return res.status(400).json({ error: "Formato de archivo no soportado." });
    }

    if (!fs.existsSync(filePath)) {
        return res.status(404).json({ error: "Archivo no encontrado." });
    }

    try {
        const fileStream = fs.createReadStream(filePath);
        fileStream.pipe(res);

        fileStream.on('error', (err) => {
            console.error('Error al leer el archivo:', err);
            res.status(500).json({ error: 'Error al leer el archivo.' });
        });

    } catch (error) {
        console.error('Error inesperado al descargar el archivo:', error);
        res.status(500).json({ error: 'Error inesperado al descargar el archivo.' });
    }
}


function validateDate(dateString) {
    const validFormat = /^\d{4}-\d{2}-\d{2}$/.test(dateString);
    if (!validFormat) {
        return { isValid: false, message: 'tiene un formato inválido. Debe ser AAAA-MM-DD.' };
    }

    const dateObject = new Date(dateString);
    if (isNaN(dateObject.getTime())) {
        return { isValid: false, message: 'proporcionada no es válida.' };
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    dateObject.setHours(0, 0, 0, 0);

    if (dateObject > today) {
        return { isValid: false, message: 'no puede ser futura.' };
    }

    return { isValid: true, message: 'es válida.' };

}

// Function to create a PDF SALE
async function createReceiptPDF(currentDate, storeData, saleData) {
    return new Promise((resolve, reject) => {
        const title = "***Recibo***";

        const pageWidthPoints = 227;
        const pageHeightPoints = 623;
        const margin = 10;
        let currentY = margin;


        const doc = new PDFDocument({
            size: [pageWidthPoints, pageHeightPoints]
        });
        const fileName = `Recibo-${currentDate}.pdf`;
        const filePath = path.join(pdfDir, 'Recibos', fileName);
        if (!fs.existsSync(path.join(pdfDir, 'Recibos'))) {
            fs.mkdirSync(path.join(pdfDir, 'Recibos'), { recursive: true });
        }
        const writeStream = fs.createWriteStream(filePath);

        doc.pipe(writeStream);

        // Store Information (Header)
        doc.fontSize(10).text(storeData.DSC_NOMBRE, margin, currentY, { align: 'center', width: pageWidthPoints - 2 * margin });
        currentY += 12; // Space after name

        doc.fontSize(8).text(`Teléfono: ${storeData.NUM_TELEFONO}`, margin, currentY, { align: 'center', width: pageWidthPoints - 2 * margin });
        currentY += 10; // Space after phone

        doc.fontSize(8).text(storeData.DSC_CORREO, margin, currentY, { align: 'center', width: pageWidthPoints - 2 * margin });
        currentY += 10; // Space after email

        doc.fontSize(8).text(storeData.DSC_DIRECCION, margin, currentY, { align: 'center', width: pageWidthPoints - 2 * margin });
        currentY += 10; // Space after direction

        doc.fontSize(9).text(storeData.DSC_ESLOGAN, margin, currentY, { align: 'center', width: pageWidthPoints - 2 * margin, italic: true });
        currentY += 20; // Space after slogan


        // Title
        doc.fontSize(12).text(title, margin, currentY, { align: 'center', width: pageWidthPoints - 2 * margin });
        currentY += 15; // Space after title



        // Sale Details Table Header
        currentY += 5;
        doc.fontSize(7).text('Producto', margin, currentY, { width: 80 });
        doc.text('Cant.', margin + 85, currentY, { width: 30, align: 'right' });
        doc.text('Precio U.', margin + 120, currentY, { width: 45, align: 'right' });
        doc.text('Total', pageWidthPoints - margin - 40, currentY, { width: 40, align: 'right' });
        currentY += 8;
        doc.strokeColor('#000').lineWidth(0.5).moveTo(margin, currentY).lineTo(pageWidthPoints - margin, currentY).stroke();
        currentY += 3;

        // Sale Details Table Rows
        saleData.details.forEach(item => {
            const totalItem = item.CANTIDAD * item.MONT_UNITARIO;
            doc.fontSize(7).text(item.Product.DSC_NOMBRE, margin, currentY, { width: 80 });
            doc.text(item.CANTIDAD.toString(), margin + 85, currentY, { width: 30, align: 'right' });
            doc.text(item.MONT_UNITARIO.toFixed(2), margin + 120, currentY, { width: 45, align: 'right' });
            doc.text(totalItem.toFixed(2), pageWidthPoints - margin - 40, currentY, { width: 40, align: 'right' });
            currentY += 8;
            if (currentY > pageHeightPoints - 50) {
                doc.addPage({ size: [pageWidthPoints, pageHeightPoints] });
                currentY = margin + 10;
                // Optionally add header again on new page
            }
        });

        // Separator before totals
        currentY += 5;
        doc.strokeColor('#000').lineWidth(0.5).moveTo(margin, currentY).lineTo(pageWidthPoints - margin, currentY).stroke();
        currentY += 5;

        // Totals
        const subTotal = saleData.MONT_SUBTOTAL;
        const discount = (subTotal * ((saleData.PORCENT_DESCUENTO / subTotal) * 100)) / 100;
        const tax = (subTotal - discount) * (saleData.PORCENT_IMPUESTO / 100);
        console.log(subTotal, discount, tax);

        doc.fontSize(8).text('Subtotal:', margin, currentY, { align: 'right', width: pageWidthPoints - margin - 50 });
        doc.text(subTotal.toFixed(2), pageWidthPoints - margin - 40, currentY, { align: 'right', width: 40 });
        currentY += 8;

        doc.fontSize(8).text(`Impuesto (${saleData.PORCENT_IMPUESTO}%):`, margin, currentY, { align: 'right', width: pageWidthPoints - margin - 50 });
        doc.text(tax.toFixed(2), pageWidthPoints - margin - 40, currentY, { align: 'right', width: 40 });
        currentY += 8;

        doc.fontSize(8).text(`Descuento (${(saleData.PORCENT_DESCUENTO / saleData.MONT_SUBTOTAL) * 100}%):`, margin, currentY, { align: 'right', width: pageWidthPoints - margin - 50 });
        doc.text(`-${discount.toFixed(2)}`, pageWidthPoints - margin - 40, currentY, { align: 'right', width: 40 });
        currentY += 8;

        doc.fontSize(9).font('Helvetica-Bold').text('Total: ', margin, currentY, { align: 'right', width: pageWidthPoints - margin - 50 });
        doc.text((subTotal - discount + tax).toFixed(2), pageWidthPoints - margin - 40, currentY, { align: 'right', width: 40 });
        doc.font('Helvetica');
        currentY += 12;

        // Customer and Payment Information
        doc.fontSize(8).text(`Cliente: ${saleData.Client?.DSC_NOMBRE || "Anónimo"}`, margin, currentY, { width: pageWidthPoints - 2 * margin });
        currentY += 8;
        doc.fontSize(8).text(`Fecha: ${new Date(saleData.FEC_VENTA).toLocaleDateString()} ${new Date(saleData.FEC_VENTA).toLocaleTimeString()}`, margin, currentY, { width: pageWidthPoints - 2 * margin });
        currentY += 8;
        doc.fontSize(8).text(`Método de Pago: ${saleData.METODO_PAGO}`, margin, currentY, { width: pageWidthPoints - 2 * margin });
        currentY += 8;
        if (saleData.DSC_VENTA) {
            doc.fontSize(8).text(`Nota: ${saleData.DSC_VENTA}`, margin, currentY, { width: pageWidthPoints - 2 * margin });
            currentY += 8;
        }
        if (saleData.ESTADO_CREDITO === 1) {
            doc.fontSize(8).text('Estado: Cancelado', margin, currentY, { width: pageWidthPoints - 2 * margin });
            currentY += 8;
        } else {
            doc.fontSize(8).text('Estado: Pendiente', margin, currentY, { width: pageWidthPoints - 2 * margin });
            currentY += 8;
        }

        // Footer (Optional)
        currentY += 15;
        doc.fontSize(6).text('Gracias por su compra!', margin, currentY, { align: 'center', width: pageWidthPoints - 2 * margin });

        doc.end();

        writeStream.on("finish", () => {
            resolve({
                status: 200,
                data: {
                    message: "PDF generado exitosamente",
                    downloadLink: `http://localhost:4000/api/reports/download_pdf?file=Recibo/${fileName}`
                }
            });
        });

        writeStream.on("error", (error) => {
            console.error("Error en writeStream:", error);
            reject({ status: 500, data: { error: "Error al generar el PDF." } });
        });
    });
}

function formatDateTime(fechaHora) {
    return fechaHora.replace(/[:\s]/g, '-');
}

async function switchPDF(store, currentDate, type, MIN_FEC, MAX_FEC) {
    switch (type) {
        case 'ComprasXProveedor':
            const [shoppingBySupplier] = await db.query(
                'CALL getShoppingsReport(:MIN_FEC, :MAX_FEC)',
                {
                    replacements: {
                        MIN_FEC: MIN_FEC,
                        MAX_FEC: MAX_FEC
                    },
                    type: QueryTypes.SELECT
                });
            return await createShoppingPDF(currentDate, store[0], shoppingBySupplier, MIN_FEC, MAX_FEC);
        case 'VentasXCliente':
            const [salesByClient] = await db.query(
                'CALL getSaleReport(:MIN_FEC, :MAX_FEC)',
                {
                    replacements: {
                        MIN_FEC: MIN_FEC,
                        MAX_FEC: MAX_FEC
                    },
                    type: QueryTypes.SELECT
                });
            return await createSalePDF(currentDate, store[0], salesByClient, MIN_FEC, MAX_FEC);
        default:
            return ({ status: 400, data: { error: "Informe no valido para generar." } });
    }
}

async function createShoppingPDF(currentDate, storeData, shoppingData, MIN_FEC, MAX_FEC) {
    return new Promise((resolve, reject) => {
        const title = "Informe de Compras por Proveedor";
        const pageWidthPoints = 595.28;
        const pageHeightPoints = 841.89;
        const margin = 20;
        let currentY = margin + 20;
        let totalGastadoPeriodo = 0;

        const doc = new PDFDocument({
            size: 'A4'
        });
        const fileName = `Compras-${formatDateTime(currentDate)}.pdf`;
        const filePath = path.join(pdfDir, 'Compras', fileName);
        if (!fs.existsSync(path.join(pdfDir, 'Compras'))) {
            fs.mkdirSync(path.join(pdfDir, 'Compras'), { recursive: true });
        }
        const writeStream = fs.createWriteStream(filePath);

        doc.pipe(writeStream);

        // Encabezado del informe
        doc.fontSize(12).text(storeData.DSC_NOMBRE, margin, currentY, { align: 'center', width: pageWidthPoints - 2 * margin });
        currentY += 15;
        doc.fontSize(10).text(title, margin, currentY, { align: 'center', width: pageWidthPoints - 2 * margin });
        currentY += 15;
        doc.fontSize(8).text(`Periodo del informe: ${MIN_FEC} al ${MAX_FEC}`, margin, currentY, { align: 'center', width: pageWidthPoints - 2 * margin });
        currentY += 12;
        doc.fontSize(8).text(`Reporte generado: ${currentDate}`, margin, currentY, { align: 'center', width: pageWidthPoints - 2 * margin });
        currentY += 15; // Espacio después de la fecha del reporte

        // Convertir el objeto shoppingData a un array
        const comprasArray = Object.values(shoppingData);

        // Agrupar compras por proveedor
        const comprasPorProveedor = comprasArray.reduce((acc, compra) => {
            const proveedor = compra.PROVEEDOR;
            if (!acc[proveedor]) {
                acc[proveedor] = {
                    nombre: proveedor,
                    telefono: compra.TEL_PROVEEDOR,
                    compras: []
                };
            }
            acc[proveedor].compras.push({
                fecha: compra.FEC_COMPRA,
                total: compra.MON_TOTAL,
                productos: compra.PRODUCTOS.split(',').map(p => p.trim()),
                cantidades: compra.CANTIDADES.split(',').map(c => c.trim())
            });
            return acc;
        }, {});

        // Tabla de compras por proveedor
        const tableTop = currentY;
        let rowY = tableTop;
        const proveedorX = margin;
        const telefonoX = proveedorX + 150;
        const fechaX = telefonoX + 150;
        const productoX = margin + 10;
        const cantidadX = productoX + 150;
        const montoX = pageWidthPoints - margin - 170;

        // Cabecera de la tabla
        doc.fontSize(9).font('Helvetica-Bold')
            .text('Proveedor', proveedorX, rowY)
            .text('Teléfono', telefonoX, rowY)
            .text('Fecha Compra', fechaX, rowY)
            .text('Monto Total', montoX - 100, rowY, { align: 'right' });
        rowY += 12;
        doc.strokeColor('#000').lineWidth(0.5).moveTo(margin, rowY).lineTo(pageWidthPoints - margin, rowY).stroke();
        rowY += 5;
        doc.font('Helvetica');

        // Filas de la tabla
        for (const proveedor in comprasPorProveedor) {
            const proveedorData = comprasPorProveedor[proveedor];
            doc.fontSize(9).font('Helvetica-Bold').text(proveedorData.nombre, proveedorX, rowY);
            doc.text(proveedorData.telefono, telefonoX, rowY);
            rowY += 10;
            doc.font('Helvetica');

            proveedorData.compras.forEach(compra => {
                doc.fontSize(8)
                    .text(compra.fecha, fechaX, rowY);

                const compraStartY = rowY;
                let lastProductY = rowY;

                compra.productos.forEach((producto, index) => {
                    doc.fontSize(8)
                        .text(`- ${producto}`, productoX, rowY);
                    if (compra.cantidades[index]) {
                        doc.text(`(${compra.cantidades[index]})`, cantidadX, rowY);
                    }
                    lastProductY = rowY;
                    rowY += 8;
                });

                // Dibujar el monto total después del último producto
                doc.fontSize(8).text(compra.total.toFixed(2), montoX, lastProductY, { align: 'right' });
                totalGastadoPeriodo += compra.total;

                const lineY = rowY + 2;
                doc.strokeColor('#ccc').lineWidth(0.5).lineJoin('miter').dash(5, { space: 5 }).moveTo(margin, lineY).lineTo(pageWidthPoints - margin, lineY).stroke();
                doc.undash();
                rowY += 8;
            });
            doc.moveDown();
        }

        // Mostrar el monto total gastado en el periodo
        currentY = rowY + 15;
        doc.fontSize(10).font('Helvetica-Bold').text(`Monto total del periodo: ${totalGastadoPeriodo.toFixed(2)}`, margin, currentY, { align: 'right' });
        doc.font('Helvetica');

        // Línea final del documento
        currentY += 15;
        doc.fontSize(8).text('***Ultima linea***', margin, currentY, { align: 'center', width: pageWidthPoints - 2 * margin });

        doc.end();

        writeStream.on("finish", () => {
            resolve({
                status: 200,
                data: {
                    message: "Informe de compras generado exitosamente",
                    downloadLink: `http://localhost:4000/api/reports/download_report?file=Compras/${fileName}`
                }
            });
        });

        writeStream.on("error", (error) => {
            console.error("Error al generar el informe de compras:", error);
            reject({ status: 500, data: { error: "Error al generar el informe de compras." } });
        });
    });
}

async function createSalePDF(currentDate, storeData, salesData, MIN_FEC, MAX_FEC) {
    return new Promise((resolve, reject) => {
        const title = "Informe de Ventas por Cliente";
        const pageWidthPoints = 595.28;
        const pageHeightPoints = 841.89;
        const margin = 20;
        let currentY = margin + 20;
        let totalVentasPeriodo = 0;

        const doc = new PDFDocument({
            size: 'A4'
        });
        const fileName = `Ventas-${formatDateTime(currentDate)}.pdf`;
        const filePath = path.join(pdfDir, 'Ventas', fileName);
        if (!fs.existsSync(path.join(pdfDir, 'Ventas'))) {
            fs.mkdirSync(path.join(pdfDir, 'Ventas'), { recursive: true });
        }
        const writeStream = fs.createWriteStream(filePath);

        doc.pipe(writeStream);

        // Encabezado del informe
        doc.fontSize(12).text(storeData.DSC_NOMBRE, margin, currentY, { align: 'center', width: pageWidthPoints - 2 * margin });
        currentY += 15;
        doc.fontSize(10).text(title, margin, currentY, { align: 'center', width: pageWidthPoints - 2 * margin });
        currentY += 15;
        doc.fontSize(8).text(`Periodo del informe: ${MIN_FEC} al ${MAX_FEC}`, margin, currentY, { align: 'center', width: pageWidthPoints - 2 * margin });
        currentY += 12;
        doc.fontSize(8).text(`Fecha del Reporte: ${currentDate}`, margin, currentY, { align: 'center', width: pageWidthPoints - 2 * margin });
        currentY += 25;

        // Convertir el objeto salesData a un array
        const ventasArray = Object.values(salesData);

        // Agrupar ventas por cliente
        const ventasPorCliente = ventasArray.reduce((acc, venta) => {
            const cliente = venta.CLIENTE || 'Cliente Anónimo';
            if (!acc[cliente]) {
                acc[cliente] = {
                    nombre: cliente,
                    telefono: venta.TEL_CLIENTE || 'N/A',
                    ventas: []
                };
            }
            const subtotal = venta.MONT_SUBTOTAL;
            const descuento = (subtotal * (venta.DESCUENTO / 100));
            const impuesto = (subtotal - descuento) * (venta.PORCENT_IMPUESTO / 100);
            acc[cliente].ventas.push({
                fecha: new Date(venta.FEC_VENTA).toLocaleDateString(),
                total: (venta.ESTADO === 1 && venta.ESTADO_CREDITO === 0) ? subtotal - descuento + impuesto : subtotal, 
                productos: venta.PRODUCTOS ? venta.PRODUCTOS.split(',').map(p => p.trim()) : [],
                cantidades: venta.CANTIDADES ? venta.CANTIDADES.split(',').map(c => c.trim()) : [],
                total_abono: venta.TOTAL_ABONOS || 0
            });
            return acc;
        }, {});

        // Tabla de ventas por cliente
        const tableTop = currentY;
        let rowY = tableTop;
        const clienteX = margin;
        const telefonoX = clienteX + 180;
        const fechaX = telefonoX + 120;
        const productoX = margin + 10;
        const cantidadX = productoX + 150;
        const montoX = pageWidthPoints - margin - 70;

        // Cabecera de la tabla
        doc.fontSize(9).font('Helvetica-Bold')
            .text('Cliente', clienteX, rowY)
            .text('Teléfono', telefonoX, rowY)
            .text('Fecha Venta', fechaX, rowY)
            .text('Monto Total', montoX - 100, rowY, { align: 'right' });
        rowY += 12;
        doc.strokeColor('#000').lineWidth(0.5).moveTo(margin, rowY).lineTo(pageWidthPoints - margin, rowY).stroke();
        rowY += 5;
        doc.font('Helvetica');

        // Filas de la tabla
        for (const cliente in ventasPorCliente) {
            const clienteData = ventasPorCliente[cliente];
            doc.fontSize(9).font('Helvetica-Bold').text(clienteData.nombre, clienteX, rowY);
            doc.text(clienteData.telefono, telefonoX, rowY);
            rowY += 10;
            doc.font('Helvetica');

            clienteData.ventas.forEach(venta => {
                doc.fontSize(8)
                    .text(venta.fecha, fechaX, rowY);

                const ventaStartY = rowY;
                let lastProductY = rowY;

                venta.productos.forEach((producto, index) => {
                    doc.fontSize(8)
                        .text(`- ${producto}`, productoX, rowY);
                    if (venta.cantidades[index]) {
                        doc.text(`(${venta.cantidades[index]})`, cantidadX, rowY);
                    }
                    lastProductY = rowY;
                    rowY += 8;
                });

                if(venta.total_abono === 0) {
                    doc.fontSize(8).text(venta.total.toFixed(2), montoX - 175, lastProductY, { align: 'right' });
                    totalVentasPeriodo += venta.total;
                } else {
                    doc.fontSize(8).text(venta.total_abono.toFixed(2) + " / " + venta.total.toFixed(2), montoX - 175, lastProductY, { align: 'right' });
                    totalVentasPeriodo += venta.total_abono;
                }
                

                const lineY = rowY + 2;
                doc.strokeColor('#ccc').lineWidth(0.5).lineJoin('miter').dash(5, { space: 5 }).moveTo(margin, lineY).lineTo(pageWidthPoints - margin, lineY).stroke();
                doc.undash();
                rowY += 8;
            });
            doc.moveDown();
        }

        // Mostrar el monto total de ventas en el periodo
        currentY = rowY + 15;
        doc.fontSize(10).font('Helvetica-Bold').text(`Monto total del periodo: ${totalVentasPeriodo.toFixed(2)}`, margin, currentY, { align: 'right' });
        doc.font('Helvetica');

        // Línea final del documento
        currentY += 15;
        doc.fontSize(8).text('***Ultima linea***', margin, currentY, { align: 'center', width: pageWidthPoints - 2 * margin });

        doc.end();

        writeStream.on("finish", () => {
            resolve({
                status: 200,
                data: {
                    message: "Informe de ventas por cliente generado exitosamente",
                    downloadLink: `http://localhost:4000/api/reports/download_report?file=Ventas/${fileName}`
                }
            });
        });

        writeStream.on("error", (error) => {
            console.error("Error al generar el informe de ventas:", error);
            reject({ status: 500, data: { error: "Error al generar el informe de ventas." } });
        });
    });

}

async function createShoppingEXCEL(currentDate, storeData, shoppingData, MIN_FEC, MAX_FEC) {
    return new Promise((resolve, reject) => {
        try {
            const fileName = `Compras-${formatDateTime(currentDate)}.xlsx`;
            const filePath = path.join(excelDir, 'Compras', fileName);
            if (!fs.existsSync(path.join(excelDir, 'Compras'))) {
                fs.mkdirSync(path.join(excelDir, 'Compras'), { recursive: true });
            }

            const comprasArray = Object.values(shoppingData).reduce((acc, compra) => {
                const productos = compra.PRODUCTOS.split(',').map(p => p.trim());
                const cantidades = compra.CANTIDADES.split(',').map(c => c.trim());

                productos.forEach((producto, index) => {
                    acc.push({
                        Proveedor: compra.PROVEEDOR,
                        'Teléfono Proveedor': compra.TEL_PROVEEDOR,
                        'Fecha Compra': compra.FEC_COMPRA,
                        Producto: producto,
                        Cantidad: cantidades[index] || '',
                        'Monto Total Compra': compra.MON_TOTAL
                    });
                });
                return acc;
            }, []);

            const worksheet = XLSX.utils.json_to_sheet(comprasArray);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, 'Compras');
            XLSX.writeFile(workbook, filePath);

            resolve({
                status: 200,
                data: {
                    message: "Informe de compras generado exitosamente en Excel",
                    downloadLink: `http://localhost:4000/api/reports/download_report?file=Compras/${fileName}`
                }
            });

        } catch (error) {
            console.error("Error al generar el informe de compras en Excel:", error);
            reject({ status: 500, data: { error: "Error al generar el informe de compras en Excel." } });
        }
    });
}

async function createSaleEXCEL(currentDate, storeData, salesData, MIN_FEC, MAX_FEC) {
    return new Promise((resolve, reject) => {
        try {
            const fileName = `Ventas-${formatDateTime(currentDate)}.xlsx`;
            const filePath = path.join(excelDir, 'Ventas', fileName);
            if (!fs.existsSync(path.join(excelDir, 'Ventas'))) {
                fs.mkdirSync(path.join(excelDir, 'Ventas'), { recursive: true });
            }

            const ventasArray = Object.values(salesData).reduce((acc, venta) => {
                const productos = venta.PRODUCTOS ? venta.PRODUCTOS.split(',').map(p => p.trim()) : [];
                const cantidades = venta.CANTIDADES ? venta.CANTIDADES.split(',').map(c => c.trim()) : [];

                productos.forEach((producto, index) => {
                    acc.push({
                        Cliente: venta.CLIENTE || 'Cliente Anónimo',
                        'Teléfono Cliente': venta.TEL_CLIENTE || 'N/A',
                        'Fecha Venta': new Date(venta.FEC_VENTA).toLocaleDateString(),
                        Producto: producto,
                        Cantidad: cantidades[index] || '',
                        'Monto Subtotal': venta.MONT_SUBTOTAL,
                        Descuento: venta.DESCUENTO || 0,
                        'Impuesto (%)': venta.PORCENT_IMPUESTO,
                        'Método de Pago': venta.METODO_PAGO
                    });
                });
                return acc;
            }, []);

            const worksheet = XLSX.utils.json_to_sheet(ventasArray);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, 'Ventas');
            XLSX.writeFile(workbook, filePath);

            resolve({
                status: 200,
                data: {
                    message: "Informe de ventas generado exitosamente en Excel",
                    downloadLink: `http://localhost:4000/api/reports/download_report?file=Ventas/${fileName}`
                }
            });

        } catch (error) {
            console.error("Error al generar el informe de ventas en Excel:", error);
            reject({ status: 500, data: { error: "Error al generar el informe de ventas en Excel." } });
        }
    });
}

async function switchEXCEL(store, currentDate, type, MIN_FEC, MAX_FEC) {
    switch (type) {
        case 'ComprasXProveedor':
            const [shoppingBySupplier] = await db.query(
                'CALL getShoppingsReport(:MIN_FEC, :MAX_FEC)',
                {
                    replacements: {
                        MIN_FEC: MIN_FEC,
                        MAX_FEC: MAX_FEC
                    },
                    type: QueryTypes.SELECT
                }
            );
            return await createShoppingEXCEL(currentDate, store[0], shoppingBySupplier, MIN_FEC, MAX_FEC);
        case 'VentasXCliente':
            const [salesByClient] = await db.query(
                'CALL getSaleReport(:MIN_FEC, :MAX_FEC)',
                {
                    replacements: {
                        MIN_FEC: MIN_FEC,
                        MAX_FEC: MAX_FEC
                    },
                    type: QueryTypes.SELECT
                }
            );
            return await createSaleEXCEL(currentDate, store[0], salesByClient, MIN_FEC, MAX_FEC);
        default:
            return ({ status: 400, data: { error: "Informe no valido para generar en Excel." } });
    }
}
