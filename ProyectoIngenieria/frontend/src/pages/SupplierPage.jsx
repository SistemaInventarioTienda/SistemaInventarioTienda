import React from "react";
import { EntityPage } from "./EntityPage";
import { supplierConfig } from "../config/entities/supplierConfig";
import SupplierForm from "./pagesForms/SupplierForm";
import { Alert } from "../components/common";
import useAlert from "../hooks/useAlert";
import handleApiCall from "../utils/handleApiCall";

export default function SupplierPage() {
    const {
        entityName,
        entityMessage,
        columns,
        fields,
        entityKey,
        api,
        transformData,
        transformConfig,
        actions,
    } = supplierConfig;

    const { alert, showAlert, hideAlert } = useAlert();
    
    // Lógica para manejar el submit
    const onSubmit = async (mode, data) => {
        const backendData = transformData.toBackend(data);
        console.log("backendData", backendData);
        if (mode === "add") {
            await handleApiCall(() => api.create(backendData), "Proveedor agregado exitosamente.", showAlert);
        } else if (mode === "edit") {
            await handleApiCall(() => api.update(backendData), "Proveedor actualizado exitosamente.", showAlert);
        }
    };

    return (
        <>
            <EntityPage
                entityName={entityName}
                entityMessage={entityMessage}
                columns={columns}
                fields={fields}
                fetchAll={api.fetchAll}
                searchByName={api.searchByName}
                onSubmit={onSubmit}
                onDelete={(supplier) => api.delete(supplier.IDENTIFICADOR_PROVEEDOR)}
                modalComponent={SupplierForm}
                entityKey={entityKey}
                transformData={transformData.toFrontend}
                transformConfig={transformConfig}
                actions={actions}
            />
            {alert.show && (
                <div className="alert-container">
                    <Alert
                        type={alert.type}
                        message={alert.message}
                        duration={3000}
                        onClose={hideAlert}
                    />
                </div>
            )}
        </>
    );
}