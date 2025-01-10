import React from "react";
import { Button, Alert } from "../common";

const ModalConfirmation = ({
  isOpen,
  onClose,
  onConfirm,
  entityName,
  action = "eliminar",
  errorMessages = [],
  successMessage,
  confirmButtonText = "Eliminar",
  cancelButtonText = "Cancelar",
}) => {
  if (!isOpen) return null;

  const handleConfirm = async () => {
    await onConfirm();
  };

  return (
    <div className={`modal fade ${isOpen ? 'show' : ''}`} style={{ display: isOpen ? 'block' : 'none' }} tabIndex="-1" aria-labelledby="modalLabel" aria-hidden="true">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="modalLabel">
              {action.charAt(0).toUpperCase() + action.slice(1)} {entityName}
            </h5>
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
            <p>¿Estás seguro que deseas {(action === 'eliminar') ? 'eliminar' : (action === 'editar') ? 'editar' : 'agregar'} este registro?</p>
          </div>
          <div className="modal-footer">
            <Button type="button" className="btn btn-secondary" onClick={onClose} data-bs-dismiss="modal">
              {cancelButtonText}
            </Button>
            <Button type="button" className={`btn ${action === 'eliminar' ? 'btn-danger' : 'btn-primary'}`} onClick={handleConfirm}>
              {confirmButtonText}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalConfirmation;