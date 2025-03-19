import React, { useEffect } from "react";
import { EntityPage } from "./EntityPage";
import { salesConfig } from "../config/entities/salesConfig";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { usePermissions } from "../context/authPermissions";
export default function SalePage() {

    const { permissions } = usePermissions();
    const navigate = useNavigate();

    useEffect(() => {
        if (permissions && !permissions.sales) {
            toast.error("No tienes permiso para acceder a ventas");
            navigate("/");
        }
    }, [permissions, navigate]);

    const {
        entityName,
        titlePage,
        entityMessage,
        columns,
        entityKey,
        api,
        transformData,
        transformConfig,
        actions,
    } = salesConfig;

    return (
        <>
            <EntityPage
                entityName={entityName}
                titlePage={titlePage}
                entityMessage={entityMessage}
                columns={columns}
                fetchAll={api.fetchAll}
                searchByName={api.searchByName}
                onDelete={(sale) => api.delete(sale.ID_SALE)}
                entityKey={entityKey}
                transformData={transformData?.toFrontend}
                transformConfig={transformConfig}
                actions={actions}
            />
        </>
    );
}