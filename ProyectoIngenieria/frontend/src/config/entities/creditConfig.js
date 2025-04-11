//import { updateCategory } from "../../api/category";
import { getAllCredits, addPayment, modifyPayment, formatDate, searchCredits, getCreditById } from "../../api/credit"; //Falta importar los demas endpoints

export const creditConfig = {

    entityName: "Crédito",
    titlePage: "Créditos",
    entityMessage: "Gestión de los créditos de clientes",
    entityKey: "credit",
    expandibleKey: "payments",

    columns: [
        { field: "DSC_NOMBRE", label: "Nombre" },
        { field: "MON_PENDIENTE", label: "Monto Pendiente" },
        { field: "FEC_ULTIMOPAGO", label: "Fecha último pago" },
        { field: "FEC_VENCIMIENTO", label: "Fecha vencimiento" },
        { field: "ESTADO_CREDITO", label: "Estado" },
        { field: "actions", label: "Acciones" },
      ],
    //NOTA: Campos para el formulario
    fields: [
        // {name: "FEC_ABONO", label: "Fecha de abono", type: "date", required: true},
        {name: "MON_ABONADO", label: "Monto abonado", type: "number", required: true},
        // {name: "btn_cancel", label: "Botón cancelar", type: "button", required: true},
    ],
    api: {
        //Faltan las demas funciones del API
        fetchAll: getAllCredits,
        create: addPayment,
        update: modifyPayment,
        searchByName: searchCredits,
        getCreditById: getCreditById,
    },

    transformData: {
        toFrontend: (credit) => ({
            id: credit.ID_CREDITO,
            nombre: credit.sale?.Client?.DSC_NOMBRE || "Sin cliente", // Este campo ya está transformado
            mon_pendiente: credit.MON_PENDIENTE,
            fec_ultimoPago: credit.FEC_ULTIMOPAGO,
            fec_vencimiento: credit.FEC_VENCIMIENTO,
            estado_credito: credit.ESTADO_CREDITO,
            payments: credit.payments?.map((payments) => ({
              id_abono: payments.ID_ABONO,
              fec_abono: payments.FEC_ABONO,
              mon_abono: payments.MON_ABONADO,
              btn_cancel: payments.BTN_CANCEL,
            })) || [],
          }),
        toBackend: async (formData) => {
            console.log("FormData de creditConfig.js: ", formData);
            return {
              ID_CREDITO: formData.ID_CREDITO,
              ID_ABONO: formData.ID_ABONO,
              MON_ABONADO: formData.MON_ABONADO,
            };
        },
    },
    // Transformaciones específicas de campos individuales
    transformConfig: {
        ESTADO_CREDITO: (item) => {

          if (item.ESTADO_CREDITO === 0) {
            return "ACTIVO";
          }else if (item.ESTADO_CREDITO === 1){
            return "MOROSO";
          } else{ 
            return "CANCELADO";
          }
        },
        DSC_NOMBRE: (item) => item.sale?.Client?.DSC_NOMBRE || "Sin cliente",
        MON_PENDIENTE: (item) => item.MON_PENDIENTE,
        FEC_ULTIMOPAGO: (item) => formatDate(item.FEC_ULTIMOPAGO),
        FEC_VENCIMIENTO: (item) => formatDate(item.FEC_VENCIMIENTO),
      },
    // Configuración de acciones permitidas
    actions: {
        //edit: true,
        // //delete: true,
        // //grantPermissions: true,
        // view: true,
        manageCredits: true,
    }
};