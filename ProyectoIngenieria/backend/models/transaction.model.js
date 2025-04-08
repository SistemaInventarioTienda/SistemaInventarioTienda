import { DataTypes } from 'sequelize';
import db from '../db.js';

const Transaction = db.define('Transaction', {
    ID_TRANSACCION: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    },
    FEC_TRANSACCION: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    METODO_PAGO: {
        type: DataTypes.STRING(255),
        allowNull: true,
        trim: true,
    },
    MONTO_PAGO: {
        type: DataTypes.DOUBLE,
        allowNull: true,
    },
    DSC_TRANSACCION: {
        type: DataTypes.STRING(500),
        allowNull: true
    },
    TIPO_TRANSACCION: {
        type: DataTypes.STRING(255),
        allowNull: true,
    },
    ESTADO: {
        type: DataTypes.INTEGER,
        allowNull: true,
    }
}, {
    timestamps: false,
    tableName: 'tsit_transacciones',
});

export default Transaction;
