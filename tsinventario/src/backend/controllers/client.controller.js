import Client from "../models/client.model.js";
import { getDateCR } from '../libs/date.js';
import { Op } from 'sequelize';

export const registerClient = async (req, res) => {
  try {

    const { DSC_CEDULA, DSC_NOMBRE, DSC_APELLIDOUNO, DSC_APELLIDODOS, ESTADO, DSC_DIRECCION, FOTO } = req.body;

    // creating the user
    const creadoEn = await getDateCR();
    const newClient = new Client({
      DSC_CEDULA: DSC_CEDULA,
      DSC_NOMBRE: DSC_NOMBRE,
      DSC_APELLIDOUNO: DSC_APELLIDOUNO,
      DSC_APELLIDODOS: DSC_APELLIDODOS,
      FEC_CREADOEN: creadoEn,
      ESTADO: ESTADO,
      URL_FOTO: FOTO ? `public/Assets/image/clientes/${DSC_CEDULA}.png` : `public/Assets/image/clientes/default_client.jpeg`,
      DSC_DIRECCION: DSC_DIRECCION
    });

    // saving the user in the database
    const clientSaved = await newClient.save();

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