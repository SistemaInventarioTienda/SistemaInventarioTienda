import React from 'react';
import { ShoppingCart, Truck, AlertCircle } from 'lucide-react';

import '../styles/NotificationItem.css';
const getIconByType = (type) => {
  switch (type) {
    case 'venta':
      return <ShoppingCart className="text-green-500" />;
    case 'compra':
      return <Truck className="text-blue-500" />;
    case 'stock-bajo':
      return <AlertCircle className="text-red-500" />;
    default:
      return null;
  }
};

const NotificationItem = ({ notification }) => {
  const { message, type, read, timestamp } = notification;

  const timeAgo = () => {
    const minutes = Math.floor((new Date() - timestamp) / 60000);
    if (minutes < 60) return `${minutes} min`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hr`;
    const days = Math.floor(hours / 24);
    return `${days} día${days > 1 ? 's' : ''}`;
  };

  return (
    <div className={`notification-item ${read ? 'read' : 'unread'}`}>
      {/* <div className="icon">{getIconByType(type)}</div> */}
      <div className="content">
        <p>{message}</p>
        <small>{timeAgo()} atrás</small>
      </div>
      {!read && <span className="dot"></span>}
    </div>
  );
};

export default NotificationItem;