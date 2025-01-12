import React from 'react';
import GenericForm from '../../components/common/GenericForm';
import { categoryFormFields } from './fields/CategoryFormFields';

function CategoryForm({ mode, initialData, onSubmit, onCancel }) {
    return (
        <GenericForm
            mode={mode}
            initialData={initialData}
            fields={categoryFormFields}
            onSubmit={onSubmit}
            onCancel={onCancel}
        />
    );
}

export default CategoryForm;