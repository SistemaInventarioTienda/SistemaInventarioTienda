//import { updateCategory } from "../../api/category";
import { getAllCredits, addPayment, modifyPayment, formatDate, searchCredits } from "../../api/credit"; //Falta importar los demas endpoints

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
        {name: "FEC_ABONO", label: "Fecha de abono", type: "text", required: true},
        {name: "MON_ABONADO", label: "Monto abonado", type: "text", required: true},
        // {name: "btn_cancel", label: "Botón cancelar", type: "button", required: true},
    ],
    api: {
        //Faltan las demas funciones del API
        fetchAll: getAllCredits,
        create: addPayment,
        update: modifyPayment,
        searchByName: searchCredits,
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
            return {
                ID_CREDITO: formData.id,
                ID_VENTA: formData.idVenta,
                MON_PENDIENTE: formData.mon_pendiente,
                FEC_ULTIMOPAGO: formData.fec_ultimoPago,
                FEC_VENCIMIENTO: formData.fec_vencimiento,
                ESTADO_CREDITO: formData.estado_credito,
                payments: formData.payments.map((payment) => ({
                    ID_ABONO: payment.id_abono,
                    FEC_ABONO: payment.fec_abono,
                    MON_ABONADO: payment.mon_abono,
                    BTN_CANCEL: payment.btn_cancel, // Incluye btn_cancel si el backend lo necesita
                })),
            };
        },
    },
    // Transformaciones específicas de campos individuales
    transformConfig: {
        ESTADO_CREDITO: (item) => {

          if (item.MON_PENDIENTE === 0) {
            return "CANCELADO";
          }else if (item.ESTADO_CREDITO <= 1){
            return "ACTIVO";
          } else{ 
            return "MOROSO";
          }
        },
        DSC_NOMBRE: (item) => item.sale?.Client?.DSC_NOMBRE || "Sin cliente",
        MON_PENDIENTE: (item) => item.MON_PENDIENTE,
        FEC_ULTIMOPAGO: (item) => formatDate(item.FEC_ULTIMOPAGO),
        FEC_VENCIMIENTO: (item) => formatDate(item.FEC_VENCIMIENTO),
      },
    // Configuración de acciones permitidas
    actions: {
        // edit: true,
        // //delete: true,
        // //grantPermissions: true,
        // view: true,
        manageCredits: true,
    }
};