import { getDateCR } from "../libs/date.js";
import Config from "../models/config.model.js";

import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

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

export const getReport = async (req, res) => {

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
    if (EXTENSION === 'pdf') {
        try {
            const store = await Config.findAll();
            const outputPDF = await createPDF("***Recibo***", "Contenido del primer pdf", formatDateTime(currentDate), null, store[0]);
            return res.status(outputPDF.status).json(outputPDF.data);
        } catch (error) {
            console.error("Error al generar el PDF:", error);
            return res.status(500).json({ message: "Error interno al generar el PDF." });
        }
    } else if (EXTENSION === 'xlsx') {
        return res.status(501).json({ message: "La generación de archivos Excel aún no está implementada." });
    }

    return res.status(400).json({ message: "El formato a generar no es valido. Debe ser pdf o excel" })
}

export const downloadReport = async (req, res) => {
    const fileName = req.query.file;
    if (!fileName) {
        return res.status(400).json({ error: "Nombre del archivo es requerido" });
    }

    const filePath = path.join(pdfDir, fileName);
    if (!fs.existsSync(filePath)) {
        return res.status(404).json({ error: "Archivo no encontrado." });
    }

    try {
        // Set the headers to indicate that the response is a PDF for viewing
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'inline; filename="' + fileName + '"'); // 'inline' force visualization

        // Create a read stream of the file and send it directly as a response
        const fileStream = fs.createReadStream(filePath);
        fileStream.pipe(res);

        // Handling file read errors
        fileStream.on('error', (err) => {
            console.error('Error al leer el archivo PDF:', err);
            res.status(500).json({ error: 'Error al leer el archivo PDF.' });
        });

    } catch (error) {
        console.error('Error inesperado al visualizar el PDF:', error);
        res.status(500).json({ error: 'Error inesperado al visualizar el PDF.' });
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

// Function to create a PDF
async function createPDF(title, content, currentDate, pageWidth, storeData) {
    return new Promise((resolve, reject) => {
        if (!title || !content) {
            return reject({ status: 400, data: { error: "Titulo y contenido requerido para generar el pdf." } });
        }

        const pageWidthPoints = pageWidth || 227;
        const pageHeightPoints = 623;
        const margin = 10;
        let currentY = margin;


        const doc = new PDFDocument({
            size: [pageWidthPoints, pageHeightPoints]
        });
        const fileName = `${currentDate}_op.pdf`;
        const filePath = path.join(pdfDir, fileName);
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



        // Separator line at the end of the content (optional)
        doc.strokeColor('#000').lineWidth(0.5).moveTo(margin, currentY + 5).lineTo(pageWidthPoints - margin, currentY + 5).stroke();

        doc.end();

        writeStream.on("finish", () => {
            resolve({
                status: 200,
                data: {
                    message: "PDF generado exitosamente",
                    downloadLink: `http://localhost:4000/api/reports/download_pdf?file=${fileName}`
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