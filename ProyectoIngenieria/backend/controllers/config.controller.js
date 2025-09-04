import { updateConfig, getAllConfigs } from "../logic/config/config.logic.js";


export const updateConfiguration = async( req, res ) => {
 
    const result = await updateConfig(req);
    if (result.error) {
        return res.status(400).json({ success: false, message: result.error });
    }
    return res.status(200).json({ success: true, message: "La configuración ha sido actualizada correctamente." });
};

export const getConfig = async ( req, res ) => {
    const result = await getAllConfigs(req);
    if (result.error) {
        return res.status(400).json({ success: false, message: result.error });
    }
    return res.status(200).json({ success: true, data: result.data });
};