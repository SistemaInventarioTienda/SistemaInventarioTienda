// ModalFooter.jsx
import React from "react";

function ModalFooter({  onClose, mode, onSubmit }) {
    return (
        <div className="modal-footer">
            <div className="modal-footer">
                <button type="button" onClick={onClose} className="close-btn">Cancelar</button>
                <button type="submit" className="add-btn">
                    {mode === "add" ? "Agregar" : "Guardar Cambios"}
                </button>
            </div>
        </div>
    );
}

export default ModalFooter;
