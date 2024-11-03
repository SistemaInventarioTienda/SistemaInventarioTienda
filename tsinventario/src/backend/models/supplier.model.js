import { DataTypes } from 'sequelize';
import db from '../db.js';


const supplierDirection = db.define('supplierDirection', {
  ID_DIRECCIONPROVEEDOR: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  DSC_DIRECCIONEXACTA: {
    type: DataTypes.STRING(255),
    allowNull: true,
  }
}, {
  timestamps: false,
  tableName: 'tsit_direccionproveedor',
});



const Supplier = db.define('Supplier', {
  ID_PROVEEDOR: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  DSC_NOMBRE: {
    type: DataTypes.STRING(255), // 
    allowNull: true,
    unique: true,
  },
  ID_TIPOPROVEEDOR: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  ID_DIRECCION: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: supplierDirection,
      key: 'ID_DIRECCIONPROVEEDOR',
    }
  },
  ESTADO: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  FEC_CREADOEN: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  FEC_MODIFICADOEN: {
    type: DataTypes.DATE,
    allowNull: true,
  }
}, {
  timestamps: false,
  tableName: 'tsit_proveedor',
});

const numberSupplier = db.define('numberSupplier', {
  ID_TELEFONOPROVEEDOR: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  ID_PROVEEDOR: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: Supplier,
      key: 'ID_PROVEEDOR',
    }
  },
  DSC_TELEFONO: {
    type: DataTypes.STRING(8),
    allowNull: true,
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
  tableName: 'tsit_telefonoproveedor',
});

const mailSupplier = db.define('mailSupplier', {
  ID_CORREOPROVEEDOR: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  ID_PROVEEDOR: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: Supplier,
      key: 'ID_PROVEEDOR',
    }
  },
  DSC_CORREO: {
    type: DataTypes.STRING(100),
    allowNull: true,
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
  tableName: 'tsit_correoproveedor',
});

// Relaciones 
Supplier.hasMany(numberSupplier, { foreignKey: 'ID_PROVEEDOR' });
numberSupplier.belongsTo(Supplier, { foreignKey: 'ID_PROVEEDOR' });

Supplier.hasMany(mailSupplier, { foreignKey: 'ID_PROVEEDOR' });
mailSupplier.belongsTo(Supplier, { foreignKey: 'ID_PROVEEDOR' });

Supplier.belongsTo(supplierDirection, { foreignKey: 'ID_DIRECCION' });
supplierDirection.hasMany(Supplier, { foreignKey: 'ID_DIRECCION' });

export { Supplier, numberSupplier, mailSupplier,supplierDirection };
