import { DataTypes } from 'sequelize';
import db from '../db.js';
import Category from './category.model.js';

const subcategory = db.define('subcategory', {
  ID_SUBCATEGORIA: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  ID_CATEGORIA: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: Category,
      key: 'ID_CATEGORIA'
    }
  },
  DSC_NOMBRE: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  FEC_CREADOEN: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  subcategoriamodificadoen: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  ESTADO: {
    type: DataTypes.INTEGER,
    allowNull: true,
  }
}, {
  timestamps: false,
  tableName: 'tsim_subcategoria',
});

subcategory.belongsTo(Category, {
  foreignKey: 'ID_CATEGORIA',
  targetKey: 'ID_CATEGORIA'
});

Category.hasMany(subcategory, {
  foreignKey: 'ID_CATEGORIA',
  sourceKey: 'ID_CATEGORIA'
});


export default subcategory;