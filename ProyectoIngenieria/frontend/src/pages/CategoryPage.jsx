import React from "react";
import { EntityPage } from "./EntityPage";
import { categoryConfig } from "../config/entities/categoryConfig";
import CategoryForm from "./pagesForms/CategoryForm";
import { Alert } from "../components/common";
import useAlert from "../hooks/useAlert";
import handleApiCall from "../utils/handleApiCall";

export default function CategoryPage() {
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
    } = categoryConfig;

    const { alert, showAlert, hideAlert } = useAlert();

    // Lógica para manejar el submit
    const onSubmit = async (mode, data) => {
        const backendData = transformData.toBackend(data);
        console.log("backendData", backendData);
        if (mode === "add") {
            await handleApiCall(() => api.create(backendData), "Categoría agregada exitosamente.", showAlert);
        } else if (mode === "edit") {
            await handleApiCall(() => api.update(backendData), "Categoría actualizada exitosamente.", showAlert);
        }
    };

    // Lógica para manejar el delete
    const onDelete = async (category) => {
        await handleApiCall(() => api.delete(category.DSC_NOMBRE), "Categoría eliminada exitosamente.", showAlert);
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
                onDelete={onDelete}
                modalComponent={CategoryForm}
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
