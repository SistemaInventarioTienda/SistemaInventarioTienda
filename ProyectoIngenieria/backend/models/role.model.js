import { DataTypes } from 'sequelize';
import db from '../db.js';

const Role = db.define('Role', {
    ID_ROL: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    },
    DSC_NOMBRE: {
        type: DataTypes.STRING(50),
        allowNull: true,
        trim: true,
    },
    DSC_DESCRIPCION: {
        type: DataTypes.STRING(255),
        allowNull: true,
        trim: true,
    },
    ESTADO: {
        type: DataTypes.INTEGER,
        allowNull: true,
    }
}, {
    timestamps: false,
    tableName: 'tsim_rol',
})

export default Role;

