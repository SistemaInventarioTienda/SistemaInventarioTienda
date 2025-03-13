import React from "react";
import { EntityPage } from "./EntityPage";
import { supplierConfig } from "../config/entities/supplierConfig";
import SupplierForm from "./pagesForms/SupplierForm";
import { toast } from "sonner";
import useAlert from "../hooks/useAlert";
import handleApiCall from "../utils/handleApiCall";

export default function SupplierPage() {
    const {
        entityName,
        titlePage,
        entityMessage,
        columns,
        fields,
        entityKey,
        api,
        transformData,
        transformConfig,
        actions,
    } = supplierConfig;

    // Lógica para manejar el submit
    const onSubmit = async (mode, data) => {
        try {
            const backendData = transformData.toBackend(data);
            console.log("backendData", backendData);

            if (mode === "add") {
                await handleApiCall(
                    () => api.create(backendData),
                    "Proveedor agregado exitosamente."
                );
            } else if (mode === "edit") {
                await handleApiCall(
                    () => api.update(backendData),
                    "Proveedor actualizado exitosamente."
                );
            }

            return { success: true };
        } catch (error) {
            console.error("Error:", error);
            return { success: false };
        }
    };

    return (
        <>
            <EntityPage
                entityName={entityName}
                titlePage={titlePage}
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
        </>
    );
}