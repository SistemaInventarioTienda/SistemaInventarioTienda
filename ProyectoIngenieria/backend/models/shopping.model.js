import { DataTypes } from 'sequelize';
import db from '../db.js';
import {Supplier} from './supplier.model.js';
import subcategory from './subcategory.model.js';
import User from './user.model.js';

const Shopping = db.define('Shopping', {
    ID_COMPRA: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    },
    FEC_COMPRA: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    FEC_ENTRADA: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    FEC_CREATED_AT: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    FEC_UPDATE_AT: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    ESTADO: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    MON_TOTAL : {
        type: DataTypes.DOUBLE,
        allowNull: false,
    },
    DSC_METODO_PAGO: {
        type:DataTypes.STRING(100),
        allowNull: false    
    },
    ID_PROVEEDOR: {
        type: DataTypes.INTEGER,
        references: {
            model: Supplier,
            key: 'ID_PROVEEDOR'
        },
        allowNull: false,
    },
    UPDATED_BY_USER: {
        type: DataTypes.INTEGER,
        references: {
            model: User,
            key: 'ID_USUARIO'
        },
        allowNull: true,
    },
    CREATED_BY_USER: {
        type: DataTypes.INTEGER,
        references: {
            model: User,
            key: 'ID_USUARIO'
        },
        allowNull: false,
    }
}, {
    timestamps: false,
    tableName: 'tsit_compras',
});


Shopping.belongsTo(User, { foreignKey: 'CREATED_BY_USER' }); 
Shopping.belongsTo(User, { foreignKey: 'UPDATED_BY_USER' }); 
Shopping.belongsTo(Supplier, { foreignKey: 'ID_PROVEEDOR', as: 'supplier' })


export default Shopping;
