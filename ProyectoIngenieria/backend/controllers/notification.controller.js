import notification from "../models/notification.model.js";


export const getAllNotifications = async (req, res) => {
    try {
      const notifications = await notification.findAll();
  
      const parsedNotifications = notifications.map(n => {
        let mensajeParseado = null;
  
        try {
          mensajeParseado = JSON.parse(n.MENSAJE);
        } catch (e) {
          mensajeParseado = n.MENSAJE;
        }
  
        return {
          ...n.toJSON(),
          MENSAJE: mensajeParseado,
        };
      });
  
      return res.status(200).json(parsedNotifications);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  };



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
