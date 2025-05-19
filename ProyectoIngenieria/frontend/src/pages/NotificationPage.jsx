

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
