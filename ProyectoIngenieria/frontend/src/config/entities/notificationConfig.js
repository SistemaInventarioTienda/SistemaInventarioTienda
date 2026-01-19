import { getAllNotifications, updateNotification } from "../../api/notification";

export const notificationConfig = {
    api: {
        fetchAll: getAllNotifications,
        update: updateNotification,
    },

    transformData: {
        toFrontend: (notification) => ({
            id: notification.ID_NOTIFICACION,
            productoId: notification.ID_PRODUCTO,
            tipo: notification.TIPO,
            cantidad: notification.CANTIDAD,
            visto: notification.VISTO,
            fecha: notification.FECHA,
        }),
        toBackend: (formData) => ({
            ID_NOTIFICACION: formData.id,
            ID_PRODUCTO: formData.productoId,
            TIPO: formData.tipo,
            CANTIDAD: formData.cantidad,
            VISTO: formData.visto,
            FECHA: formData.fecha,
        }),
    }
}