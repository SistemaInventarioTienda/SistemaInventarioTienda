import path from 'path';
import fs from 'fs/promises';

// Función para guardar una imagen en el servidor
export const saveImage = async (base64Image, fileName, folderPath) => {
    const match = base64Image.match(/^data:image\/(\w+);base64,/);
    if (!match) throw new Error("Formato de imagen inválido");
    const ext = match[1];
    const filePath = path.join(folderPath, `${fileName}.${ext}`);
    const base64Data = base64Image.replace(/^data:image\/\w+;base64,/, "");
    await fs.writeFile(filePath, Buffer.from(base64Data, "base64"));
    return filePath;
};

// Función para eliminar una imagen del servidor
export const deleteImage = async (filePath) => {
    try {
        await fs.access(filePath);
        await fs.unlink(filePath);
    } catch (error) {
        console.warn(`No se pudo eliminar el archivo: ${filePath}`, error.message);
    }
};