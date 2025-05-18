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


import React, { useEffect, useState } from 'react'; // Import necessary modules from React
import io from 'socket.io-client'; // Import the socket.io client library

// Establish a socket connection to the server at the specified URL
const socket = io.connect('http://localhost:4000');

export default function NotificationPage() {
  const [receiveMessage, setReceiveMessage] = useState(""); // State to store received message
  
  useEffect(() => {
    socket.on("receive-notification", (data) => {
      console.log("📩 Mensaje recibido del servidor:", data);
      setReceiveMessage(data); // Guarda el mensaje recibido
    });
  
    return () => {
      socket.off("receive-notification");
    };
  }, []); // Empty dependency array ensures this runs only once when the component mounts

  return (
    <div>
      <p>View Receive messages: {receiveMessage}</p> {/* Display the received message */}
    </div>
  );
}