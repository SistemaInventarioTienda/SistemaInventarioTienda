import React from 'react';
import GenericForm from '../../components/common/GenericForm';
import { categoryConfig } from "../../config/entities/categoryConfig";

function SupplierForm({ mode, initialData, onSubmit, onCancel }) {
    const {
        fields
    } = categoryConfig;
    return (
        <GenericForm
            mode={mode}
            initialData={initialData}
            fields={fields}
            onSubmit={onSubmit}
            onCancel={onCancel}
        />
    );
}

export default SupplierForm;