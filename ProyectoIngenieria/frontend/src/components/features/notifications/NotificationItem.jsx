
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
 
        }
      }}
      style={{ cursor: visto ? 'default' : 'pointer' }}
    >
      <div className={styles.icon}>{getIconByType(tipo)}</div>
      <div className={styles.content}>
        <strong>{tipo}</strong>
        <p>{mensaje}</p>
        {/* Mostrar productos si hay */}
        {productos && productos.length > 0 && (
          <ul className={styles.productsList}>
            {productos.map((producto, index) => (
              <li key={index} className={styles.productItem}>
                {producto.nombre} - Stock: {producto.stock}
              </li>
            ))}
          </ul>
        )}
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