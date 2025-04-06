import React, { useEffect } from "react";
import { EntityPage } from "./EntityPage";
import { salesConfig } from "../config/entities/salesConfig";
import SaleForm from "./pagesForms/SaleForm";
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
        fields,
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
                fields={fields}
                fetchAll={api.fetchAll}
                searchByName={api.searchByName}
                onDelete={(sale) => api.delete(sale.ID_VENTA)}
                entityKey={entityKey}
                modalComponent={SaleForm}
                transformData={transformData?.toFrontend}
                transformConfig={transformConfig}
                actions={actions}
                action={"Anular"}
                confirmButtonText={"Anular"}
            />
        </>
    );
}