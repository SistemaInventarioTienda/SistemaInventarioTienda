// ModalConfirmation.jsx

import React from "react";
import { Button, Alert } from "../ui";

const ModalConfirmation = ({ isOpen, onClose, onDelete, entityName, errorMessages, successMessage }) => {
  if (!isOpen) return null;

  const handleDelete = async () => {
    await onDelete();
  };

  return (
    <div className={`modal fade ${isOpen ? 'show' : ''}`} style={{ display: isOpen ? 'block' : 'none' }} tabIndex="-1" aria-labelledby="modalLabel" aria-hidden="true">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="modalLabel">Eliminar {entityName}</h5>
          </div>
          <div className="modal-body">
            {errorMessages.length > 0 && (
              <Alert
                type="warning"
                message={errorMessages}
                duration={5000}
              />
            )}
            {successMessage && (
              <Alert
                type="success"
                message={successMessage}
                duration={2000}
              />
            )}
            <p>¿Estás seguro que deseas eliminar: {entityName}?</p>
          </div>
          <div className="modal-footer">
            <Button type="button" className="btn btn-secondary" onClick={onClose} data-bs-dismiss="modal">
              Cancelar
            </Button>
            <Button type="button" className="btn btn-danger" onClick={handleDelete}>
              Eliminar
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalConfirmation;
