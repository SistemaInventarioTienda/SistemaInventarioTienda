import React from 'react';
import GenericForm from '../../components/common/GenericForm';
import { categoryConfig } from "../../config/entities/categoryConfig";

function CategoryForm({ mode, initialData, onSubmit, onCancel }) {

    return (
        <GenericForm
            entityName={"Categoría"}
            mode={mode}
            initialData={initialData}
            fields={categoryConfig.fields}
            onSubmit={onSubmit}
            onCancel={onCancel}
        />
    );
}

export default CategoryForm;