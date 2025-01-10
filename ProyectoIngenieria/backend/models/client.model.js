import { DataTypes } from 'sequelize';
import db from '../db.js';

const Client = db.define('Client', {
    ID_CLIENTE: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    },
    DSC_CEDULA: {
        type: DataTypes.STRING(15),
        allowNull: false,
        trim: false,
        unique: true,
    },
    DSC_NOMBRE: {
        type: DataTypes.STRING(50),
        allowNull: false,
        trim: false,
    },
    DSC_APELLIDOUNO: {
        type: DataTypes.STRING(50),
        allowNull: false,
        trim: false,
    },
    DSC_APELLIDODOS: {
        type: DataTypes.STRING(50),
        allowNull: false,
        trim: false,
    },
    ESTADO: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    FEC_CREADOEN: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    FEC_MODIFICADOEN: {
        type: DataTypes.DATE,
        allowNull: true,
    }, 
    URL_FOTO: {
        type: DataTypes.STRING(255),
        allowNull: false,
    }, 
    DSC_DIRECCION: {
        type: DataTypes.STRING(500),
        allowNull: false,
    }
},
    {
        timestamps: false,
        tableName: 'tsit_cliente',
    }
);

export default Client;