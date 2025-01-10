import { DataTypes } from 'sequelize';
import db from '../db.js';

const User = db.define('User', {
  ID_USUARIO: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  DSC_NOMBREUSUARIO: {
    type: DataTypes.STRING(255),
    allowNull: true,
    trim: true,
  },
  DSC_CONTRASENIA: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  DSC_CORREO: {
    type: DataTypes.STRING(100),
    allowNull: true,
    validate: {
      isEmail: true,
    },
  },
  DSC_TELEFONO: {
    type: DataTypes.STRING(8),
    allowNull: true,
  },
  ID_ROL: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  DSC_CEDULA: {
    type: DataTypes.STRING(15),
    allowNull: true,
  },
  DSC_NOMBRE: {
    type: DataTypes.STRING(50),
    allowNull: true,
  },
  DSC_APELLIDOUNO: {
    type: DataTypes.STRING(50),
    allowNull: true,
  },
  DSC_APELLIDODOS: {
    type: DataTypes.STRING(50),
    allowNull: true,
  },
  FEC_CREADOEN: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  ESTADO: {
    type: DataTypes.INTEGER,
    allowNull: true,
  }
}, {
  timestamps: false,
  tableName: 'tsit_usuario',
}, {
  hooks: {
    // Hook antes de la creación de un usuario
    beforeCreate: (user, options) => {
      if (user.DSC_CORREO) {
        user.DSC_CORREO = user.DSC_CORREO.toLowerCase(); // Convierte el correo a minúsculas
      }
    },
    // Hook antes de la actualización de un usuario
    beforeUpdate: (user, options) => {
      if (user.DSC_CORREO) {
        user.DSC_CORREO = user.DSC_CORREO.toLowerCase(); // Convierte el correo a minúsculas
      }
    },
  },
});

export default User;
