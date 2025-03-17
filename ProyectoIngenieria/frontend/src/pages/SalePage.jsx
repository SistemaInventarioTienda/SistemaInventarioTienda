import React from "react";
import { EntityPage } from "./EntityPage";
import { salesConfig } from "../config/entities/salesConfig";

export default function SalePage() {
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