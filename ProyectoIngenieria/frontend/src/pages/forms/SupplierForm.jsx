import React from 'react';
import GenericForm from '../../components/common/GenericForm';
import { supplierFormFields } from './fields/SupplierFormFields';

function SupplierForm({ mode, initialData, onSubmit, onCancel }) {
    return (
        <GenericForm
            mode={mode}
            initialData={initialData}
            fields={supplierFormFields}
            onSubmit={onSubmit}
            onCancel={onCancel}
        />
    );
}

export default SupplierForm;