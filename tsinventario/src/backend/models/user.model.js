import { DataTypes } from 'sequelize';
import db from '../db.js';

const User = db.define('User', {
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    trim: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true, 
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  }
}, {
  timestamps: true,
  tableName: 'user',
});

export default User;
