// logger.js
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Obtener la ruta del directorio actual
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ruta correcta del archivo de log
const logFilePath = path.join(__dirname, 'errorsLog.txt');

// Asegurarse de que la carpeta exista (opcional)
if (!fs.existsSync(__dirname)) {
    fs.mkdirSync(__dirname, { recursive: true });
}

export function logError(errorMessage) {
    const timestamp = new Date().toISOString();
    const fullMessage = `[${timestamp}] ${errorMessage}\n`;

    fs.appendFile(logFilePath, fullMessage, (err) => {
        if (err) {
            console.error("No se pudo escribir el error en el archivo:", err);
        }
    });
}
