import React, { useEffect, useState } from "react";
import { Input, Button, Select, Alert } from "./ui";
import { ChevronRight, Plus } from "lucide-react";
import ModalConfirmation from "../components/ui/ModalConfirmation";
import ContactManager from "./ContactManager";
import InputFile from "../components/ui/InputFile";
import "./css/modal.css";
import { getPersonById } from "../api/hacienda";


export default function Modal({ isOpen, onClose, mode, fields, data = {}, onSubmit, errorMessages, setErrorMessages, entityName, supplierTypes, }) {
  const [formData, setFormData] = useState({});
  const [isConfirmationModalOpen, setConfirmationModalOpen] = useState(false);
  const [phones, setPhones] = useState(data?.telefonos || []);
  const [emails, setEmails] = useState(data?.correos || []);
  const [localSupplierTypes, setLocalSupplierTypes] = useState([]);

  useEffect(() => {
    if (isOpen) {
      setLocalSupplierTypes(supplierTypes);
      setFormData({ ...data });
      setPhones(data?.telefonos || []);
      setEmails(data?.correos || []);
      console.log("telefonos cargados:", data?.telefonos);
      console.log("correos cargados:", data?.correos);
    }
  }, [isOpen, data, supplierTypes]);

  if (!isOpen) return null;

  const isViewMode = mode === "view";
  const isEditMode = mode === "edit";
  const isAddMode = mode === "add";

  const estadoOptions = [
    { value: "", label: "Seleccione el estado" },
    { value: 1, label: "Activo" },
    { value: 2, label: "Inactivo" },
  ];

  const handleChange = async (e) => {
    const { name, value, type, files } = e.target;

    if (entityName === 'Usuario' || entityName === 'Cliente') {
      if (name === 'cedula' && value.length === 9) {
        const { nombre, segundoNombre, apellidoUno, apellidoDos } = await getPersonById(value);

        const newName = (segundoNombre.length >= 0) ? (nombre + " " + segundoNombre) : nombre;

        setFormData((prevData) => ({
          ...prevData,
          nombre: newName,
          primerApellido: apellidoUno,
          segundoApellido: apellidoDos,
        }));


      }
    }

    // Verifica si el campo es de tipo 'file'
    if (type === "file" && files.length > 0) {
      const fileName = files[0].name;
      setFormData((prevData) => ({ ...prevData, [name]: fileName }));
    } else {
      const parsedValue = name === "estado" ? parseInt(value, 10) : value;
      setFormData((prevData) => ({ ...prevData, [name]: parsedValue }));
    }
  };

  const handleFileSelect = (file) => {
    setFormData((prevData) => ({ ...prevData, foto: file }));
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
      ...(entityName === "Proveedor" && { telefonos: phones }),
      ...(entityName === "Proveedor" && { correos: emails }),
      estado: parseInt(formData.estado, 10),
    };
    onSubmit(submissionData);
  };

  const renderInput = (field) => {
    const fieldValue = formData[field.name] ?? "";

    if (isViewMode) {
      if (field.name === "tipoProveedor" && field.type === "select") {
        return (
          <Select
            name="tipoProveedor"
            value={fieldValue}
            onChange={handleChange}
            required={field.required}
            {...commonStyles}
            disabled
          >
            <option value="">Seleccione el tipo</option>
            {localSupplierTypes.length > 0 ? (
              localSupplierTypes.map((type) => (
                <option key={type.ID_TIPOPROVEEDOR} value={type.ID_TIPOPROVEEDOR}>
                  {type.DSC_NOMBRE}
                </option>
              ))
            ) : (
              <option disabled>Cargando tipos de proveedores...</option>
            )}
          </Select>
        );
      }

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

    if (field.name === "tipoProveedor" && field.type === "select") {
      return (
        <Select
          name="tipoProveedor"
          value={fieldValue}
          onChange={handleChange}
          required={field.required}
          {...commonStyles}
        >
          <option value="">Seleccione el tipo</option>
          {localSupplierTypes.length > 0 ? (
            localSupplierTypes.map((type) => (
              <option key={type.ID_TIPOPROVEEDOR} value={type.ID_TIPOPROVEEDOR}>
                {type.DSC_NOMBRE}
              </option>
            ))
          ) : (
            <option disabled>Cargando tipos de proveedores...</option>
          )}
        </Select>
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
        disabled={(mode === 'edit' && field.name === 'cedula') || field.name === 'nombre' || field.name === 'primerApellido' || field.name === 'segundoApellido'}
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

  const showPhones = entityName === 'Cliente' || entityName === 'Proveedor';
  const showEmails = entityName === 'Proveedor';

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
                // Caso especial para modo 'add' y tipo de archivo para "Cliente"
                if (field.type === "file" && entityName === "Cliente") {
                  return (
                    <div className="full-width-component" key={field.name}>
                      <InputFile
                        name={field.name}
                        label={field.label}
                        required={field.required}
                        onClick={(e) => e.stopPropagation()}
                        mode={mode}
                        entity={entityName}
                        value={formData.foto}
                        onFileSelect={handleFileSelect}
                      />
                    </div>
                  );
                }

                // Ocultar los campos de contraseña en modo de edición o vista
                if ((isEditMode || isViewMode) && (field.name === "contrasena" || field.name === "confirmarContrasena")) {
                  return null;
                }

                // Renderizar el resto de los campos
                return (
                  <div className="form-group" key={field.name}>
                    <label htmlFor={field.name}>{field.label}</label>
                    {renderInput(field)}
                  </div>
                );
              })}
              {/* Mostrar ContactManager solo si se cumple la condición */}
              {showPhones && (
                <div className="full-width-component">
                  <ContactManager
                    contacts={phones}
                    onContactsChange={setPhones}
                    type="phone"
                    mode={mode}
                  />
                </div>
              )}
              {showEmails && (
                <div className="form-group full-width-component">
                  <label>Correos electrónicos</label>
                  <ContactManager
                    contacts={emails}
                    onContactsChange={setEmails}
                    type="email"
                    mode={mode}
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
      {/* Modal de confirmación */}
      <ModalConfirmation
        isOpen={isConfirmationModalOpen}
        onClose={() => setConfirmationModalOpen(false)}
        onConfirm={handleConfirmSubmit}  // Confirmar los cambios
        entityName={entityName}
        action={mode}
        confirmButtonText="Confirmar"
        cancelButtonText="Cancelar"
      />
    </div>
  );
}
