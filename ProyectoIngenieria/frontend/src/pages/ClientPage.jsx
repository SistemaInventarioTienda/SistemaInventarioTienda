import React from "react";
import { EntityPage } from "./EntityPage";
import { clientConfig } from "../config/entities/clientConfig";
import ClientForm from "./pagesForms/ClientForm";
import { Alert } from "../components/common";
import useAlert from "../hooks/useAlert";
import handleApiCall from "../utils/handleApiCall";

export default function ClientPage() {
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
    } = clientConfig;

    const { alert, showAlert, hideAlert } = useAlert();

    // Lógica para manejar el submit
    const onSubmit = async (mode, data) => {
        try {
            const backendData = transformData.toBackend(data);
            console.log("backendData", backendData);
            if (mode === "add") {
                await handleApiCall(() => api.create(backendData), "Cliente agregado exitosamente.", showAlert);
            } else if (mode === "edit") {
                await handleApiCall(() => api.update(backendData.DSC_CEDULA, backendData), "Cliente actualizado exitosamente.", showAlert);
            }
            return { success: true };
        } catch (error) {
            return { success: false };
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
                onDelete={(client) => api.delete(client.DSC_CEDULA)}
                modalComponent={ClientForm}
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