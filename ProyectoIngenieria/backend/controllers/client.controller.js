import Client from "../models/client.model.js";
import phoneClient from "../models/phoneClient.model.js";
import { validateRegisterPhones } from "../logic/logClient/client.logic.js";
import { getDateCR } from "../libs/date.js";
import { Op } from "sequelize";
import { saveImage, deleteImage } from "../utils/fileManager.js";

/* new
import path from "path";
const CLIENT_IMAGE_FOLDER = path.join("..", "frontend", "public", "assets", "image", "clientes");
*/

function isNotEmpty(value) {
  if (typeof value === "string") {
    return value.trim().length > 0;
  } else if (typeof value === "number") {
    return !isNaN(value);
  }
  return false;
}

export const registerClient = async (req, res) => {
  try {
    console.log("Hola estamos en [registerClient] y estos son los datos: ", req.body);
    const {
      DSC_CEDULA,
      DSC_NOMBRE,
      DSC_APELLIDOUNO,
      DSC_APELLIDODOS,
      ESTADO,
      DSC_DIRECCION,
      FOTO,
      telefonos
    } = req.body;

    if (!isNotEmpty(DSC_CEDULA)) {
      return res.status(400).json({
        message: "La cedula no es valida",
      });
    } else if (!isNotEmpty(DSC_NOMBRE)) {
      return res.status(400).json({
        message: "El nombre no es valida",
      });
    } else if (!isNotEmpty(DSC_APELLIDOUNO)) {
      return res.status(400).json({
        message: "El primer apellido no es valida",
      });
    } else if (!isNotEmpty(DSC_APELLIDODOS)) {
      return res.status(400).json({
        message: "El segundo apellido no es valida",
      });
    }

    // const telefonosList = Array.from(
    //   new Set(
    //     Object.keys(telefonos)
    //       .filter((key) => key.startsWith("DSC_TELEFONO"))
    //       .map((key) => telefonos[key])
    //   )
    // );

    const telefonosList = Array.from(
      new Set(telefonos.filter((telefono) => telefono.numeroTelefono && isNotEmpty(telefono.numeroTelefono))
    .map((telefono) => telefono.numeroTelefono)
    )
    );

    //Validar los numeros de telefono
    const numberValidation = await validateRegisterPhones(telefonosList);
    if (numberValidation !== true) {
      return res.status(400).json({
        message: numberValidation,
      });
    }

    // Crear el cliente
    const creadoEn = await getDateCR();
    const newClient = new Client({
      DSC_CEDULA: DSC_CEDULA,
      DSC_NOMBRE: DSC_NOMBRE,
      DSC_APELLIDOUNO: DSC_APELLIDOUNO,
      DSC_APELLIDODOS: DSC_APELLIDODOS,
      FEC_CREADOEN: creadoEn,
      ESTADO: ESTADO,
      URL_FOTO: `public/Assets/image/clientes/${DSC_CEDULA}.png`,
      DSC_DIRECCION: DSC_DIRECCION,
    });

    //Guarda el cliente
    const clientSaved = await newClient.save();

    if (clientSaved.ID_CLIENTE) {
      await phoneClient.bulkCreate(
        telefonosList.map((telefono) => ({
          ID_CLIENTE: clientSaved.ID_CLIENTE,
          DSC_TELEFONO: telefono,
          FEC_CREADOEN: creadoEn,
          ESTADO: 1,
        }))
      );
    }

    /* new - manejar el guardado de la foto en el servidor y guardar la ruta en bd
    if (FOTO) {
      try {
        const filePath = await saveImage(FOTO, DSC_CEDULA, CLIENT_IMAGE_FOLDER);
        await clientSaved.update({ URL_FOTO: filePath });
      } catch (error) {
        return res.status(500).json({ message: "Error al guardar la imagen", error: error.message });
      }
    }
    */

    res.json({
      status: 200,
      cliente: clientSaved,
    });
  } catch (error) {
    if (error.name === "SequelizeUniqueConstraintError") {
      if (error.errors[0].path === "DSC_CEDULA") {
        res
          .status(500)
          .json({ message: "El cliente ya se encuentra registrado" });
      } else if (error.errors[0].path === "FOTOURL") {
        res
          .status(500)
          .json({ message: "Error al agregar la foto del cliente" });
      }
    } else if (
      error.name === "SequelizeDatabaseError" &&
      error.parent.code === "ER_INNODB_AUTOEXTEND_SIZE_OUT_OF_RANGE"
    ) {
      if (error.parent.sqlMessage.includes("chk_cedula_no_empty")) {
        res.status(500).json({ message: "La cédula no puede estar vacia." });
      } else if (error.parent.sqlMessage.includes("chk_urlphoto_no_empty")) {
        res
          .status(500)
          .json({ message: "La url de la foto no puede estar vacia." });
      } else if (error.parent.sqlMessage.includes("chk_direction_no_empty")) {
        res.status(500).json({ message: "La dirección no puede estar vacia." });
      } else {
        res.status(500).json({ message: error });
      }
    } else {
      res.status(500).json({ message: error });
    }
  }
};

export const getAllClients = async (req, res) => {
  try {
    // Obtén los parámetros de paginación de la solicitud (página y cantidad por página)
    const {
      page = 1,
      pageSize = 5,
      orderByField = "DSC_CEDULA",
      order = "asc",
    } = req.query;
    const limit = parseInt(pageSize);
    const offset = (parseInt(page) - 1) * limit;

    const field =
      orderByField === "DSC_NOMBRE" ||
      orderByField === "ESTADO" ||
      orderByField === "DSC_CEDULA" ||
      orderByField === "TELEFONO" ||
      orderByField === "DSC_APELLIDOUNO" ||
      orderByField === "DSC_APELLIDODOS"
        ? orderByField
        : "DSC_CEDULA";

    const sortOrder =
      order.toLowerCase() === "asc" || order.toLowerCase() === "desc"
        ? order
        : "asc";
    const { count, rows } = await Client.findAndCountAll({
      attributes: {
        exclude: ["FEC_MODIFICADOEN", "ID_CLIENTE", "FEC_CREADOEN"],
      },
      limit,
      offset,
      order: [[field, sortOrder]],
      include: [
        {
          model: phoneClient,
          attributes: ["ID_TELEFONOCLIENTE", "ID_CLIENTE", "DSC_TELEFONO"],
        },
      ],
      // new - distinct - para manejar bien la cantidad de registros de clientes, ya que sin esto puede surgir duplicaciones con phoneClient,
      // lo que resultaba en una página de más que no contenia nada
      distinct: true,
    });

    if (rows.length === 0) {
      return res.status(204).json({
        message: "No se encontraron clientes.",
      });
    }

    res.json({
      total: count,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      pageSize: limit,
      clients: rows,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const deleteClient = async (req, res) => {
  console.log("Hola el id es: ", req.params.id);
  try {
    const client = await Client.findOne({
      attributes: {
        exclude: ["FEC_MODIFICADOEN", "FEC_CREADOEN"],
      },
      where: { DSC_CEDULA: req.params.id },
    });
    if (!client) {
      return res.status(404).json({ message: "Cliente no encontrado." });
    }

    const modificadoEN = await getDateCR();
    await client.update(
      {
        ESTADO: 2,
        FEC_MODIFICADOEN: modificadoEN,
      },
      {
        where: { DSC_CEDULA: req.params.id },
      }
    );

    return res.json("Cliente eliminado correctamente.");
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const updateClient = async (req, res) => {
  try {

    console.log(
      "Hola estamos en [updateClient] y estos son los datos del backend: ",
      req.body
    );
    const {
      DSC_CEDULA,
      DSC_NOMBRE,
      DSC_APELLIDOUNO,
      DSC_APELLIDODOS,
      ESTADO,
      DSC_DIRECCION,
      FOTO,
      telefonos,
    } = req.body;

    

    const modificadoEN = await getDateCR();
    const client = await Client.findOne({
      where: { DSC_CEDULA: req.params.id },
    });
    //const telefonosList = await phoneClient.findAll({ where: { ID_CLIENTE: req.params.id } });

    if (!client) {
      return res.status(404).json({ message: "Cliente no encontrado." });
    }

    let updatedData = {
      DSC_NOMBRE,
      DSC_APELLIDOUNO,
      DSC_APELLIDODOS,
      ESTADO,
      DSC_DIRECCION,
      FEC_MODIFICADOEN: modificadoEN,
    };

    const phoneNumbers = telefonos.map(phone => phone.numeroTelefono);
    //let updatedTelefonos = { DSC_TELEFONO: telefonos };
    // new - manejar el guardado de la foto en el servidor y guardar la ruta en bd
    /* también el eliminado de la foto en el servidor
    if (FOTO) {
      try {
        if (client.URL_FOTO) await deleteImage(client.URL_FOTO);
        const filePath = await saveImage(FOTO, req.params.id, CLIENT_IMAGE_FOLDER);
        updatedData.URL_FOTO = filePath;
      } catch (error) {
        return res.status(500).json({ message: "Error al actualizar la imagen", error: error.message });
      }
    }
    */

    //validacion de los numeros de telefono-------------------------------
    const validatePhones = await validatePhonesClientUpdate(phoneNumbers, client.ID_CLIENTE);
    if (Array.isArray(validatePhones)){
      return res.status(400).json({
        message: validatePhones[0],
      });
    }
    //--------------------------------------------------------------------

    await client.update(updatedData);
    //await phoneClient.update(updatedTelefonos, { where: { ID_CLIENTE: req.params.id } });

    if (telefonos && telefonos.length > 0) {
      console.log("Entro al if para modificar los telefonos");

      const existingPhones = await phoneClient.findAll({
        where: {ID_CLIENTE: client.ID_CLIENTE},
        attributes: ['ID_TELEFONOCLIENTE'],
      });

      const existingPhoneIds = existingPhones.map(phone => phone.ID_TELEFONOCLIENTE);
      console.log("Telefonos Existentes [existingPhones]: ", existingPhoneIds);

      const phoneIdInRequest = telefonos
      .filter(phone => phone.idTelefonoCliente)
      .map(phone => phone.idTelefonoCliente);

      const phonesToDelete = existingPhoneIds.filter(id => !phoneIdInRequest.includes(id));
      if (phonesToDelete.length > 0) {  
        await phoneClient.destroy({
          where: {ID_TELEFONOCLIENTE: phonesToDelete}
        });
      }

      for (const telefono of telefonos) {
        const { idTelefonoCliente, numeroTelefono } = telefono;

        if (idTelefonoCliente) {
          //Actualizar el telefono
          await phoneClient.update(
              {
                DSC_TELEFONO: telefono.numeroTelefono,
                FEC_MODIFICADOEN: modificadoEN,
              },
              { where: { ID_TELEFONOCLIENTE: telefono.idTelefonoCliente } }
            );
        } else {
          await phoneClient.create({
            ID_CLIENTE: client.ID_CLIENTE,
            DSC_TELEFONO: numeroTelefono,
            FEC_CREADOEN: modificadoEN,
            ESTADO: 1,
          });
        }

       
      }
    } else {
      await phoneClient.destroy({
        where: {ID_CLIENTE: client.ID_CLIENTE}
      });
    }

    return res.json(client);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const searchClient = async (req, res) => {
  try {
    // Obtén los parámetros de paginación de la solicitud (página y cantidad por página)
    const {
      page = 1,
      pageSize = 5,
      termSearch = "",
      orderByField = "DSC_CEDULA",
      order = "asc",
    } = req.query;
    const limit = parseInt(pageSize);
    const offset = (parseInt(page) - 1) * limit;

    const field =
      orderByField === "DSC_NOMBRE" ||
      orderByField === "ESTADO" ||
      orderByField === "DSC_CEDULA" ||
      orderByField === "TELEFONO" ||
      orderByField === "DSC_APELLIDOUNO" ||
      orderByField === "DSC_APELLIDODOS"
        ? orderByField
        : "DSC_CEDULA";

    const sortOrder =
      order.toLowerCase() === "asc" || order.toLowerCase() === "desc"
        ? order
        : "asc";
    const expectedMatch = { [Op.like]: `%${termSearch}%` };

    const { count, rows } = await Client.findAndCountAll({
      attributes: {
        exclude: ["FEC_MODIFICADOEN", "ID_CLIENTE", "FEC_CREADOEN"],
      },
      limit,
      offset,
      order: [[field, sortOrder]],
      include: [
        {
          model: phoneClient,
          attributes: ["DSC_TELEFONO"],
        },
      ],
      where: {
        [Op.or]: [
          { DSC_CEDULA: expectedMatch },
          { DSC_NOMBRE: expectedMatch },
          { DSC_APELLIDOUNO: expectedMatch },
          { DSC_APELLIDODOS: expectedMatch },
          { DSC_DIRECCION: expectedMatch },
        ],
      },
    });

    const phoneMatches = await phoneClient.findAll({
      attributes: ["ID_CLIENTE"],
      where: { DSC_TELEFONO: expectedMatch },
    });

    // Extrae los IDs de clientes únicos de la consulta de teléfonos
    const phoneClientIds = [
      ...new Set(phoneMatches.map((phone) => phone.ID_CLIENTE)),
    ];
    const clientIdsFromFirstQuery = rows.map((client) => client.ID_CLIENTE);

    // Filtra los clientes de la segunda consulta que no estén ya en la primera
    const additionalClients = await Client.findAll({
      attributes: {
        exclude: ["FEC_MODIFICADOEN", "ID_CLIENTE", "FEC_CREADOEN"],
      },
      include: [
        {
          model: phoneClient,
          attributes: ["DSC_TELEFONO"],
        },
      ],
      where: {
        ID_CLIENTE: {
          [Op.in]: phoneClientIds,
          [Op.notIn]: clientIdsFromFirstQuery,
        },
      },
    });

    // Unir ambas listas de resultados
    const allClients = [...rows, ...additionalClients];

    if (allClients.length === 0) {
      return res.status(204).json({
        message: "No se encontraron clientes.",
      });
    }

    res.json({
      total: count,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      pageSize: limit,
      clients: allClients,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

async function validatePhonesClientUpdate(phones, clientID) {
  try {
    
    const existingPhones = await phoneClient.findAll({
      where: {
        DSC_TELEFONO: { [Op.in]: phones },
        ID_CLIENTE: { [Op.ne]: clientID}
      },
      attributes: ['DSC_TELEFONO']
    });
  
    if (existingPhones.length > 0) {
      const existingNumbers = existingPhones.map(phone => phone.DSC_TELEFONO);
      return [`Hay números de teléfono en uso por otro cliente: ${existingNumbers.join(', ')}.`];
    }
    return false;
  } catch (error) {
    console.error("Error en validatePhonesClientUpdate:", error);
    throw error;
  }
  
};