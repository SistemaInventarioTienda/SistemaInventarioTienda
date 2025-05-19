// import React, { useState, useEffect } from 'react';
// import { NotificationsNone as NotificationsNoneIcon } from '@mui/icons-material';
// import Badge from '@mui/material/Badge';
// import { notificationConfig } from '../../../config/entities/notificationConfig.js';
// import io from 'socket.io-client';

// export default function NotificationBadge({ isDarkMode }) {
//   const [notifications, setNotifications] = useState([]);

//   // Cargar notificaciones al iniciar
//   useEffect(() => {
//     const loadNotifications = async () => {
//       try {
//         const data = await notificationConfig.api.fetchAll();
//         const transformed = data.map(notificationConfig.transformData.toFrontend);
//         setNotifications(transformed);
//         console.log("Notificaciones cargadas:", notifications);
//       } catch (error) {
//         console.error('Error cargando notificaciones:', error);
//       }
//     };

//     loadNotifications();
//   }, []);

//   // Escuchar nuevas notificaciones via Socket.IO
//   useEffect(() => {
//     const socket = io.connect('http://localhost:4000');

//     socket.on("receive-notification", (data) => {
//       try {
//         const parsed = JSON.parse(data);

//         const newNotification = notificationConfig.transformData.toFrontend({
//           ID_NOTIFICACION: Date.now(),
//           MENSAJE: parsed,
//           FECHA: new Date().toISOString(),
//           VISTO: false,
//         });

//         setNotifications(prev => [newNotification, ...prev]);
//       } catch (e) {
//         console.error("Error parsing notification:", e);
//       }
//     });

//     return () => {
//       socket.off("receive-notification");
//     };
//   }, []);

//   const unreadCount = notifications.filter(n => !n.visto).length;

//   return (
//     <Badge badgeContent={unreadCount} color="primary">
//       <NotificationsNoneIcon className="navbar-icon" />
//     </Badge>
//   );
// }

// NotificationBadge.jsx
import React from 'react';
import Badge from '@mui/material/Badge';
import { NotificationsNone as NotificationsNoneIcon } from '@mui/icons-material';
import { useNotifications } from './../../../context/NotificationContext.js';

export default function NotificationBadge({ isDarkMode }) {
  const { notifications } = useNotifications();
  const unreadCount = notifications.filter(n => !n.visto).length;

  return (
    <Badge badgeContent={unreadCount} color="primary">
      <NotificationsNoneIcon className="navbar-icon" />
    </Badge>
  );
}