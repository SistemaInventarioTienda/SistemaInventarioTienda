import React from 'react';
import GenericForm from '../../components/common/GenericForm';
import { clientFormFields } from './fields/ClientFormFields';

function ClientForm({ mode, initialData, onSubmit, onCancel }) {
    return (
        <GenericForm
            mode={mode}
            initialData={initialData}
            fields={clientFormFields}
            onSubmit={onSubmit}
            onCancel={onCancel}
        />
    );
}

export default ClientForm;