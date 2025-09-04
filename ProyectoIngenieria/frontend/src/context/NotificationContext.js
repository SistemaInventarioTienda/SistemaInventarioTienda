// context/NotificationContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import { notificationConfig } from '../config/entities/notificationConfig';
import io from 'socket.io-client';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  // Cargar notificaciones iniciales
  const loadNotifications = async () => {
    try {
      const data = await notificationConfig.api.fetchAll();
      const transformed = data.map(notificationConfig.transformData.toFrontend);
      setNotifications(transformed);
    } catch (error) {
      console.error('Error al cargar notificaciones:', error);
    }
  };

  // Escuchar notificaciones en tiempo real
  useEffect(() => {
    const socket = io.connect('http://localhost:4000');

    socket.on("receive-notification", () => {
      loadNotifications(); // Recargar todas las notificaciones desde la base de datos
    });

    return () => {
      socket.off("receive-notification");
    };
  }, []);

  // Marcar como leído
  const markAsRead = async (id) => {
    try {
      await notificationConfig.api.update(id);
      setNotifications(prev =>
        prev.map(notif => (notif.id === id ? { ...notif, visto: true } : notif))
      );
    } catch (error) {
      console.error("Error al marcar como leída:", error);
    }
  };

  return (
    <NotificationContext.Provider value={{ notifications, markAsRead }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => useContext(NotificationContext);