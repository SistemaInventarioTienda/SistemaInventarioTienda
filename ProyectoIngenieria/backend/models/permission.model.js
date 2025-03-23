import { DataTypes } from 'sequelize';
import db from '../db.js';
import User from './user.model.js';


const Permission = db.define('Permission', {
    ID_PERMISO: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    },
    DSC_NOMBRE: {
        type: DataTypes.STRING(100),
        allowNull: true,
    },
    DSC_DESCRIPCION: {
        type: DataTypes.STRING(255),
        allowNull: true,
    }
}, {
    timestamps: false,
    tableName: 'tsim_permiso',
});


const PermissionUser = db.define('PermissionUser', {
    ID_PERMISOUSUARIO: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    },
    ID_USUARIO: {
        type: DataTypes.INTEGER,
        references: {
            model: User,
            key: 'ID_USUARIO'
        },
        allowNull: false,
    },
    ID_PERMISO: {
        type: DataTypes.INTEGER,
        references: {
            model: Permission,
            key: 'ID_PERMISO'
        },
        allowNull: false,
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
    tableName: 'tsit_permisousuario',
});


PermissionUser.belongsTo(User, { foreignKey: 'ID_USUARIO' });
PermissionUser.belongsTo(Permission, { foreignKey: 'ID_PERMISO' });

export { Permission, PermissionUser };
