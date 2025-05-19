// import React from 'react';
// import { ShoppingCart, Truck, AlertCircle } from 'lucide-react';

// import '../styles/NotificationItem.css';
// const getIconByType = (type) => {
//   switch (type) {
//     case 'venta':
//       return <ShoppingCart className="text-green-500" />;
//     case 'compra':
//       return <Truck className="text-blue-500" />;
//     case 'stock-bajo':
//       return <AlertCircle className="text-red-500" />;
//     default:
//       return null;
//   }
// };

// const NotificationItem = ({ notification }) => {
//   const { message, type, read, timestamp } = notification;

//   const timeAgo = () => {
//     const minutes = Math.floor((new Date() - timestamp) / 60000);
//     if (minutes < 60) return `${minutes} min`;
//     const hours = Math.floor(minutes / 60);
//     if (hours < 24) return `${hours} hr`;
//     const days = Math.floor(hours / 24);
//     return `${days} día${days > 1 ? 's' : ''}`;
//   };

//   return (
//     <div className={`notification-item ${read ? 'read' : 'unread'}`}>
//       {/* <div className="icon">{getIconByType(type)}</div> */}
//       <div className="content">
//         <p>{message}</p>
//         <small>{timeAgo()} atrás</small>
//       </div>
//       {!read && <span className="dot"></span>}
//     </div>
//   );
// };

// export default NotificationItem;
// import React from 'react';
// import { ShoppingCart, Truck, AlertCircle } from 'lucide-react';

// import styles from '../styles/NotificationItem.module.css';
// console.log(require('../styles/NotificationItem.css'))

// const getIconByType = (type) => {
//   if (!type) return null;

//   const lowerType = type.toLowerCase();

//   if (lowerType.includes('venta')) {
//     return <ShoppingCart className="text-green-500" />;
//   } else if (lowerType.includes('compra')) {
//     return <Truck className="text-blue-500" />;
//   } else if (lowerType.includes('stock') || lowerType.includes('alerta')) {
//     return <AlertCircle className="text-red-500" />;
//   }

//   return null;
// };

// const NotificationItem = ({ notification, onMarkAsRead }) => {
//   const { id, mensaje, fecha, productos, tipo, visto } = notification;

//   const timeAgo = () => {
//     const now = new Date();
//     const timestamp = new Date(fecha);
//     const diffMs = now - timestamp;
//     const minutes = Math.floor(diffMs / 60000);

//     if (minutes < 60) return `${minutes} min`;
//     const hours = Math.floor(minutes / 60);
//     if (hours < 24) return `${hours} hr`;
//     const days = Math.floor(hours / 24);
//     return `${days} día${days > 1 ? 's' : ''}`;
//   };

//   return (
//     <div
//       className={`notification-item ${visto ? 'read' : 'unread'}`}
//       onClick={() => !visto && onMarkAsRead(id)}
//       style={{ cursor: visto ? 'default' : 'pointer' }}
//     >
//       <div className="icon">{getIconByType(tipo)}</div>
//       <div className="content">
//         <strong>{tipo}</strong>
//         <p>{mensaje}</p>
//         {productos && productos.length > 0 && (
//           <ul className="products-list">
//             {productos.map((producto, index) => (
//               <li key={index}>
//                 {producto.nombre} - Stock: {producto.stock}
//               </li>
//             ))}
//           </ul>
//         )}
//         <small>{timeAgo()} atrás</small>
//       </div>
//       {/* Mostrar punto rojo si no está leído */}
//       {!visto && <span className="dot"></span>}

//       {/* Mostrar check verde si ya está leído */}
//       {visto && <span className="check-icon">✔️</span>}
//     </div>
//   );
// };

// export default NotificationItem;

// import React from 'react';
// import { ShoppingCart, Truck, AlertCircle } from 'lucide-react';

// // Importamos los estilos como objeto
// import styles from '../styles/NotificationItem.module.css';

