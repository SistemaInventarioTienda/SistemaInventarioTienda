import { DataTypes } from 'sequelize';
import db from '../db.js';

const notification = db.define('notification', {
    IDENTIFICADOR_NOTIFICACION: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    }, 
    MENSAJE: {
        type: DataTypes.STRING(1000),
        allowNull: false
    },
    VISTO: {
        type: DataTypes.INTEGER,
        allowNull: true
    }
}, {
    timestamps: false,
    tableName: 'tsit_notificaciones',
});

export default notification;