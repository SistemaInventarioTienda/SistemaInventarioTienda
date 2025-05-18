import notification from "../models/notification.model";



export const updateNotification = async (req, res) => {
    try {

        const foundNotification = await notification.findOne({ where: { IDENTIFICADOR_NOTIFICACION: req.params.id } });
        if (!foundNotification) return res.status(404).json({ message: "Transacción no encontrada." });

        await foundNotification.update({
            VISTO: 1,
        })

        return res.status(200).json({message: "Notificacion Vista"})
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}
