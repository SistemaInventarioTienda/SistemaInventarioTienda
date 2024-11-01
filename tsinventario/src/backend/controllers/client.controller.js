import Client from "../models/client.model.js";
import TelefonoCliente from "../models/telefonoCliente.model.js";
import { getDateCR } from '../libs/date.js';
import { Op } from 'sequelize';

export const registerClient = async (req, res) => {
  try {

    const { DSC_CEDULA, DSC_NOMBRE, DSC_APELLIDOUNO, DSC_APELLIDODOS, ESTADO, DSC_DIRECCION, FOTO, ...telefonos } = req.body;

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

      await TelefonoCliente.bulkCreate(
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
        res.status(500).json({ errorMessage: "El cliente ya se encuentra registrado" });
      } else if (error.errors[0].path === 'FOTOURL') {
        res.status(500).json({ errorMessage: "Error al agregar la foto del cliente" });
      }


    } else if (error.name === 'SequelizeDatabaseError' && error.parent.code === 'ER_INNODB_AUTOEXTEND_SIZE_OUT_OF_RANGE') {
      if (error.parent.sqlMessage.includes('chk_cedula_no_empty')) {
        res.status(500).json({ errorMessage: "La cédula no puede estar vacia." });
      } else if (error.parent.sqlMessage.includes('chk_urlphoto_no_empty')) {
        res.status(500).json({ errorMessage: "La url de la foto no puede estar vacia." });
      } else if (error.parent.sqlMessage.includes('chk_direction_no_empty')) {
        res.status(500).json({ errorMessage: "La dirección no puede estar vacia." });
      } else {
        res.status(500).json({ errorMessage: error });
      }

    } else {
      res.status(500).json({ errorMessage: error });
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
      ]
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