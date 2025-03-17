import { DataTypes } from 'sequelize';
import db from '../db.js';
import Shopping from './shopping.model.js';
import User from './user.model.js';
import Product from './product.model.js';

const Details_Shopping = db.define('Details_Shopping', {
    ID_DETALLE_COMPRA: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    },
    FEC_UPDATE_AT: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    ESTADO: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    MON_PRECIO_COMPRA: {
        type: DataTypes.DOUBLE,
        allowNull: false,
    },
    MON_CANTIDAD: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    ID_COMPRA: {
        type: DataTypes.INTEGER,
        references: {
            model: Shopping,
            key: 'ID_COMPRA'
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
    DSC_CODIGO_BARRAS: {
        type: DataTypes.STRING(255),
        references: {
            model: Product,
            key: 'DSC_CODIGO_BARRAS'
        }
    }
}, {
    timestamps: false,
    tableName: 'tsit_detalles_compras',
});


Shopping.hasMany(Details_Shopping, {
    foreignKey: 'ID_COMPRA', 
    as: 'Details_Shopping', 
});

Details_Shopping.belongsTo(Shopping, { foreignKey: 'ID_COMPRA' });
Details_Shopping.belongsTo(User, { foreignKey: 'CREATED_BY_USER' });
Details_Shopping.belongsTo(User, { foreignKey: 'UPDATED_BY_USER' });
Details_Shopping.belongsTo(Product, {foreignKey: 'DSC_CODIGO_BARRAS'});


export default Details_Shopping;
