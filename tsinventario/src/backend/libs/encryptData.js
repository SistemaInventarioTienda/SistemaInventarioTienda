import bcrypt from "bcryptjs";

export async function encryptData(data, salt) {
    try {
        return await bcrypt.hash(data, salt);
    } catch (error) {
        if (typeof data === 'string' && data.trim().length > 0) {
            return await encryptData(data, 10);
        }
        throw new Error("Datos no validos para encriptar.");

    }
}


export async function compareData(data1, data2) {
    try {
        return await bcrypt.compare(data1, data2);
    } catch (error) {
        return false;
    }
}