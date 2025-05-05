import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const pdfDir = path.join(__dirname, '../uploads/pdf');
const excelDir = path.join(__dirname, '../uploads/excel');

export const getAllReports = async (req, res) => {
    const reports = [];

    // Read PDF files
    if (fs.existsSync(pdfDir)) {
        const pdfSubdirs = fs.readdirSync(pdfDir).filter(file => fs.statSync(path.join(pdfDir, file)).isDirectory());
        pdfSubdirs.forEach(subdir => {
            const subdirPath = path.join(pdfDir, subdir);
            const pdfFiles = fs.readdirSync(subdirPath).filter(file => file.endsWith('.pdf'));
            pdfFiles.forEach(filename => {
                reports.push({
                    nombreReporte: getReportName(filename),
                    tipoReporte: getReportType(subdirPath),
                    formato: 'pdf',
                    fechaRealizado: getCreationDate(filename),
                    filename: path.join(subdir, filename)
                });
            });
        });
    }

    // Read Excel files
    if (fs.existsSync(excelDir)) {
        const excelSubdirs = fs.readdirSync(excelDir).filter(file => fs.statSync(path.join(excelDir, file)).isDirectory());
        excelSubdirs.forEach(subdir => {
            const subdirPath = path.join(excelDir, subdir);
            const excelFiles = fs.readdirSync(subdirPath).filter(file => file.endsWith('.xlsx'));
            excelFiles.forEach(filename => {
                reports.push({
                    nombreReporte: getReportName(filename),
                    tipoReporte: getReportType(subdirPath),
                    formato: 'excel',
                    fechaRealizado: getCreationDate(filename),
                    filename: path.join(subdir, filename)
                });
            });
        });
    }

    if (reports.length > 0) {
        return res.status(200).json(reports);
    } else {
        return res.status(200).json("No hay reportes generados");
    }
};

function getReportName(filename) {
    if (filename.startsWith('Compras')) {
        return 'Reporte de compra';
    } else if (filename.startsWith('VentasAgrupadas')) {
        return 'Reporte de ventas por cliente';
    } else if (filename.startsWith('Ventas')) {
        return 'Reporte de ventas';
    } else if (filename.startsWith('Recibo')) {
        return 'Recibo de compra';
    }
    return 'Reporte desconocido';
}

function getReportType(ruta) {
    if (ruta.includes('Compras')) {
        return 'Compras';
    } else if (ruta.includes('Ventas')) {
        return 'Ventas';
    } else if (ruta.includes('Recibos')) {
        return 'Recibo';
    }
    return 'Desconocido';
}

function getCreationDate(filename) {
    const regex = /(\d{4}-\d{2}-\d{2}(?:-\d{2}-\d{2}-\d{2})?)/;
    const match = filename.match(regex);
    return match ? match[1].replace(/[-\s]/g, '-') : null;
}


