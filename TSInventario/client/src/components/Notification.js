import React from 'react';
import './Notification.css';

const Notification = ({ message, error, onClose }) => {
    return (
        <div className={`notification ${error ? 'error' : ''}`} onClick={onClose}>
            <div className="notification__body">
                <img
                    src={error ? '/Assets/error.svg' : '/Assets/check.svg'}
                    alt="Notification Icon"
                    className="notification__icon"
                />
                {message}
            </div>
            <div className={`notification__progress ${error ? 'error' : ''}`}></div>
        </div>
    );
};

export default Notification;
