import Notification from "../models/notification.model.js";

export const getAllNotifications = async (req, res) => {
  try {
    const notifications = await Notification.findAll({
      where: { TIPO: "STOCK_BAJO" },
      order: [["FECHA", "DESC"]],
    });

    return res.status(200).json(notifications);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const updateNotification = async (req, res) => {
  try {
    const noti = await Notification.findByPk(req.params.id);

    if (!noti)
      return res.status(404).json({ message: "No encontrada" });

    await noti.update({ VISTO: 1 });

    return res.status(200).json({ message: "Notificación vista" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};