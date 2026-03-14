import React, { useState, useEffect } from "react";
import {
  Input,
  Textarea,
  InputFile,
  Select,
  NumberInput,
  DatePicker,
} from "./";
import ContactManager from "../features/ContactManager";
import { Plus } from "lucide-react";
import { useGenericFormLogic } from "../../hooks/useGenericFormLogic";
import { toast } from "sonner";
import { transferMethods } from "../../constants/paymentOptions";

import ModalConfirmation from "../modals/ModalConfirmation";

function GenericForm({
  mode,
  fields,
  initialData = {},
  entityName,
  supplierTypes = [],
  subcategoriesTypes = [],
  categories = [],
  onSubmit,
  onCancel,
  onFieldChange,
}) {
  const [errorMessages, setErrorMessages] = useState([]);
  const {
    formData,
    phones,
    emails,
    localSupplierTypes,
    localSubcategoriesTypes,
    isCedulaValid,
    workerError,
    handleChange,
    handleSubmit,
    setFormData,
    setPhones,
    setEmails,
    isProcessing,
  } = useGenericFormLogic({
    mode,
    entityName,
    initialData,
    supplierTypes,
    subcategoriesTypes,
    onSubmit,
    setErrorMessages,
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formValues, setFormValues] = useState(initialData);

  useEffect(() => {
    if (errorMessages.length > 0) {
      errorMessages.forEach((msg) => toast.error(msg));
      setErrorMessages([]);
    }
  }, [errorMessages]);

  const handleConfirmSubmit = async (event) => {
    if (event) event.preventDefault();
    await handleSubmit(event);
    setIsModalOpen(false);
  };

  // Manejador para seleccionar archivos
  const handleFileSelect = (file) => {
    setFormData((prevData) => ({
      ...prevData,
      foto: file,
      URL_IMAGEN: file ? null : prevData.URL_IMAGEN,
    }));
  };

  const handleDatePickerChange = (fieldName, date) => {
    setFormValues({ ...formValues, [fieldName]: date });
  };

  // Renderizador de campos dinámicos
  const renderField = (field) => {
    const fieldValue = formData[field.name] ?? "";

    if (field.type === "textarea") {
      return (
        <Textarea
          name={field.name}
          value={fieldValue}
          onChange={handleChange}
          required={field.required}
          readOnly={mode === "view"}
          placeholder={`Ingrese ${field.label.toLowerCase()}`}
          className="full-width"
        />
      );
    }

    if (field.type === "date") {
      return (
        <DatePicker
          placeholder={field.placeholder || "Selecciona una fecha"}
          value={formValues[field.name]}
          onChange={(date) => handleDatePickerChange(field.name, date)}
          allowPastDates={field.allowPastDates || false}
          dateFormat={field.dateFormat || "d/m/Y"}
          enableTime={field.enableTime || false}
        />
      );
    }

    if (field.type === "select") {
      let options = [];

      if (field.name === "tipoProveedor") {
        options = [
          { value: "", label: "Seleccione el tipo de proveedor" },
          ...localSupplierTypes.map((type) => ({
            value: type.ID_TIPOPROVEEDOR,
            label: type.DSC_NOMBRE,
          })),
        ];
      } else if (field.name === "CATEGORIA") {
        options = [
          { value: "", label: "Seleccione la categoría" },
          ...categories.map((cat) => ({
            value: cat.ID_CATEGORIA,
            label: cat.DSC_NOMBRE,
          })),
        ];
      } else if (field.name === "SUBCATEGORIA") {
        options = [
          { value: "", label: "Seleccione la subcategoría" },
          ...subcategoriesTypes.map((type) => ({
            value: type.ID_SUBCATEGORIA,
            label: type.DSC_NOMBRE,
          })),
        ];
      } else if (field.name === "METODO_PAGO") {
        options = transferMethods;
      } else if (field.name === "TIPO_TRANSACCION") {
        options = transferMethods;
      } else {
        options = [
          { value: "0", label: "Seleccione el estado" },
          { value: 1, label: "Activo" },
          { value: 2, label: "Inactivo" },
        ];
      }

      return (
        <Select
          name={field.name}
          value={formData[field.name] || ""}
          onChange={(e) => {
            handleChange(e);
            if (onFieldChange) {
              const { name, value } = e.target;
              onFieldChange(name, value);
            }
          }}
          options={options}
          required={field.required}
          disabled={
            mode === "view" ||
            (field.name === "SUBCATEGORIA" && !formData.CATEGORIA) // Nueva condición
          }
        />
      );
    }

    // Agregar soporte para NumberInput

    if (
      entityName === "Usuario" &&
      mode === "edit" &&
      field.name === "cedula"
    ) {
      const isCedulaBlocked = field.name === "cedula"; // Bloquea solo el campo de cédula

      return (
        <Input
          name={field.name}
          value={fieldValue}
          onChange={handleChange}
          required={field.required}
          readOnly={true} // Bloquea si es cédula o si el modo es "view"
          placeholder={`Ingrese ${field.label.toLowerCase()}`}
          className={isCedulaBlocked ? "readonly-input" : ""}
        />
      );
    }

    const isBlocked =
      isCedulaValid &&
      ["nombre", "primerApellido", "segundoApellido"].includes(field.name);

    return (
      <Input
        type={field.type || "text"}
        name={field.name}
        value={fieldValue}
        onChange={handleChange}
        required={field.required}
        readOnly={isBlocked || mode === "view"}
        placeholder={`Ingrese ${field.label.toLowerCase()}`}
        className={isBlocked ? "readonly-input" : ""}
        min={field.min}
        step={field.step}
      />
    );
  };

  // Filtrar y separar el campo de archivo
  const nonFileFields = fields.filter((field) => field.type !== "file");
  const fileField = fields.find((field) => field.type === "file");

  return (
    <form onSubmit={handleSubmit} className="form-grid">
      {/* Renderizar campos normales */}
      {nonFileFields
        .filter((field) => {
          if (
            (field.name === "contrasena" ||
              field.name === "confirmarContrasena") &&
            mode !== "add"
          ) {
            return false;
          }
          if (field.name === "CANTIDAD" && mode === "add") {
            return false; // Oculta cantidad solo en modo add
          }
          return true;
        })
        .map((field) => (
          <div className="form-group" key={field.name}>
            <label htmlFor={field.name}>{field.label}</label>
            {renderField(field)}
          </div>
        ))}

      {/* Renderizar ContactManager para teléfonos */}
      {/* || entityName === "Proveedor" */}
      {(entityName === "Cliente" || entityName === "Proveedor") && (
        <div className="full-width">
          <ContactManager
            contacts={phones}
            onContactsChange={setPhones}
            type="phone"
            mode={mode}
          />
        </div>
      )}

      {/* Renderizar ContactManager para correos electrónicos */}
      {entityName === "Proveedor" && (
        <div className="full-width">
          <ContactManager
            contacts={emails}
            onContactsChange={setEmails}
            type="email"
            mode={mode}
          />
        </div>
      )}

      {/* Renderizar el campo de archivo al final */}
      {fileField && (
        <div className="full-width">
          <InputFile
            mode={mode}
            name={fileField.name}
            label={`${entityName === "Producto" ? "Imagen del Producto" : "Imagen"}`}
            onFileSelect={handleFileSelect}
            value={formData.foto}
            required={fileField.required}
            resourcePath={fileField.resourcePath}
          />
        </div>
      )}

      {/* Botones de acción */}
      <div className="modal-footer full-width">
        {mode !== "edit" && (
          <button type="button" onClick={onCancel} className="close-btn">
            Cancelar
          </button>
        )}
        {mode !== "view" && (
          // En el botón de submit:
          <button
            type="button"
            className="add-btn"
            disabled={isProcessing}
            onClick={() => setIsModalOpen(true)}
          >
            <Plus size={20} />
            {isProcessing
              ? "Procesando..."
              : mode === "add"
                ? "Agregar"
                : "Guardar Cambios"}
          </button>
        )}
      </div>

      <ModalConfirmation
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={(e) => handleConfirmSubmit(e)}
        entityName={entityName}
        action={mode === "add" ? "add" : "edit"}
        confirmButtonText={mode === "add" ? "Agregar" : "Guardar Cambios"}
        cancelButtonText="Cancelar"
      />
    </form>
  );
}

export default GenericForm;
