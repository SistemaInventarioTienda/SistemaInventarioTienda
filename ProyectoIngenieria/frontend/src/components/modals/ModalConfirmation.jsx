import React from "react";
import { toast } from "sonner";
import './styles/modalConfirmation.css';

const ModalConfirmation = ({
  isOpen,
  onClose,
  onConfirm,
  entityName,
  action = "delete",
  message,
  confirmButtonText = "Eliminar",
  cancelButtonText = "Cancelar",
}) => {
  if (!isOpen) return null;

  const actionTranslations = {
    add: "Agregar",
    edit: "Editar",
    delete: "Eliminar",
    logout: "Cerrar Sesión"
  };

  const translatedAction = actionTranslations[action] || action;

  // Mensaje por defecto si no se provee message
  const defaultMessage = `¿Estás seguro que deseas ${translatedAction.toLowerCase()} este ${entityName?.toLowerCase() || ''}?`;

  const handleConfirm = async (event) => {
    try {
      await onConfirm(event);
      onClose();
    } catch (error) {
      console.error("Error:", error);
      toast.error(error.response?.data?.message || "Error al realizar la operación.");
    }
    onClose();
  };

  return (
    <div
      className={`modal-confirmation-overlay ${isOpen ? "show" : ""}`}
      style={{ display: isOpen ? "block" : "none" }}
    >
      <div className="modal-confirmation-dialog">
        <div className="modal-confirmation-content">
          <div className="modal-confirmation-header">
            <h5 className="modal-confirmation-title">
              {translatedAction} {entityName}
            </h5>
          </div>
          <div className="modal-confirmation-body">
            <p>
              {message || defaultMessage}
            </p>
          </div>
          <div className="modal-confirmation-footer">
            <button
              type="button"
              className="modal-confirmation-cancel-btn"
              onClick={onClose}
            >
              {cancelButtonText}
            </button>
            <button
              type="button"
              className={`modal-confirmation-confirm-btn ${action === "delete" ? "danger" : "primary"
                }`}
              onClick={handleConfirm}
            >
              {confirmButtonText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalConfirmation;