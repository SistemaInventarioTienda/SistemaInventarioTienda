import Config from "../../models/config.model.js";
import { configSchema } from "../../schemas/config.schema.js";

export const updateConfig = async (req) => {
  try {
    const { ID_EMPRESA } = req.body;

    if (!ID_EMPRESA) {
      return { error: "El ID de la empresa es requerido." };
    }

    const existConfig = await Config.findOne({
      where: { ID_EMPRESA },
    });

    if (!existConfig) {
      return { error: "No se encontró la empresa." };
    }

    const validationInfo = configSchema.safeParse(req.body);

    if (validationInfo.error) {
      const errores = validationInfo.error.details.map(
        (detail) => detail.message
      );
      return {
        error: "Errores en la validacion de configuracion: ",
        details: errores,
      };
    }

    const { DSC_RANGO_STOCK, DSC_NOMBRE, NUM_TELEFONO, DSC_CORREO, DSC_DIRECCION, DSC_ESLOGAN } =
  validationInfo.data;

    const depureData = {
      DSC_RANGO_STOCK,
      ...(DSC_NOMBRE && { DSC_NOMBRE }),
      ...(NUM_TELEFONO && { NUM_TELEFONO }),
      ...(DSC_CORREO && { DSC_CORREO }),
      ...(DSC_DIRECCION && { DSC_DIRECCION }),
      ...(DSC_ESLOGAN && { DSC_ESLOGAN }),
    };

    await existConfig.update(depureData);
    return { success: true, data: existConfig };
    
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const getAllConfigs = async (req) => {
  try{
    const allConfig = await Config.findAll();
    return { success: true, data: allConfig };
  } catch (error) {
    return { success: false, error: error.message };
  }
};
// async function existNameAct(name, idToExclude) {
//   const query = {
//     where: {
//       DSC_NOMBRE: name,
//       ...(idToExclude && { ID_EMPRESA: { [Op.ne]: idToExclude } }),
//     },
//   };

//   const nameFound = await Category.findOne(query);

//   return nameFound !== null;
// }
// async function existIDConfig(id) {
//   const nameFound = await Category.findOne({ where: { ID_EMPRESA: id } });
//   return nameFound;
// }
