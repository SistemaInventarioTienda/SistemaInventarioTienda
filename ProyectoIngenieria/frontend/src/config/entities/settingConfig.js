import { getConfig, updateConfig } from "../../api/settings";

//Configuracion princinal de la entidad 'settings'
export const settingConfig = {
  entityName: "Ajuste",
  titlePage: "Ajustes",
  entityMessage: "Gestionar ajustes del sistema",

  // Identificador clave de la entidad
  entityKey: "setting",

  fields: [
    //Campos para el formulario de configuraciones.
    {
      name: "rango",
      label: "Rango para el aviso de Stock",
      type: "numberinput",
      min: 1,
      max: 99,
      initialValue: 1,
      required: true,
    },
    {
      name: "nombre",
      label: "Nombre",
      type: "text",
      required: false,
    },
    {
      name: "telefono",
      label: "Teléfono",
      type: "number",
      required: false,
    },
    {
      name: "correo",
      label: "Correo Electrónico",
      type: "email",
      required: false,
    },
    {
      name: "direccion",
      label: "Dirección",
      type: "textarea",
      required: false,
    },
    {
      name: "eslogan",
      label: "Eslogan",
      type: "textarea",
      required: false,
    },
  ],
  api: {
    fetchAll: getConfig,
    update: updateConfig,
  },

  transformData: {
    // Transformación de datos desde la API hacia el frontend
    toFrontend: (setting) => {
      return {
        // Campos para mostrar en el frontend
        rango: setting.DSC_RANGO_STOCK || 0,
        nombre: setting.DSC_NOMBRE || "",
        telefono: setting.NUM_TELEFONO || "",
        correo: setting.DSC_CORREO || "",
        direccion: setting.DSC_DIRECCION || "",
        eslogan: setting.DSC_ESLOGAN || "",
      };
    },

    toBackend: async (formData) => {
      if (!formData) {
        throw new Error("formData es undefined");
      }

      const requiredFields = [
        "id",
        "rango",
        "nombre",
        "telefono",
        "correo",
        "direccion",
        "eslogan",
      ];
      const missingFields = requiredFields.filter((field) => !formData[field]);

      if (missingFields.length > 0) {
        throw new Error(
          `Campos faltantes en formData: ${missingFields.join(", ")}`
        );
      }
      const data = {
        ID_EMPRESA: formData.id,
        DSC_RANGO_STOCK: formData.rango,
        DSC_NOMBRE: formData.nombre,
        NUM_TELEFONO: formData.telefono,
        DSC_CORREO: formData.correo,
        DSC_DIRECCION: formData.direccion,
        DSC_ESLOGAN: formData.eslogan,
      };
      return data;
    },
  },
  actions: {
    // Acciones adicionales para la entidad
    edit: true,
    delete: false,
    view: true,
  },
};

//console.log("Settings Configurations: ", settingConfig.api.fetchAll());
