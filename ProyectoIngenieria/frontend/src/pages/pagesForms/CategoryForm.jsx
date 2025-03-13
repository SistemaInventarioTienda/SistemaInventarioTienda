import React from 'react';
import GenericForm from '../../components/common/GenericForm';
import { subcategoryConfig } from "../../config/entities/subcategoryConfig";

function CategoryForm({ mode, initialData, onSubmit, onCancel }) {

    return (
        <GenericForm
            entityName={"Categoría"}
            mode={mode}
            initialData={initialData}
            fields={subcategoryConfig.fields}
            onSubmit={onSubmit}
            onCancel={onCancel}
        />
    );
}

export default CategoryForm;