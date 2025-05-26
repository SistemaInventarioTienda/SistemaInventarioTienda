import React, { useEffect } from "react";
import { EntityPage } from "./EntityPage";
import { supplierConfig } from "../config/entities/supplierConfig";
import SupplierForm from "./pagesForms/SupplierForm";
import { toast } from "sonner";
import handleApiCall from "../utils/handleApiCall";
import { usePermissions } from "../context/authPermissions";
import { useNavigate, useLocation } from "react-router-dom";

export default function SupplierPage() {
    const { permissions } = usePermissions();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (permissions.home === undefined) return;

        if (!permissions.suppliers) {
            toast.error("No tienes permiso para acceder a proveedores");
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
    } = supplierConfig;

    const onSubmit = async (mode, data) => {
        try {
            const backendData = await transformData.toBackend(data);

            if (mode === "add") {
                await handleApiCall(
                    () => api.create(backendData),
                    "Proveedor agregado exitosamente."
                );

                if (location.state?.returnTo) {
                    navigate(location.state.returnTo.pathname, { 
                        state: {
                            ...location.state.returnTo.state,
                            shouldRefreshSuppliers: true
                        },
                        replace: true
                    });
                }
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
            initialModalOpen={location.state?.openSupplierModal || false}
        />
    );
}