import { getAllNotifications, updateNotification } from "../../api/notification";

export const notificationConfig = {
    api: {
        fetchAll: getAllNotifications,
        update: updateNotification,
    },

    transformData: {
        toFrontend: (notification) => ({
            id: notification.IDENTIFICADOR_NOTIFICACION,
            mensaje: notification.MENSAJE.mensaje,
            fecha: notification.MENSAJE.fecha,
            productos: notification.MENSAJE.productos,
            tipo: notification.MENSAJE.tipo,
            visto: notification.VISTO,
        }),
        toBackend: (formData) => ({
            IDENTIFICADOR_NOTIFICACION: formData.id,
            MENSAJE: JSON.stringify({
                mensaje: formData.mensaje,
                fecha: formData.fecha,
                productos: formData.productos || [],
                tipo: formData.tipo || "sin tipo", 
            }),
            VISTO: formData.visto,
        }),
    }
}