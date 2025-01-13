import React from "react";

function ModalHeader({ title, onClose }) {
    return (
        <div className="modal-header">
                <h2 className="modal-title">{title}</h2>
                <button onClick={onClose} className="close-btn">Cerrar</button>
        </div>
    );
}

export default ModalHeader;
