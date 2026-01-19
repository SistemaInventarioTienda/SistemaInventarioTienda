import { DataTypes } from 'sequelize';
import db from '../db.js';

const Notification = db.define(
  "tsit_notificaciones",
  {
    ID_NOTIFICACION: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    ID_PRODUCTO: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    TIPO: {
      type: DataTypes.ENUM("STOCK_BAJO"),
      allowNull: false,
    },
    CANTIDAD: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    VISTO: {
      type: DataTypes.TINYINT,
      defaultValue: 0,
    },
    FECHA: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    timestamps: false,
    freezeTableName: true,
  }
);

export default Notification;
