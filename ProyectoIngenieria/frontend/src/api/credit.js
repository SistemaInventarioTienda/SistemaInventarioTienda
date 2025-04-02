import axios from '../api/axios';

export const getAllCredits = async (page, pageSize, orderByField, order) =>{
    try {
        // NOTA: Datos simulados para desarrollo. Reemplazar con la llamada real al API cuando esté disponible.
        const response = {
            data: [
                {ID_CREDITO: 1, name: 'Cliente01', FEC_ULTIMOPAGO: '2025-02-19 00:56:15', FEC_VENCIMIENTO:'2025-02-19 00:56:15', MON_PENDIENTE: 20000, ESTADO_CREDITO: 'Morozo'},
                {ID_CREDITO: 2, name: 'Cliente02', FEC_ULTIMOPAGO: '2025-02-19 00:56:15', FEC_VENCIMIENTO:'2025-02-19 00:56:15', MON_PENDIENTE: 20000, ESTADO_CREDITO: 'Morozo'},
                {ID_CREDITO: 3, name: 'Cliente03', FEC_ULTIMOPAGO: '2025-02-19 00:56:15', FEC_VENCIMIENTO:'2025-02-19 00:56:15', MON_PENDIENTE: 20000, ESTADO_CREDITO: 'Morozo'},
                {ID_CREDITO: 4, name: 'Cliente04', FEC_ULTIMOPAGO: '2025-02-19 00:56:15', FEC_VENCIMIENTO:'2025-02-19 00:56:15', MON_PENDIENTE: 20000, ESTADO_CREDITO: 'Morozo'},
            ].slice((page - 1) * pageSize, page * pageSize)
        };
        //const response = await axios.get(``, {params: {page, pageSize, orderByField, order}}); //Falta la ruta del endpoint.
        return response.data;
    } catch (error) {
        console.error('Error fetching credits: ', error.message);
        throw error;
    }
};

// export const searchCredits = async (page, pageSize, termSearch, orderByField, order) => {
//     try {
//         const response = await axios.get(``, {params: {page, pageSize, termSearch, orderByField, order}});//Falta la ruta del endpoint.
//         return response.data;
//     } catch (error) {
//         console.error('Error fetching credits in searchCredits: ', error.message);
//         throw error;
//     }
// };