import React from 'react';
import GenericForm from '../../components/common/GenericForm';
import { userConfig } from "../../config/entities/userConfig";

function UserForm({ mode, initialData, onSubmit, onCancel }) {
    return (
        <GenericForm
            entityName={"Usuario"}
            mode={mode}
            initialData={initialData}
            fields={userConfig.fields}
            onSubmit={onSubmit}
            onCancel={onCancel}
        />
    );
}

export default UserForm;