//import { updateCategory } from "../../api/category";
import { getAllCredits, addPayment, modifyPayment } from "../../api/credit"; //Falta importar los demas endpoints

export const creditConfig = {

    entityName: "Crédito",
    titlePage: "Créditos",
    entityMessage: "Gestión de los créditos de clientes",
    entityKey: "credits",
    expandibleKey: "payments",

    columns: [
        {field: "DSC_NOMBRE", label: "Nombre"},
        {field: "MON_PENDIENTE", label: "Monto Pendiente"},
        {field: "FEC_ULTIMOPAGO", label: "Fecha ultimo pago"},
        {field: "FEC_VENCIMIENTO", label: "Fecha vencimiento"},
        {field: "ESTADO_CREDITO", label: "Estado"},
        {field: "actions", label: "Acciones"},
        // {field: "", label: ""},
    ],
    //Campos para el formulario
    fields: [
        {name: "", label: "", type: "", required: true},
    ],
    api: {
        //Faltan las demas funciones del API
        fetchAll: getAllCredits,
        create: addPayment,
        update: modifyPayment,
        /*searchByName: searchCredits,*/
    },

    transformData: {
        toFrontend: (credit) =>({
            //valores para mostrar en front
            id: credit.ID_CREDITO,
            nombre: credit.sale?.Client?.DSC_NOMBRE || "Sin cliente",
            mon_pendiente: credit.MON_PENDIENTE,
            fec_ultimoPago: credit.FEC_ULTIMOPAGO,
            fec_vencimiento: credit.FEC_VENCIMIENTO,
            estado_credito: credit.ESTADO_CREDITO,
            payments: credit.payments?.map((payments) => ({
                id_abono: payments.ID_ABONO,
                fec_abono: payments.FEC_ABONO,
                mon_abono: payments.MON_ABONADO,
                
            })),
        }),
        toBackend: async (formData) => {
            //transformar los datos para enviar al backend
        }
    },
    transformConfig: {
        Estado: (item) => (item.ESTADO === 1 ? "ACTIVO" : "INCACTIVO"),
    },
    actions: {
        edit: true,
        delete: true,
        view: true,
    }
};