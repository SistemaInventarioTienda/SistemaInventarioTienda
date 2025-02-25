import React, { useEffect} from "react";
import { useNavigate } from "react-router-dom";
import { EntityPage } from "./EntityPage";
import { clientConfig } from "../config/entities/clientConfig";
import ClientForm from "./pagesForms/ClientForm";
import handleApiCall from "../utils/handleApiCall";
import { toast } from "sonner";
import { usePermissions } from "../context/authPermissions";
export default function ClientPage() {

    const { permissions } = usePermissions();
    const navigate = useNavigate();

    useEffect(() => {
        if (permissions && !permissions.clients) {
            toast.error("No tienes permiso para acceder a Clientes");
            navigate("/");
        }
    }, [permissions, navigate]);

    if (!permissions || !permissions.clients) {
        return null;
    }

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
    } = clientConfig;

    // Lógica para manejar el submit
    const onSubmit = async (mode, data) => {

        try {
            const backendData = await clientConfig.transformData.toBackend(data);
            console.log("backendData", backendData);
            if (mode === "add") {
                await handleApiCall(
                    () => api.create(backendData),
                    "Cliente agregado exitosamente."
                );
            } else if (mode === "edit") {
                await handleApiCall(
                    () => api.update(backendData.DSC_CEDULA, backendData),
                    "Cliente actualizado exitosamente."
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
                onDelete={(client) => api.delete(client.DSC_CEDULA)}
                modalComponent={ClientForm}
                entityKey={entityKey}
                transformData={transformData.toFrontend}
                transformConfig={transformConfig}
                actions={actions}
            />
        </>
    );
}