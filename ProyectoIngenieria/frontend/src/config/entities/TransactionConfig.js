import {
  registerTransaction,
  updateTransaction,
  deleteTransaction,
  getAllTransaction,
  search_Transaction,
} from "../../api/Transaction";
import { formatPrice } from "../../utils/formatters";

import { paymentMethods } from "../../constants/paymentOptions";

export const TransactionConfig = {
  // Nombre y descripción de la entidad
  entityName: "Transaccion",
  titlePage: "Transacciones",
  entityMessage: "Gestión de Transacciones del sistema",

  // Identificador clave de la entidad
  entityKey: "transaction", // Clave única para identificar los datos de esta entidad

  // Configuración de columnas para la tabla
  columns: [
    { field: "FEC_TRANSACCION", label: "Fecha de Transacción" },
    { field: "METODO_PAGO", label: "Método de entrada" },
    { field: "MONTO_PAGO", label: "Monto", formatter: formatPrice },
    { field: "DSC_TRANSACCION", label: "Descripción" },
    { field: "TIPO_TRANSACCION", label: "Método de salida" },
    { field: "ESTADO", label: "Estado" },
    { field: "actions", label: "Acciones" },
  ],

  // Configuración de campos del formulario
  fields: [
    {
      name: "METODO_PAGO",
      label: "Método de entrada",
      type: "select",
      required: true,
      options: paymentMethods,
    },
    {
      name: "MONTO_PAGO",
      label: "Monto",
      type: "text",
      required: true,
    },
    {
      name: "DSC_TRANSACCION",
      label: "Descripción",
      type: "textarea",
      required: true,
    },
    {
      name: "TIPO_TRANSACCION",
      label: "Método de salida",
      type: "select",
      required: true,
      options: paymentMethods,
    },
    {
      name: "estado",
      label: "Estado",
      type: "select",
      required: true,
      options: [
        { value: 1, label: "Activo" },
        { value: 0, label: "Inactivo" },
      ],
    },
  ],

  // Funciones API específicas de la entidad
  api: {
    fetchAll: getAllTransaction,
    searchTransaction: search_Transaction,
    create: registerTransaction,
    update: updateTransaction,
    delete: deleteTransaction,
  },

  // Transformaciones de datos
  transformData: {
    // Transformar datos desde la API hacia el frontend
    toFrontend: (transaction) => ({
      ID_TRANSACCION: transaction.ID_TRANSACCION,
      FEC_TRANSACCION: transaction.FEC_TRANSACCION,
      METODO_PAGO: transaction.METODO_PAGO,
      MONTO_PAGO: transaction.MONTO_PAGO,
      DSC_TRANSACCION: transaction.DSC_TRANSACCION,
      TIPO_TRANSACCION: transaction.TIPO_TRANSACCION,
      estado: transaction.ESTADO,
    }),

    // Transformar datos desde el formulario hacia la API
    toBackend: (formData) => ({
      ID_TRANSACCION: formData.ID_TRANSACCION || 0,
      METODO_PAGO: formData.METODO_PAGO,
      MONTO_PAGO: parseFloat(formData.MONTO_PAGO) || 0,
      DSC_TRANSACCION: formData.DSC_TRANSACCION,
      TIPO_TRANSACCION: formData.TIPO_TRANSACCION,
      ESTADO: formData.estado,
    }),
  },

  transformConfig: {
    // ESTADO: (item) => (item.ESTADO === 1 ? "ACTIVO" : "INACTIVO"),
    FEC_TRANSACCION: (item) =>
      item.FEC_TRANSACCION
        ? new Date(item.FEC_TRANSACCION).toLocaleDateString("es-ES", {
            day: "2-digit",
            month: "long",
            year: "numeric",
          })
        : null,
  },

  // Configuración de acciones permitidas
  actions: {
    edit: true,
    delete: true,
    view: true,
  },
};
