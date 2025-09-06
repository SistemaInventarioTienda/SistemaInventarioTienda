//SettingsForm.jsx
import React from 'react';
import GenericForm from '../../components/common/GenericForm';
//import { settingConfig } from '../../config/entities/settingConfig';



// FileInput
const SettingsForm = ({ initialData, fields, onSubmit, onCancel }) => {
    
    return(
        <GenericForm
            entityName={"Ajuste"}
            mode="edit"
            initialData={initialData}
            fields={fields}
            onSubmit={onSubmit}
            onCancel={onCancel}
        />
       
    )
};

export default SettingsForm 
