import React, { useState, useEffect } from 'react';
import { AlertCircle, AlertTriangle, Info, CheckCircle } from 'lucide-react';
import './styles/alert.css';

export function Alert({ type = 'default', message, duration = 3000, onClose }) {
  const [isVisible, setIsVisible] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const fadeOutTime = duration - 1000; // Ajustamos para iniciar el fade-out antes de desaparecer
    const timer = setTimeout(() => {
      setFadeOut(true); // Inicia la animación de salida
    }, fadeOutTime);

    const removeTimer = setTimeout(() => {
      setIsVisible(false); // Remueve la alerta completamente
      if (onClose) onClose();
    }, duration);

    return () => {
      clearTimeout(timer);
      clearTimeout(removeTimer);
    };
  }, [duration, onClose]);

  if (!isVisible) return null;

  const getAlertClass = () => {
    switch (type) {
      case 'error':
        return 'alert error';
      case 'warning':
        return 'alert warning';
      case 'info':
        return 'alert info';
      case 'success':
        return 'alert success';
      default:
        return 'alert';
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'error':
        return <AlertCircle size={20} />;
      case 'warning':
        return <AlertTriangle size={20} />;
      case 'info':
        return <Info size={20} />;
      case 'success':
        return <CheckCircle size={20} />;
      default:
        return null;
    }
  };

  return (
    <div className={`${getAlertClass()} ${fadeOut ? 'fade-out' : ''}`} role="alert">
      <span className="icon">{getIcon()}</span>
      {Array.isArray(message) ? (
        <ul className="message-list">
          {message.map((msg, index) => (
            <li key={index}>{msg}</li>
          ))}
        </ul>
      ) : (
        <p className="message">{message}</p>
      )}
      
    </div>
  );
}