import React from 'react';
import GenericForm from '../../components/common/GenericForm';
import { CategoryFormFields } from './fields/CategoryFormFields';

function CategoryForm({ mode, initialData, onSubmit, onCancel }) {
    return (
        <GenericForm
            mode={mode}
            initialData={initialData}
            fields={CategoryFormFields}
            onSubmit={onSubmit}
            onCancel={onCancel}
        />
    );
}

export default CategoryForm;