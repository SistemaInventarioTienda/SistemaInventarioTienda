import { DataTypes } from 'sequelize';
import db from '../db.js';
import Product from '../models/product.model.js';
import Config from './config.model.js';

const Proforma = db.define('proforma',{
    ID_PROFORMA: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      DSC_CODIGO_BARRAS: {
        type: DataTypes.STRING(255),
        allowNull: true
      },
      ID_EMPRESA: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: Config,
          key: 'ID_EMPRESA'
        }
      },
      MON_TOTAL:{
        type: DataTypes.DOUBLE,
        allowNull: false,
      },
      FEC_CREACION: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      FEC_LIMITE: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      ESTADO: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 1
      }
},{
    timestamps: false,
    tableName: 'tsit_proforma'
});


const DetailsProforma = db.define('detailsproforma',{
      ID_PRODUCTO_PROFORMA: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      ID_PROFORMA: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: Proforma,
          key: 'ID_PROFORMA'
        }
      },
      ID_PRODUCTO: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: Product ,
          key: 'ID_PRODUCT'
        }
      },
      PRECIO_UNITARIO:{
        type: DataTypes.DOUBLE,
        allowNull: false,
      },
      CANTIDAD:{
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },
      IMPUESTO : {
        type: DataTypes.DOUBLE,
        allowNull: false,
      },
      DESCUENTO : {
        type: DataTypes.INTEGER,
        allowNull: false,
      }
},{
    timestamps: false,
    tableName: 'tsit_productos_proforma'
});

// Empresa ↔ Proforma
Proforma.belongsTo(Config, { foreignKey: 'ID_EMPRESA', targetKey: 'ID_EMPRESA' });
Config.hasMany(Proforma, { foreignKey: 'ID_EMPRESA', sourceKey: 'ID_EMPRESA' });

// Proforma ↔ Detalles de proforma
DetailsProforma.belongsTo(Proforma, { foreignKey: 'ID_PROFORMA', targetKey: 'ID_PROFORMA' });
Proforma.hasMany(DetailsProforma, { foreignKey: 'ID_PROFORMA', sourceKey: 'ID_PROFORMA' });

// Producto ↔ Detalles de proforma
DetailsProforma.belongsTo(Product, { foreignKey: 'ID_PRODUCTO', targetKey: 'ID_PRODUCT' });
Product.hasMany(DetailsProforma, { foreignKey: 'ID_PRODUCTO', sourceKey: 'ID_PRODUCT' });



export {Proforma, DetailsProforma};