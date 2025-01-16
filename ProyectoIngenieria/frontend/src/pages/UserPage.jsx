import React from "react";
import { EntityPage } from "./EntityPage";
import { userConfig } from "../config/entities/userConfig";
import UserForm from "./pagesForms/UserForm";
import { Alert } from "../components/common";
import useAlert from "../hooks/useAlert";
import handleApiCall from "../utils/handleApiCall";
import "./styles/Page.css";

export default function UserPage() {
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
    } = userConfig;

    const { alert, showAlert, hideAlert } = useAlert();

    // Lógica para manejar el submit
    const onSubmit = async (mode, data) => {
        const backendData = transformData.toBackend(data);
        console.log("backendData", backendData);
        if (mode === "add") {
            await handleApiCall(() => api.create(backendData), "Cliente agregado exitosamente.", showAlert);
        } else if (mode === "edit") {
            await handleApiCall(() => api.update(backendData.DSC_CEDULA, backendData), "Cliente actualizado exitosamente.", showAlert);
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
                onDelete={(user) => api.delete(user.DSC_CEDULA)}
                modalComponent={UserForm}
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