import React, { useState } from 'react';
import { Input, Button } from "../common";
import { Plus, Trash2 } from "lucide-react";

export default function ContactManager({
    initialValues = [],
    onChange,
    type = 'phone',
    label = 'Contact Info'
}) {
    const [values, setValues] = useState(initialValues);

    const addValue = () => {
        const newValues = [...values, ''];
        setValues(newValues);
        onChange(newValues);
    };

    const updateValue = (index, value) => {
        const updatedValues = values.map((v, i) => (i === index ? value : v));
        setValues(updatedValues);
        onChange(updatedValues);
    };

    const removeValue = (index) => {
        const updatedValues = values.filter((_, i) => i !== index);
        setValues(updatedValues);
        onChange(updatedValues);
    };

    return (
        <div className="table-container">
            <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
            <table className="custom-table">
                <thead>
                    <tr>
                        <th>{type === 'phone' ? 'Número de Teléfono' : 'Correo Electrónico'}</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {values.map((value, index) => (
                        <tr key={index}>
                            <td>
                                <Input
                                    type={type === 'phone' ? 'tel' : 'email'}
                                    value={value}
                                    onChange={(e) => updateValue(index, e.target.value)}
                                    placeholder={`Ingrese ${type === 'phone' ? 'número de teléfono' : 'correo electrónico'}`}
                                    className="w-full"
                                />
                            </td>
                            <td>
                                <Button
                                    type="button"
                                    onClick={() => removeValue(index)}
                                    className="p-2 bg-red-500 hover:bg-red-600 text-white rounded"
                                >
                                    <Trash2 size={20} />
                                </Button>
                            </td>
                        </tr>
                    ))}
                    <tr>
                        <td colSpan="2" className="text-center">
                            <Button
                                type="button"
                                onClick={addValue}
                                className="mt-2 flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-white rounded px-4 py-2"
                            >
                                <Plus size={20} />
                                <span className="ml-2">Agregar {type === 'phone' ? 'teléfono' : 'correo'}</span>
                            </Button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
}
