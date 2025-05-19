// import { useState } from "react";
// import PageLayout from "../components/layout/PageLayout";
// import { Tab, Tabs, TabList, TabPanel } from "../components/common"
// import { mockNotifications } from "../utils/mockNotifications";
// import NotificationItem from "../components/features/notifications/NotificationItem";

// import "./styles/NotificationPage.css"
// function NotificationPage() {
//   const [activeTab, setActiveTab] = useState("generate");

// const filteredNotifications = () => {
//     switch (activeTab) {
//       case "all":
//         return mockNotifications;
//       case "unread":
//         return mockNotifications.filter(n => !n.read);
//       case "read":
//         return mockNotifications.filter(n => n.read);
//       default:
//         return mockNotifications;
//     }
//   };

//   return (
//     <PageLayout>
//       <div className="page-header">
//         <div>
//           <h1>Notificaciones</h1>
//           <p>Gestión de notificaciones del sistema</p>
//         </div>
//       </div>

//       <div className="notifications-tabs-container">
//         <Tabs activeTab={activeTab} onChange={setActiveTab} className="notifications-tabs">
//             <TabList className="notifications-tab-list">
//                 <Tab value="all">Todas</Tab>
//                 <Tab value="unread">No leídas</Tab>
//                 <Tab value="read">Leídas</Tab>
//             </TabList>
//             <TabPanel value = "all" active={activeTab === "all"}>

//                 {filteredNotifications().map(notification => (
//                 <NotificationItem key={notification.id} notification={notification} />
//               ))}
//             </TabPanel>
//             <TabPanel value = "unread" active={activeTab === "unread"}>

//                {mockNotifications.filter(n => !n.read).map(notification => (
//                 <NotificationItem key={notification.id} notification={notification} />
//               ))}
//             </TabPanel>
//             <TabPanel value = "read" active={activeTab === "read"}>

//                {mockNotifications.filter(n => n.read).map(notification => (
//                 <NotificationItem key={notification.id} notification={notification} />
//               ))}
//             </TabPanel>
//         </Tabs>
//       </div>
//     </PageLayout>
//   );
// }

// export default NotificationPage;

// import React, { useEffect, useState } from 'react'; // Import necessary modules from React
// import io from 'socket.io-client'; // Import the socket.io client library

// // Establish a socket connection to the server at the specified URL
// const socket = io.connect('http://localhost:4000');

// export default function NotificationPage() {
//   const [receiveMessage, setReceiveMessage] = useState(""); // State to store received message

//   useEffect(() => {
//     socket.on("receive-notification", (data) => {
//       console.log("📩 Mensaje recibido del servidor:", data);
//       setReceiveMessage(data); // Guarda el mensaje recibido
//     });

//     return () => {
//       socket.off("receive-notification");
//     };
//   }, []); // Empty dependency array ensures this runs only once when the component mounts

//   return (
//     <div>
//       <p>View Receive messages: {receiveMessage}</p> {/* Display the received message */}
//     </div>
//   );
// }

import React, { useState, useEffect } from "react";
import PageLayout from "../components/layout/PageLayout";
import { Tab, Tabs, TabList, TabPanel } from "../components/common";
import NotificationItem from "../components/features/notifications/NotificationItem";
import { notificationConfig } from "../config/entities/notificationConfig.js";
import { useNotifications } from "../context/NotificationContext.js";
//import io from "socket.io-client";

import "./styles/NotificationPage.css";

// Connect to your backend server
//const socket = io.connect("http://localhost:4000");

export default function NotificationPage() {
  const [activeTab, setActiveTab] = useState("all");
  const { notifications, markAsRead } = useNotifications();

  // Recibe nuevas notificaciones desde el socket
//   useEffect(() => {
//   socket.on("receive-notification", async () => {
//     try {
//       const data = await notificationConfig.api.fetchAll();
//       const transformed = data.map(notificationConfig.transformData.toFrontend);
//       setNotifications(transformed);
//     } catch (error) {
//       console.error("❌ Error al recargar notificaciones:", error);
//     }
//   });

//   return () => {
//     socket.off("receive-notification");
//   };
// }, []);

  // Marca una notificación como leída
  // const markAsRead = async (id) => {
  //   try {
  //     await notificationConfig.api.update(id); // Marca como leído en BD
  //     setNotifications((prev) =>
  //       prev.map((notif) =>
  //         notif.id === id ? { ...notif, visto: true } : notif
  //       )
  //     );
  //   } catch (error) {
  //     console.error("Error al marcar como leída:", error);
  //   }
  // };
  // Filtra notificaciones según la pestaña activa
  const filteredNotifications = () => {
    switch (activeTab) {
      case "all":
        return notifications;
      case "unread":
        return notifications.filter((n) => !n.visto);
      case "read":
        return notifications.filter((n) => n.visto);
      default:
        return notifications;
    }
  };

  return (
    <PageLayout>
      <div className="page-header">
        <div>
          <h1>Notificaciones</h1>
          <p>Gestión de notificaciones del sistema</p>
        </div>
      </div>

      <div className="notifications-tabs-container">
        <Tabs
          activeTab={activeTab}
          onChange={setActiveTab}
          className="notifications-tabs"
        >
          <TabList className="notifications-tab-list">
            <Tab value="all">Todas</Tab>
            <Tab value="unread">No leídas</Tab>
            <Tab value="read">Leídas</Tab>
          </TabList>

          <TabPanel value="all" active={activeTab === "all"}>
            {filteredNotifications().map((notification) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
                onMarkAsRead={() => markAsRead(notification.id)}
              />
            ))}
            {filteredNotifications().length === 0 && (
              <p>No hay notificaciones.</p>
            )}
          </TabPanel>

          <TabPanel value="unread" active={activeTab === "unread"}>
            {filteredNotifications().map((notification) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
                onMarkAsRead={() => markAsRead(notification.id)}
              />
            ))}
            {filteredNotifications().length === 0 && (
              <p>No hay notificaciones no leídas.</p>
            )}
          </TabPanel>

          <TabPanel value="read" active={activeTab === "read"}>
            {filteredNotifications().map((notification) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
                onMarkAsRead={() => markAsRead(notification.id)}
              />
            ))}
            {filteredNotifications().length === 0 && (
              <p>No hay notificaciones leídas.</p>
            )}
          </TabPanel>
        </Tabs>
      </div>
    </PageLayout>
  );
}
