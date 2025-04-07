import { DataTypes } from 'sequelize';
import db from '../db.js';
import Client from '../models/client.model.js';
import Product from '../models/product.model.js';

const sale = db.define('sale',{
    ID_VENTA: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      ID_CLIENTE: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: Client,
          key: 'ID_CLIENTE'
        }
      },
      FEC_VENTA: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      PORCENT_IMPUESTO:{
        type: DataTypes.DOUBLE,
        allowNull: false,
        defaultValue: 0,
      },
      METODO_PAGO:{
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      DSC_VENTA:{
        type: DataTypes.STRING(500),
        allowNull: true,
      },
      ESTADO_CREDITO:{
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      MONT_SUBTOTAL:{
        type: DataTypes.DOUBLE,
        allowNull: false,
      },
      PORCENT_DESCUENTO:{
        type: DataTypes.DOUBLE,
        allowNull: false,
        defaultValue: 0,
      },
      ESTADO: {
        type: DataTypes.INTEGER,
        allowNull: true,
    }
},{
    timestamps: false,
    tableName: 'tsit_venta'
});


const details = db.define('details',{
    ID_DETALLEVENTA: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      ID_VENTA: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: sale,
          key: 'ID_VENTA'
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
      MONT_UNITARIO:{
        type: DataTypes.DOUBLE,
        allowNull: false,
      },
      CANTIDAD:{
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
      }
},{
    timestamps: false,
    tableName: 'tsit_detalleventa'
});


const credit = db.define('credit',{
    ID_CREDITO: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      ID_VENTA: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: sale,
          key: 'ID_VENTA'
        }
      },
      FEC_ULTIMOPAGO:{
        type: DataTypes.DATE,
        allowNull: false,
      },
      FEC_VENCIMIENTO:{
        type: DataTypes.DATE,
        allowNull: false,
      },
      MON_PENDIENTE:{
        type: DataTypes.DOUBLE,
        allowNull: false,
      },
      ESTADO_CREDITO:{
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 1,
      }
},{
    timestamps: false,
    tableName: 'tsit_credito'
});

const payment = db.define('payment',{
    ID_ABONO: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      ID_CREDITO: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: credit,
          key: 'ID_CREDITO'
        }
      },
      FEC_ABONO:{
        type: DataTypes.DATE,
        allowNull: false,
      },
      MON_ABONADO:{
        type: DataTypes.DOUBLE,
        allowNull: false,
      }
},{
    timestamps: false,
    tableName: 'tsit_abono'
});

// relacion de venta - cliente
sale.belongsTo(Client,{
    foreignKey: 'ID_CLIENTE',
    targetKey: 'ID_CLIENTE'
  });

Client.hasMany(sale,{
    foreignKey: 'ID_CLIENTE',
    sourceKey: 'ID_CLIENTE'});

// relacion de detalle - venta y producto - detalle
details.belongsTo(sale,{
    foreignKey: 'ID_VENTA',
    targetKey:  'ID_VENTA'
      });
    
sale.hasMany(details,{
    foreignKey: 'ID_VENTA',
    sourceKey:  'ID_VENTA'
});

details.belongsTo(Product,{
    foreignKey: 'ID_PRODUCTO',
    targetKey: 'ID_PRODUCT'
  });

Product.hasMany(details,{
    foreignKey: 'ID_PRODUCTO',
    sourceKey: 'ID_PRODUCT'
});

//relacion de credito - venta
sale.hasMany(credit,{
    foreignKey: 'ID_VENTA',
    sourceKey: 'ID_VENTA'
});

credit.belongsTo(sale,{
    foreignKey: 'ID_VENTA',
    targetKey: 'ID_VENTA'
});

// relacion de abono - credito
payment.belongsTo(credit,{
    foreignKey: 'ID_CREDITO',
    targetKey: 'ID_CREDITO'
});
credit.hasMany(payment,{
    foreignKey: 'ID_CREDITO',
    sourceKey: 'ID_CREDITO'
});


export  {sale,details,credit,payment,db};