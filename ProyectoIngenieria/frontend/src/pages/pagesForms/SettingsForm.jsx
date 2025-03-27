//SettingsForm.jsx
import React from 'react';
import GenericForm from '../../components/common/GenericForm';
import { settingConfig } from '../../config/entities/settingConfig';



// FileInput
const SettingsForm = ({ initialData, onSubmit, onCancel }) => {
    

    
    return(
        <GenericForm
            entityName={"Ajuste"}
            mode="edit"
            initialData={initialData}
            fields={settingConfig.fields}
            onSubmit={onSubmit}
            onCancel={onCancel}
        />
       
    )
};

export default SettingsForm 
