import { DataTypes } from 'sequelize';
import db from '../db.js';

const Category = db.define('Category', {
ID_CATEGORIA: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  DSC_NOMBRE: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  FEC_CREADOEN: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  FEC_MODIFICADOEN: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  ESTADO: {
    type: DataTypes.INTEGER,
    allowNull: true,
  }
}, {
  timestamps: false,
  tableName: 'tsim_categoria',
});

export default Category;
