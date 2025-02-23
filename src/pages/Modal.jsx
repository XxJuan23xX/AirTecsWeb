import React from "react";
import "./Modal.css";

const Modal = ({ isOpen, onClose, title, message }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2 className="modal-title">{title}</h2>
        <p className="modal-message">{message}</p>

        <button className="modal-button" onClick={onClose}>
          Aceptar
        </button>
      </div>
    </div>
  );
};

export default Modal;
