import React from "react";
import ModalHeader from "./ModalHeader";
import ModalBody from "./ModalBody";
import ModalFooter from "./ModalFooter";
import "./styles/modal.css";

function Modal({ isOpen, title, children, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="offcanvas offcanvas-end show" tabIndex="-1">
        <div className="modal-data-container">
          <ModalHeader title={title} onClose={onClose} />
          <ModalBody>{children}</ModalBody>
        </div>
      </div>
    </div>
  );
}

export default Modal;
