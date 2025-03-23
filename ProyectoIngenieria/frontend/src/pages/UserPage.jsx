import React, { useEffect, useState } from "react";
import { EntityPage } from "./EntityPage";
import { userConfig } from "../config/entities/userConfig";
import UserForm from "./pagesForms/UserForm";
import handleApiCall from "../utils/handleApiCall";
import GrantPermissionsForm from "./pagesForms/GrantPermissionsForm";
import "./styles/Page.css";
import { toast } from "sonner";
import { usePermissions } from "../context/authPermissions";
import { useNavigate } from "react-router-dom";
import GrantPermissionsForm from "./pagesForms/GrantPermissionsForm";

export default function UserPage() {

    const { permissions } = usePermissions();
    const navigate = useNavigate();

    useEffect(() => {
        // Verificar solo si los permisos ya se cargaron (home siempre existe)
        if (permissions.home === undefined) return;

        if (!permissions.user) {
            toast.error("No tienes permiso para acceder a usuarios");
            navigate("/");
        }
    }, [permissions, navigate]);
    
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

    const [selectedUser, setSelectedUser] = useState(null);
    const [showPermissionsModal, setShowPermissionsModal] = useState(false);

    // handle para permisos
    const handleGrantPermission = async (user) => {
        console.log("Otorgar permisos a:", user.DSC_CEDULA);
        setSelectedUser(user);
        setShowPermissionsModal(true);
    };

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
                actions={{
                    ...userConfig.actions,
                    grantPermissions: handleGrantPermission
                }}
            />
            <GrantPermissionsForm
                isOpen={showPermissionsModal}
                onClose={() => setShowPermissionsModal(false)}
                user={selectedUser}
            />

            <GrantPermissionsForm
                isOpen={showPermissionsModal}
                onClose={() => setShowPermissionsModal(false)}
                user={selectedUser}
            />

        </>
    );
}