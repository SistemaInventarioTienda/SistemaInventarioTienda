import React, { useEffect } from "react";
import { EntityPage } from "./EntityPage";
import { proformaConfig } from "../config/entities/proformaConfig";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { usePermissions } from "../context/authPermissions";

export default function ProformaPage() {
    const { permissions } = usePermissions();
    const navigate = useNavigate();

    useEffect(() => {
        if (permissions && !permissions.proforma) {
            toast.error("No tienes permiso para acceder a proformas");
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
    } = proformaConfig;

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
                entityKey={entityKey}
                transformData={transformData?.toFrontend}
                transformConfig={transformConfig}
                actions={actions}
                action={"Anular"}
                confirmButtonText={"Anular"}
            />
        </>
    );
}
