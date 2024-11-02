import React, { useEffect, useState } from "react";
import { Input, Button, Select, Alert } from "./ui";
import { ChevronRight, Plus } from "lucide-react";
import ModalConfirmation from "../components/ui/ModalConfirmation";
import ContactList from "./ContactManager";

import "./css/modal.css";

export default function Modal({ isOpen, onClose, mode, fields, data = {}, onSubmit, errorMessages, setErrorMessages, entityName }) {
  const [formData, setFormData] = useState({});
  const [isConfirmationModalOpen, setConfirmationModalOpen] = useState(false);
  const [phones, setPhones] = useState(data?.telefonos || []);
  const [emails, setEmails] = useState(data?.correos || []);

  useEffect(() => {
    if (isOpen) {
      setFormData({ ...data });
      setPhones(data?.telefonos || []);
      setEmails(data?.correos || []);
    }
  }, [isOpen, data]);

  if (!isOpen) return null;

  const isViewMode = mode === "view";
  const isEditMode = mode === "edit";
  const isAddMode = mode === "add";

  const estadoOptions = [
    { value: "", label: "Seleccione el estado" },
    { value: 1, label: "Activo" },
    { value: 2, label: "Inactivo" },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    const parsedValue = name === "estado" ? parseInt(value, 10) : value;
    setFormData((prevData) => ({ ...prevData, [name]: parsedValue }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const estadoValue = parseInt(formData.estado, 10);

    if (isNaN(estadoValue) || (estadoValue !== 1 && estadoValue !== 2)) {
      setErrorMessages(["Por favor, seleccione un estado válido."]);
      return;
    }

    setConfirmationModalOpen(true);
  };

  const handleConfirmSubmit = () => {
    setConfirmationModalOpen(false);

    const submissionData = {
      ...formData,
      ...(entityName === "Cliente" && { telefonos: phones }),
      estado: parseInt(formData.estado, 10),
    };
    console.log('submissionData', submissionData);
    onSubmit(submissionData);
  };

  const renderInput = (field) => {
    const fieldValue = formData[field.name] ?? "";

    if (isViewMode) {
      return field.type === "select" ? (
        <Select
          name="estado"
          value={fieldValue}
          onChange={handleChange}
          required={field.required}
          {...commonStyles}
          disabled
        >
          {estadoOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
      ) : (
        <Input readOnly value={fieldValue} {...commonStyles} />
      );
    }

    return field.type === "select" ? (
      <Select
        name={field.name}
        value={fieldValue}
        onChange={handleChange}
        required={field.required}
        {...commonStyles}
      >
        {estadoOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </Select>
    ) : (
      <Input
        name={field.name}
        value={fieldValue}
        onChange={handleChange}
        required={field.required}
        placeholder={`Ingrese ${field.label.toLowerCase()}`}
        {...commonStyles}
      />
    );
  };

  const commonStyles = {
    className: "form-control border-custom",
    style: {
      backgroundColor: "#F5F7FA",
      borderColor: "#05004E",
      boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
      fontSize: "16px",
      fontWeight: "500",
      fontFamily: "Poppins, sans-serif",
      color: "#05004E",
    },
  };

  const showPhones = entityName === 'Cliente' || entityName === 'Productor';
  const showEmails = entityName === 'Productor';

  return (
    <div className="modal-overlay">
      <div className="offcanvas offcanvas-end show" tabIndex="-1">
        <div className="modal-data-container">
          <div className="offcanvas-header">
            <h2>{isAddMode ? `Agregar ${entityName}` : isEditMode ? `Editar ${entityName}` : `Detalles de ${entityName}`}</h2>
            <Button
              onClick={onClose}
              className="btn me-3 p-0"
              style={{
                backgroundColor: '#05004E',
                borderRadius: '16px',
                width: '50px',
                height: '42px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <ChevronRight size={20} color="#FFFFFF" />
            </Button>
          </div>
          <div className="offcanvas-body">
            {errorMessages.length > 0 && (
              <Alert
                type="warning"
                message={errorMessages}
                duration={5000}
              />
            )}
          </div>
          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              {fields.map((field) => {
                if ((isEditMode || isViewMode) && (field.name === "contrasena" || field.name === "confirmarContrasena")) return null;

                return (
                  <div className="form-group" key={field.name}>
                    <label htmlFor={field.name}>{field.label}</label>
                    {renderInput(field)}
                  </div>
                );
              })}

              {showPhones && (
                <div className="full-width-component">
                  <ContactList
                    contacts={phones}
                    onContactsChange={setPhones}
                    type="phone"
                  />
                </div>
              )}
              {showEmails && (
                <div className="form-group full-width-component">
                  <label>Correos electrónicos</label>
                  <ContactList
                    contacts={emails}
                    onContactsChange={setEmails}
                    type="email"
                  />
                </div>
              )}
            </div>
            <div className="modal-footer">
              <Button type="button" onClick={onClose} className="close-btn">Cancelar</Button>
              {!isViewMode && (
                <Button type="submit" className="add-btn">
                  <Plus size={20} />
                  {isAddMode ? "Agregar nuevo" : "Guardar Cambios"}
                </Button>
              )}
            </div>
          </form>
        </div>
      </div>
      <ModalConfirmation
        isOpen={isConfirmationModalOpen}
        onClose={() => setConfirmationModalOpen(false)}
        onConfirm={handleConfirmSubmit}
        entityName={entityName}
        action="guardar los cambios"
        confirmButtonText="Confirmar"
        cancelButtonText="Cancelar"
      />
    </div>
  );
}