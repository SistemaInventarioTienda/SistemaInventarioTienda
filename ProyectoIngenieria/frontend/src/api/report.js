import axios from './axios';

// Función para generar un nuevo reporte
export const generateReport = async ({ EXTENSION, TYPE, MIN_FEC, MAX_FEC }) => {
    try {
        const response = await axios.post('/reports/reports', {
            EXTENSION,
            TYPE,
            MIN_FEC,
            MAX_FEC
        });
        return response.data;
    } catch (error) {
        console.error('Error generando el reporte:', error.message);
        throw error;
    }
};

// Función para programar un nuevo reporte
export const programReport = async ({ EXTENSION, TYPE, MIN_FEC, MAX_FEC, EMAIL, FRECUENCY }) => {
    try {
        const response = await axios.post('/reports/programa', {
            EXTENSION,
            TYPE,
            MIN_FEC,
            MAX_FEC,
            EMAIL,
            FRECUENCY
        });
        return response.data;
    } catch (error) {
        console.error('Error programando el reporte:', error.message);
        throw error;
    }
};

// Función para descargar el reporte
export const downloadReport = async (fileName) => {
    try {
        const response = await axios.get(`/reports/download_report?file=${fileName}`, {
            responseType: 'blob',
        });
    
        const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));

        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', fileName);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
    } catch (error) {
        console.error('Error descargando el PDF:', error.message);
        throw new Error('El documento no existe en el servidor');
    }
};

// Función para obtener el historial de reportes
export const getReports = async (page, pageSize, orderByField, order) => {
    try {
        const response = await axios.get('/reports/get_all_reports', {
            params: { page, pageSize, orderByField, order }
        });

        const plainReports = response.data;

        const total = plainReports.length;
        const totalPages = Math.ceil(total / pageSize);
        const currentPage = page;

        // Paginar manualmente
        const startIndex = (page - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        const paginatedReports = plainReports.slice(startIndex, endIndex);

 

        return {
            total,
            totalPages,
            currentPage,
            pageSize,
            reports: paginatedReports
        };
    } catch (error) {
        console.error('Error obteniendo los reportes:', error.message);
        throw error;
    }
};

// Función para obtener el historial de reportes programados
export const getScheduledReports = async (page, pageSize, orderByField, order) => {
    try {
        // const response = await axios.get('/reports/all_program_reports', {
        //     params: { page, pageSize, orderByField, order }
        // });

        return {
            "total": 2,
            "totalPages": 1,
            "currentPage": 1,
            "pageSize": 5,
            "scheduledReports": [
                {
                    "nombreReporte": "Reporte de ventas programado",
                    "tipoReporte": "Ventas",
                    "formato": "pdf",
                    "fechaProgramacion": "2025-05-15",
                    "frecuencia": "semanal",
                    "correo": "ventas@empresa.com",
                    "filename": "Ventas/Ventas-programadas-2025-05-15.pdf",
                    "estado": "1"
                },
                {
                    "nombreReporte": "Reporte de inventario programado",
                    "tipoReporte": "Inventario",
                    "formato": "excel",
                    "fechaProgramacion": "2025-05-20",
                    "frecuencia": "mensual",
                    "correo": "inventario@empresa.com",
                    "filename": "Inventario/Inventario-programado-2025-05-20.xlsx",
                    "estado": "1"
                }
            ]
        };

        return "";
    } catch (error) {
        console.error('Error obteniendo reportes programados:', error.message);
        throw error;
    }
};