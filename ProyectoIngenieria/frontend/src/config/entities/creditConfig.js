import { getAllCredits/*, searchCredits*/ } from "../../api/credit"; //Falta importar los demas endpoints

export const creditConfig = {

    entityName: "Crédito",
    titlePage: "Créditos",
    entityMessage: "Gestión de los créditos de clientes",
    entityKey: "credits",

    columns: [
        {field: "", label: ""},
        {field: "", label: ""},
        {field: "", label: ""},
        {field: "", label: ""},
        {field: "", label: ""},
        {field: "", label: ""},
        {field: "", label: ""},
    ],
    fields: [
        {name: "", label: "", type: "", required: true},
    ],
    api: {
        //Faltan las demas funciones del API
        fetchAll: getAllCredits,
        /*searchByName: searchCredits,*/
    },

    transformData: {
        toFrontend: (credit) =>({
            //valores para mostrar en front
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