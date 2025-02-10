import path from 'path';
import fs from 'fs/promises';

// Función para guardar una imagen en el servidor
export const saveImage = async (base64Image, fileName, folderPath) => {
    const match = base64Image.match(/^data:image\/(\w+);base64,/);
    if (!match) throw new Error("Formato de imagen inválido");
    const ext = match[1];

    await fs.mkdir(folderPath, { recursive: true });

    const filePath = path.join(folderPath, `${fileName}.${ext}`);
    const relativePath = path.join("public", "assets", "image", "clientes", `${fileName}.${ext}`);

    const base64Data = base64Image.replace(/^data:image\/\w+;base64,/, "");
    await fs.writeFile(filePath, Buffer.from(base64Data, "base64"));

    return relativePath.replace(/\\/g, "/");
};

// Función para eliminar una imagen del servidor
export const deleteImage = async (filePath) => {
    try {
        await fs.access(filePath);
        await fs.unlink(filePath);
    } catch (error) {
        if (error.code !== 'ENOENT') {
            console.warn(`No se pudo eliminar el archivo: ${filePath}`, error.message);
        }
    }
};