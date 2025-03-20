import { DataTypes } from 'sequelize';
import db from '../db.js';
import subcategory from './subcategory.model.js';
import User from './user.model.js';

const Product = db.define('Product', {
    ID_PRODUCT: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    },
    DSC_NOMBRE: {
        type: DataTypes.STRING(100),
        allowNull: true,
        trim: true,
    },
    DSC_DESCRIPTION: {
        type: DataTypes.STRING(255),
        allowNull: true,
    },
    DSC_CODIGO_BARRAS: {
        type: DataTypes.STRING(255),
        allowNull: true,
    },
    URL_IMAGEN: {
        type: DataTypes.STRING(255),
        allowNull: true,
    },
    MON_VENTA: {
        type: DataTypes.DOUBLE,
        allowNull: true,
    },
    MON_COMPRA: {
        type: DataTypes.DOUBLE,
        allowNull: true,
    },
    CANTIDAD:{
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    FEC_CREATED_AT: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    FEC_UPDATE_AT: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    ESTADO: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    ID_SUBCATEGORIA: {
        type: DataTypes.INTEGER,
        references: {
            model: subcategory,
            key: 'ID_SUBCATEGORIA'
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
    tableName: 'tsim_producto',
});


Product.belongsTo(subcategory, { foreignKey: 'ID_SUBCATEGORIA' });
Product.belongsTo(User, { foreignKey: 'CREATED_BY_USER' }); 
Product.belongsTo(User, { foreignKey: 'UPDATED_BY_USER' }); 


export default Product;
