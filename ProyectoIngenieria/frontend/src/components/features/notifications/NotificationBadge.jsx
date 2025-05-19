
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