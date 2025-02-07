import { DataTypes } from 'sequelize';
import db from '../db.js';


const supplierType = db.define('supplierType', {
  ID_TIPOPROVEEDOR: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
  },
  DSC_NOMBRE: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: null
  },
  FEC_CREADOEN: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: null
  },
  ESTADO: {
      type: DataTypes.INTEGER,
      allowNull: true,
  }
}, {
  tableName: 'tsim_tipoproveedor',
  timestamps: false // Desactiva createdAt y updatedAt si no los necesitas
});

/*
const supplierDirection = db.define('supplierDirection', {
  ID_DIRECCIONPROVEEDOR: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  DSC_DIRECCION: {
    type: DataTypes.STRING(255),
    allowNull: true,
  }
}, {
  timestamps: false,
  tableName: 'tsit_direccionproveedor',
});
*/


const Supplier = db.define('Supplier', {
  ID_PROVEEDOR: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  IDENTIFICADOR_PROVEEDOR: {
    type: DataTypes.STRING(255),
    allowNull: true,
    defaultValue: null
  },
  DSC_NOMBRE: {
    type: DataTypes.STRING(255), // 
    allowNull: true,
    unique: true,
  },
  ID_TIPOPROVEEDOR: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: supplierType,
      key: 'ID_TIPOPROVEEDOR',
    }
  },
  DSC_VENTA: {
    type: DataTypes.STRING(500),
    allowNull: false,
    unique: true,
  },
  CTA_BANCARIA: {
    type: DataTypes.STRING(500),
    allowNull: false,
  },
  DSC_DIRECCIONEXACTA: {
    type: DataTypes.STRING(255),
    allowNull: true,
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

Supplier.belongsTo(supplierType, {
  foreignKey: 'ID_TIPOPROVEEDOR',
  targetKey: 'ID_TIPOPROVEEDOR'
});

supplierType.hasMany(Supplier, {
  foreignKey: 'ID_TIPOPROVEEDOR',
  sourceKey: 'ID_TIPOPROVEEDOR'
});

Supplier.hasMany(numberSupplier, { foreignKey: 'ID_PROVEEDOR' });
numberSupplier.belongsTo(Supplier, { foreignKey: 'ID_PROVEEDOR' });

Supplier.hasMany(mailSupplier, { foreignKey: 'ID_PROVEEDOR' });
mailSupplier.belongsTo(Supplier, { foreignKey: 'ID_PROVEEDOR' });


export { Supplier, numberSupplier, mailSupplier, supplierType };
