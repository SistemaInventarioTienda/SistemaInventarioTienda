import React from "react";
import { EntityPage } from "./EntityPage";
import { productConfig } from "../config/entities/productConfig.js";
import ProductForm from "./pagesForms/ProductForm";
import handleApiCall from "../utils/handleApiCall";

export default function ProductPage() {
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
    } = productConfig;

    // Lógica para manejar el submit
    const onSubmit = async (mode, data) => {

        try {
            const backendData = await productConfig.transformData.toBackend(data);
            console.log("backendData", backendData);
            if (mode === "add") {
                await handleApiCall(
                    () => api.create(backendData),
                    "Producto agregado exitosamente."
                );
            } else if (mode === "edit") {
                await handleApiCall(
                    () => api.update(backendData.DSC_CEDULA, backendData),
                    "Producto actualizado exitosamente."
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
                onDelete={(product) => api.delete(product.DSC_CEDULA)}
                modalComponent={ProductForm}
                entityKey={entityKey}
                transformData={transformData.toFrontend}
                transformConfig={transformConfig}
                actions={actions}
            />
        </>
    );
}