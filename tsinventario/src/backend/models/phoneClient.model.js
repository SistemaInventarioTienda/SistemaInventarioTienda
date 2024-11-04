import { DataTypes } from 'sequelize';
import db from '../db.js';
import Client from './client.model.js';

const phoneClient = db.define('TelefonoCliente', {
    ID_TELEFONOCLIENTE: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    },
    ID_CLIENTE: {
        type: DataTypes.INTEGER,
        references: {
            model: Client,
            key: 'ID_CLIENTE'
        },
        allowNull: false,
    },
    DSC_TELEFONO: {
        type: DataTypes.STRING(8),
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
    ESTADO: {
        type: DataTypes.INTEGER,
        allowNull: true,
    }
}, {
    timestamps: false,
    tableName: 'tsit_telefonocliente',
});

Client.hasMany(phoneClient, { foreignKey: 'ID_CLIENTE' });
phoneClient.belongsTo(Client, { foreignKey: 'ID_CLIENTE' });

export default phoneClient;