// const getIconByType = (type) => {
//   if (!type) return null;

//   const lowerType = type.toLowerCase();

//   if (lowerType.includes('venta')) {
//     return <ShoppingCart className={styles['icon']} />;
//   } else if (lowerType.includes('compra')) {
//     return <Truck className={styles['icon']} />;
//   } else if (lowerType.includes('stock') || lowerType.includes('alerta')) {
//     return <AlertCircle className={styles['icon']} />;
//   }

//   return null;
// };

// const NotificationItem = ({ notification, onMarkAsRead }) => {
//   const { id, mensaje, fecha, productos, tipo, visto } = notification;

//   const timeAgo = () => {
//     const now = new Date();
//     const timestamp = new Date(fecha);
//     const diffMs = now - timestamp;
//     const minutes = Math.floor(diffMs / 60000);

//     if (minutes < 60) return `${minutes} min`;
//     const hours = Math.floor(minutes / 60);
//     if (hours < 24) return `${hours} hr`;
//     const days = Math.floor(hours / 24);
//     return `${days} día${days > 1 ? 's' : ''}`;
//   };

//   return (
//     <div
//       className={`${styles.notificationItem} ${visto ? styles.read : ''}`}
//       onClick={() => !visto && onMarkAsRead(id)}
//       style={{ cursor: visto ? 'default' : 'pointer' }}
//     >
//       <div className={styles.icon}>{getIconByType(tipo)}</div>
//       <div className={styles.content}>
//         <strong>{tipo}</strong>
//         <p>{mensaje}</p>
//         <small>{timeAgo()} atrás</small>
//       </div>

//       {/* Punto rojo si no está leído */}
//       {!visto && <span className={styles.dot}></span>}

//       {/* Check verde si ya está leído */}
//       {visto && <span className={styles.checkIcon}>✔️</span>}
//     </div>
//   );
// };

// export default NotificationItem;
import React from 'react';
import { ShoppingCart, Truck, AlertCircle } from 'lucide-react';

// Importamos los estilos como objeto
//import styles from './NotificationItem.module.css';
import styles from '../styles/NotificationItem.module.css';

const getIconByType = (type) => {
  if (!type) return null;

  const lowerType = type.toLowerCase();

  if (lowerType.includes('venta')) {
    return <ShoppingCart className={styles['icon']} />;
  } else if (lowerType.includes('compra')) {
    return <Truck className={styles['icon']} />;
  } else if (lowerType.includes('stock') || lowerType.includes('alerta')) {
    return <AlertCircle className={styles['icon']} />;
  }

  return null;
};

const NotificationItem = ({ notification, onMarkAsRead }) => {
  const { id, mensaje, fecha, productos, tipo, visto } = notification;

  const timeAgo = () => {
    const now = new Date();
    const timestamp = new Date(fecha);
    const diffMs = now - timestamp;
    const minutes = Math.floor(diffMs / 60000);

    if (minutes < 60) return `${minutes} min`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hr`;
    const days = Math.floor(hours / 24);
    return `${days} día${days > 1 ? 's' : ''}`;
  };

  return (
    <div
      className={`${styles.notificationItem} ${visto ? styles.read : ''}`}
      onClick={() => {
        if (!visto) {
          onMarkAsRead(id);
          console.log(`Notificación ${id} marcada como leída.`);
        }
      }}
      style={{ cursor: visto ? 'default' : 'pointer' }}
    >
      <div className={styles.icon}>{getIconByType(tipo)}</div>
      <div className={styles.content}>
        <strong>{tipo}</strong>
        <p>{mensaje}</p>
        <small>{timeAgo()} atrás</small>
      </div>

      {/* Punto rojo si no está leído */}
      {!visto && <span className={styles.dot}></span>}

      {/* Check verde si ya está leído */}
      {visto && <span className={styles.checkIcon}>✔️</span>}
    </div>
  );
};

export default NotificationItem;