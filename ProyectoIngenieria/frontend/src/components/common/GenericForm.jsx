import React, { useState, useEffect, useRef } from 'react';
import { Input, FileInput, Select, Button, Alert } from './';
import ContactManager from "../features/ContactManager";
import { Plus } from "lucide-react";
function GenericForm({
    mode,
    fields,
    initialData = {},
    entityName,
    supplierTypes = [],
    onSubmit,
    errorMessages = [],
    setErrorMessages,
    onCancel,
}) {
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

    const [formData, setFormData] = useState(initialData);
    const [phones, setPhones] = useState(initialData?.telefonos || []);
    const [emails, setEmails] = useState(initialData?.correos || []);
    const [localSupplierTypes, setLocalSupplierTypes] = useState(supplierTypes);
    const [searchPersonWorker, setSearchPersonWorker] = useState(null);

    const initialLoaded = useRef(false);

    useEffect(() => {
        if (!initialLoaded.current) {
            setFormData(initialData);
            setPhones(initialData?.telefonos || []);
            setEmails(initialData?.correos || []);
            setLocalSupplierTypes(supplierTypes);
            initialLoaded.current = true;
        }
    }, [initialData, supplierTypes]);

    useEffect(() => {
        const worker = new Worker("workers/searchPerson.worker.js");
        worker.onmessage = ({ data }) => {
            const { nombre, segundoNombre, apellidoUno, apellidoDos } = data;
            const newName = segundoNombre ? `${nombre} ${segundoNombre}` : nombre;
            setFormData((prev) => ({
                ...prev,
                nombre: newName,
                primerApellido: apellidoUno,
                segundoApellido: apellidoDos,
            }));
        };
        setSearchPersonWorker(worker);
        return () => worker.terminate();
    }, []);

    const handleChange = (e) => {
        const { name, value, type, files } = e.target;

        if (name === "cedula" && value.length === 9) {
            searchPersonWorker.postMessage(value);
        }

        setFormData((prev) => ({
            ...prev,
            [name]: type === "file" && files.length > 0 ? files[0] : value,
        }));
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
        const dataToSubmit = {
            ...formData,
            estado: estadoValue,
        };

        // Mostrar en consola lo que se va a enviar
        console.log("Datos enviados:", dataToSubmit);

        // Llamar a la función de envío con los datos
        onSubmit(dataToSubmit);
    };

    const renderField = (field) => {
        const fieldValue = formData[field.name] ?? "";

        if (field.type === "select") {
            const options =
                field.name === "tipoProveedor"
                    ? localSupplierTypes.map((type) => ({
                        value: type.ID_TIPOPROVEEDOR,
                        label: type.DSC_NOMBRE,
                    }))
                    : [
                        { value: "", label: "Seleccione el estado" },
                        { value: 1, label: "Activo" },
                        { value: 2, label: "Inactivo" },
                    ];
            return (
                <Select
                    name={field.name}
                    value={fieldValue}
                    onChange={handleChange}
                    required={field.required}
                    disabled={mode === "view"}
                    {...commonStyles}
                >
                    {options.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </Select>
            );
        }

        if (field.type === "file") {
            return (
                <FileInput
                    mode={mode}
                    name={field.name}
                    label={field.label}
                    onFileSelect={handleFileSelect}
                    required={field.required}
                    {...commonStyles}
                />
            );
        }

        return (
            <Input
                name={field.name}
                value={fieldValue}
                onChange={handleChange}
                required={field.required}
                readOnly={mode === "view"}
                placeholder={`Ingrese ${field.label.toLowerCase()}`}
                {...commonStyles}
            />
        );
    };

    return (
        <form onSubmit={handleSubmit} className="form-grid">
            {fields.map((field) => (
                <div className="form-group" key={field.name}>
                    <label htmlFor={field.name}>{field.label}</label>
                    {renderField(field)}
                </div>
            ))}

            {(entityName === "Cliente" || entityName === "Proveedor") && (
                <ContactManager
                    contacts={phones}
                    onContactsChange={setPhones}
                    type="phone"
                    mode={mode}
                />
            )}

            {entityName === "Proveedor" && (
                <ContactManager
                    contacts={emails}
                    onContactsChange={setEmails}
                    type="email"
                    mode={mode}
                />
            )}

            <div className="modal-footer">
                <button type="button" onClick={onCancel} className="close-btn">
                    Cancelar
                </button>
                {mode !== "view" && (
                    <button type="submit" className="add-btn">
                        <Plus size={20} />
                        {mode === "add" ? "Agregar" : "Guardar Cambios"}
                    </button>
                )}
            </div>

            {errorMessages.length > 0 && <Alert type="warning" message={errorMessages} />}
        </form>
    );
}

export default GenericForm;
