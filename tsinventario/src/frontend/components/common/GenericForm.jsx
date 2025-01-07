import React, { useState, useEffect } from 'react';
import { Input, FileInput, Select } from './';

function GenericForm({ mode, initialData = {}, fields, onSubmit, onCancel }) {
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

    const [formData, setFormData] = useState({
        ...initialData,
    });

    useEffect(() => {
        setFormData((prevData) => ({
            ...prevData,
            ...initialData,
        }));
    }, [initialData]);

    const handleChange = (e) => {
        const { name: fieldName, value } = e.target;
        setFormData({ ...formData, [fieldName]: value });
    };

    const handleFileChange = (e) => {
        const { name: fieldName } = e.target;
        setFormData({ ...formData, [fieldName]: e.target.files[0] });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    const renderField = (field) => {
        const fieldValue = formData[field.name] ?? "";

        if (field.type === "select") {
            return (
                <Select
                    name={field.name}
                    value={fieldValue}
                    onChange={handleChange}
                    required={field.required}
                    {...commonStyles}
                >
                    <option value="">Seleccione {field.label.toLowerCase()}</option>
                    {Array.isArray(field.options) ? (
                        field.options.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))
                    ) : (
                        <option disabled>No hay opciones disponibles</option>
                    )}
                </Select>
            );
        }

        if (field.type === "file") {
            return (
                <FileInput
                    name={field.name}
                    label={field.label}
                    onChange={handleFileChange}
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
                placeholder={`Ingrese ${field.label.toLowerCase()}`}
                {...commonStyles}
            />
        );
    };

    return (
        <form onSubmit={handleSubmit} className="form-grid">
            {Array.isArray(fields) &&
                fields.map((field) => (
                    <div key={field.name}>
                        <label htmlFor={field.name}>{field.label}</label>
                        {renderField(field)}
                    </div>
                ))}

            <div className="form-footer">
                {onCancel && (
                    <button type="button" onClick={onCancel} className="btn-cancel">
                        Cancelar
                    </button>
                )}
                <button type="submit" className="btn-submit">
                    {mode === "add" ? "Agregar" : "Guardar Cambios"}
                </button>
            </div>
        </form>
    );
}

export default GenericForm;