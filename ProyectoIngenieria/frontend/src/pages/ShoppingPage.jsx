import React, { useEffect } from "react";
import { EntityPage } from "./EntityPage";
import { shoppingConfig } from "../config/entities/shoppingConfig";
import ShoppingForm from "./pagesForms/ShoppingForm.jsx";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { usePermissions } from "../context/authPermissions";

export default function ShoppingPage() {

    const { permissions } = usePermissions();
    const navigate = useNavigate();

    useEffect(() => {
        if (permissions && !permissions.shopping) {
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
    } = shoppingConfig;

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
                onDelete={(shopping) => api.delete(shopping.ID_COMPRA)}
                entityKey={entityKey}
                modalComponent={ShoppingForm}
                transformData={transformData?.toFrontend}
                transformConfig={transformConfig}
                actions={actions}
                action={"Anular"}
                confirmButtonText={"Anular"}
            />
        </>
    );
}