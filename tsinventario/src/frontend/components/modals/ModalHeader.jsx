// ModalHeader.jsx
import React from "react";

function ModalHeader({ title, onClose }) {
    return (
        <div className="modal-header">
            <h2>{title}</h2>
            <button onClick={onClose}>Cerrar</button>
        </div>
    );
}

export default ModalHeader;