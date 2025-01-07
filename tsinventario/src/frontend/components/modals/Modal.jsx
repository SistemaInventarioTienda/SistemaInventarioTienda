// Modal.jsx
import React from "react";
import ModalHeader from "./ModalHeader";
import ModalBody from "./ModalBody";
import ModalFooter from "./ModalFooter";
import "./styles/modal.css";

function Modal({ isOpen, title, children, onClose, onSubmit }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="offcanvas offcanvas-end show" tabIndex="-1">
        <div className="modal-data-container">
          <div className="offcanvas-header">
            <h2 className="modal-title">{title}</h2>
            <button onClick={onClose} className="close-btn">Cerrar</button>
          </div>
          <div className="offcanvas-body">{children}</div>
        </div>
      </div>
    </div>
  );
}

export default Modal;
