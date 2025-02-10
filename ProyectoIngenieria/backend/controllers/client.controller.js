import Client from "../models/client.model.js";
import phoneClient from "../models/phoneClient.model.js";
import { getDateCR } from '../libs/date.js';
import { Op } from 'sequelize';

function isNotEmpty(value) {
  if (typeof value === 'string') {
    return value.trim().length > 0;

  } else if (typeof value === 'number') {
    return !isNaN(value);
  }
  return false;
}

export const registerClient = async (req, res) => {
  try {

    const { DSC_CEDULA, DSC_NOMBRE, DSC_APELLIDOUNO, DSC_APELLIDODOS, ESTADO, DSC_DIRECCION, FOTO, ...telefonos } = req.body;

    if (!isNotEmpty(DSC_CEDULA)) {
      return res.status(400).json({
        message: "La cedula no es valida",
      })
    } else if (!isNotEmpty(DSC_NOMBRE)) {
      return res.status(400).json({
        message: "El nombre no es valida",
      })
    } else if (!isNotEmpty(DSC_APELLIDOUNO)) {
      return res.status(400).json({
        message: "El primer apellido no es valida",
      })
    } else if (!isNotEmpty(DSC_APELLIDODOS)) {
      return res.status(400).json({
        message: "El segundo apellido no es valida",
      })
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
      DSC_DIRECCION: DSC_DIRECCION
    });

    //Guarda el cliente
    const clientSaved = await newClient.save();

    if (clientSaved.ID_CLIENTE) {
      const telefonosList = Array.from(
        new Set(
          Object.keys(telefonos)
            .filter(key => key.startsWith('DSC_TELEFONO'))
            .map(key => telefonos[key])
        )
      );

      await phoneClient.bulkCreate(
        telefonosList.map(telefono => ({
          ID_CLIENTE: clientSaved.ID_CLIENTE,
          DSC_TELEFONO: telefono,
          FEC_CREADOEN: creadoEn,
          ESTADO: 1,
        }))
      );
    }

    res.json({
      'status': 200,
      "cliente": clientSaved
    });
  } catch (error) {

    if (error.name === 'SequelizeUniqueConstraintError') {

      if (error.errors[0].path === 'DSC_CEDULA') {
        res.status(500).json({ message: "El cliente ya se encuentra registrado" });
      } else if (error.errors[0].path === 'FOTOURL') {
        res.status(500).json({ message: "Error al agregar la foto del cliente" });
      }


    } else if (error.name === 'SequelizeDatabaseError' && error.parent.code === 'ER_INNODB_AUTOEXTEND_SIZE_OUT_OF_RANGE') {
      if (error.parent.sqlMessage.includes('chk_cedula_no_empty')) {
        res.status(500).json({ message: "La cédula no puede estar vacia." });
      } else if (error.parent.sqlMessage.includes('chk_urlphoto_no_empty')) {
        res.status(500).json({ message: "La url de la foto no puede estar vacia." });
      } else if (error.parent.sqlMessage.includes('chk_direction_no_empty')) {
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
    const { page = 1, pageSize = 5, orderByField = 'DSC_CEDULA', order = 'asc' } = req.query;
    const limit = parseInt(pageSize);
    const offset = (parseInt(page) - 1) * limit;

    const field = (
      orderByField === 'DSC_NOMBRE' || orderByField === 'ESTADO' || orderByField === 'DSC_CEDULA' || orderByField === 'TELEFONO' ||
      orderByField === 'DSC_APELLIDOUNO' || orderByField === 'DSC_APELLIDODOS'
    ) ? orderByField : 'DSC_CEDULA';

    const sortOrder = order.toLowerCase() === 'asc' || order.toLowerCase() === 'desc' ? order : 'asc';
    const { count, rows } = await Client.findAndCountAll({
      attributes: {
        exclude: ['FEC_MODIFICADOEN', 'ID_CLIENTE', 'FEC_CREADOEN']
      },
      limit,
      offset,
      order: [
        [field, sortOrder],
      ],
      include: [{
        model: phoneClient,
        attributes: ['DSC_TELEFONO'],
      }]
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
      clients: rows
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
        exclude: ['FEC_MODIFICADOEN', 'FEC_CREADOEN']
      },
      where: { DSC_CEDULA: req.params.id }
    });
    if (!client) {
      return res.status(404).json({ message: "Cliente no encontrado." });
    }

    const modificadoEN = await getDateCR();
    await client.update(
      {
        ESTADO: 2,
        FEC_MODIFICADOEN: modificadoEN
      },
      {
        where: { DSC_CEDULA: req.params.id }
      }
    );

    return res.json("Cliente eliminado correctamente.");
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

export const updateClient = async (req, res) => {
  try {
    const { DSC_CEDULA, DSC_NOMBRE, DSC_APELLIDOUNO, DSC_APELLIDODOS, ESTADO, DSC_DIRECCION, FOTO, ...telefonos } = req.body;

    const modificadoEN = await getDateCR();
    const client = await Client.findOne({ where: { DSC_CEDULA: req.params.id } });
    if (!client) {
      return res.status(404).json({ message: "Cliente no encontrado." });
    }

    await client.update({
      DSC_CEDULA, DSC_NOMBRE, DSC_APELLIDOUNO, DSC_APELLIDODOS, ESTADO, DSC_DIRECCION, FOTO, FEC_MODIFICADOEN: modificadoEN
    })

    return res.json(client);

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

export const searchClient = async (req, res) => {
  try {
    // Obtén los parámetros de paginación de la solicitud (página y cantidad por página)
    const { page = 1, pageSize = 5, termSearch = '', orderByField = 'DSC_CEDULA', order = 'asc' } = req.query;
    const limit = parseInt(pageSize);
    const offset = (parseInt(page) - 1) * limit;

    const field = (
      orderByField === 'DSC_NOMBRE' || orderByField === 'ESTADO' || orderByField === 'DSC_CEDULA' || orderByField === 'TELEFONO' ||
      orderByField === 'DSC_APELLIDOUNO' || orderByField === 'DSC_APELLIDODOS'
    ) ? orderByField : 'DSC_CEDULA';

    const sortOrder = order.toLowerCase() === 'asc' || order.toLowerCase() === 'desc' ? order : 'asc';
    const expectedMatch = { [Op.like]: `%${termSearch}%` };

    const { count, rows } = await Client.findAndCountAll({
      attributes: {
        exclude: ['FEC_MODIFICADOEN', 'ID_CLIENTE', 'FEC_CREADOEN']
      },
      limit,
      offset,
      order: [
        [field, sortOrder],
      ],
      include: [{
        model: phoneClient,
        attributes: ['DSC_TELEFONO']
      }],
      where: {
        [Op.or]: [
          { DSC_CEDULA: expectedMatch },
          { DSC_NOMBRE: expectedMatch },
          { DSC_APELLIDOUNO: expectedMatch },
          { DSC_APELLIDODOS: expectedMatch },
          { DSC_DIRECCION: expectedMatch }
        ]
      }
    });

    const phoneMatches = await phoneClient.findAll({
      attributes: ["ID_CLIENTE"],
      where: { DSC_TELEFONO: expectedMatch }
    });

    // Extrae los IDs de clientes únicos de la consulta de teléfonos
    const phoneClientIds = [...new Set(phoneMatches.map(phone => phone.ID_CLIENTE))];
    const clientIdsFromFirstQuery = rows.map(client => client.ID_CLIENTE);

    // Filtra los clientes de la segunda consulta que no estén ya en la primera
    const additionalClients = await Client.findAll({
      attributes: {
        exclude: ['FEC_MODIFICADOEN', 'ID_CLIENTE', 'FEC_CREADOEN']
      },
      include: [{
        model: phoneClient,
        attributes: ['DSC_TELEFONO']
      }],
      where: {
        ID_CLIENTE: {
          [Op.in]: phoneClientIds,
          [Op.notIn]: clientIdsFromFirstQuery
        }
      }
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
      clients: allClients
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}