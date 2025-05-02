import React from 'react';
import GenericForm from '../../components/common/GenericForm';
import { scheduledReportConfig } from "../../config/entities/scheduledReportConfig";

function ScheduledReportForm({ mode, initialData, onSubmit, onCancel }) {
    return (
        <GenericForm
            entityName={"Reporte Programado"}
            mode={mode}
            initialData={initialData}
            fields={scheduledReportConfig.fields}
            onSubmit={onSubmit}
            onCancel={onCancel}
            customStyles={{ maxWidth: "600px" }}
        />
    );
}

export default ScheduledReportForm;