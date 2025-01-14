import React from 'react';
import GenericForm from '../../components/common/GenericForm';
import { clientConfig } from "../../config/entities/clientConfig";

function ClientForm({ mode, initialData, onSubmit, onCancel }) {
    const {
        fields
    } = clientConfig;

    return (
        <GenericForm
            entityName={"Cliente"}
            mode={mode}
            initialData={initialData}
            fields={fields}
            onSubmit={onSubmit}
            onCancel={onCancel}
        />
    );
}

export default ClientForm;