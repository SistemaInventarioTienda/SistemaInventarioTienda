import React from 'react';
import GenericForm from '../../components/common/GenericForm';
import { TransactionConfig } from "../../config/entities/TransactionConfig";

function TransactionForm({ mode, initialData, onSubmit, onCancel }) {
    return (
        <GenericForm
            entityName={"Transaccion"}
            mode={mode}
            initialData={initialData}
            fields={TransactionConfig.fields}
            onSubmit={onSubmit}
            onCancel={onCancel}
        />
    );
}

export default TransactionForm;