import React from "react";
import { EntityPage } from "./EntityPage";
import { userConfig } from "../config/entities/userConfig";
import UserForm from "./pagesForms/UserForm";
import handleApiCall from "../utils/handleApiCall";
import "./styles/Page.css";

export default function UserPage() {
    const {
        entityName,
        titlePage,
        modalName,
        entityMessage,
        columns,
        fields,
        entityKey,
        api,
        transformData,
        transformConfig,
        actions,
    } = userConfig;

    // Lógica para manejar el submit
    const onSubmit = async (mode, data) => {
        try {
            const backendData = transformData.toBackend(data);
            console.log("backendData", backendData);
            if (mode === "add") {
                await handleApiCall(
                    () => api.create(backendData),
                    "Usuario agregado exitosamente."
                );
            } else if (mode === "edit") {
                await handleApiCall(
                    () => api.update(backendData.DSC_CEDULA, backendData),
                    "Usuario actualizado exitosamente."
                );
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
                titlePage={titlePage}
                modalName={modalName}
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
        </>
    );
}