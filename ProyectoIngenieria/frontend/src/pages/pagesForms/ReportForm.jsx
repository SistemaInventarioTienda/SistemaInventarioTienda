import React from 'react';
import GenericForm from '../../components/common/GenericForm';
import { reportConfig } from "../../config/entities/reportConfig";

function ReportForm({ mode, initialData, onSubmit, onCancel }) {
    return (
        <GenericForm
            entityName={"Reporte"}
            mode={mode}
            initialData={initialData}
            fields={reportConfig.fields}
            onSubmit={onSubmit}
            onCancel={onCancel}
        />
    );
}

export default ReportForm;