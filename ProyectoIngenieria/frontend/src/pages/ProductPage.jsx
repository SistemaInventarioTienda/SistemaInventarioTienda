import React, { useEffect } from "react";
import { EntityPage } from "./EntityPage";
import { productConfig } from "../config/entities/productConfig.js";
import ProductForm from "./pagesForms/ProductForm";
import handleApiCall from "../utils/handleApiCall";
import { usePermissions } from "../context/authPermissions";
import { toast } from "sonner";
import { useNavigate, useLocation } from "react-router-dom";
import FloatingHelpButton from "../components/common/FloatingHelpButton";

export default function ProductPage() {
    const { permissions } = usePermissions();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        // Verificar solo si los permisos ya se cargaron (home siempre existe)
        if (permissions.home === undefined) return;

        if (!permissions.product) {
            toast.error("No tienes permiso para acceder a productos");
            navigate("/");
        }
    }, [permissions, navigate]);

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

            const formDataObj = {};
            for (const [key, value] of backendData.entries()) {
                formDataObj[key] = value;
            }
 
            if (mode === "add") {
                await handleApiCall(
                    () => api.create(backendData),
                    "Producto agregado exitosamente."
                );

                if (location.state?.returnTo) {
                    navigate(location.state.returnTo.pathname, {
                        state: {
                            ...location.state.returnTo.state,
                        },
                        replace: true
                    });
                }
            } else if (mode === "edit") {
                const productId = parseInt(backendData.get("ID_PRODUCT"), 10);
                await handleApiCall(
                    () => api.update(productId, backendData),
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
                onDelete={(product) => api.delete(product.ID_PRODUCT)}
                modalComponent={ProductForm}
                entityKey={entityKey}
                transformData={transformData.toFrontend}
                transformConfig={transformConfig}
                actions={actions}
                initialModalOpen={location.state?.openProductModal || false}
            />
             <FloatingHelpButton />
        </>
    );
}