import React from "react";
import { EntityPage } from "./EntityPage";
import { categoryConfig } from "../config/entities/categoryConfig";
import CategoryForm from "./pagesForms/CategoryForm";
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

    // Lógica para manejar el submit
    const onSubmit = async (mode, data) => {
        try {
            const backendData = transformData.toBackend(data);
            console.log("backendData", backendData);
            if (mode === "add") {
                await handleApiCall(
                    () => api.create(backendData),
                    "Categoría agregada exitosamente.",
                );
            } else if (mode === "edit") {
                await handleApiCall(
                    () => api.update(backendData),
                    "Categoría actualizada exitosamente.",
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
                entityMessage={entityMessage}
                columns={columns}
                fields={fields}
                fetchAll={api.fetchAll}
                searchByName={api.searchByName}
                onSubmit={onSubmit}
                onDelete={(category) => api.delete(category.DSC_NOMBRE)}
                modalComponent={CategoryForm}
                entityKey={entityKey}
                transformData={transformData.toFrontend}
                transformConfig={transformConfig}
                actions={actions}
            />
        </>
    );
}
