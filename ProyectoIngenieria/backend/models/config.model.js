import { DataTypes } from 'sequelize';
import db from '../db.js';

const Config = db.define('Config', {
    ID_EMPRESA: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    }, 
    DSC_RANGO_STOCK: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    DSC_NOMBRE: {
        type: DataTypes.STRING(50),
        allowNull: true
    },
    NUM_TELEFONO: {
        type: DataTypes.STRING(8),
        allowNull: true
    },
    DSC_CORREO: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    DSC_DIRECCION: {
        type: DataTypes.STRING(100),
        allowNull: true
    }, 
    DSC_ESLOGAN: {
        type: DataTypes.STRING(255),
        allowNull: true
    }
}, {
    timestamps: false,
    tableName: 'tsim_empresa',
});

export default Config;