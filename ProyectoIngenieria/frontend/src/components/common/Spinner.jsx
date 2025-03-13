import React from 'react';
import './styles/spinner.css';

const Spinner = ({ text = "Cargando", local = false }) => {
    return (
        <div className={`spinner-overlay ${local ? 'local-spinner' : ''}`}>
            <div className="spinner-container">
                <div className="spinner-circle"></div>
                <div className="spinner-text">{text}<span className="dots">...</span></div>
            </div>
        </div>
    );
};

export default Spinner;