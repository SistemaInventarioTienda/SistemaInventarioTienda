import React, { useState, useRef, useEffect } from "react";
import { TransactionConfig } from "../config/entities/TransactionConfig";
import { EntityPage } from "./EntityPage";
import TransactionForm from "./pagesForms/TransactionForm";
import handleApiCall from "../utils/handleApiCall";
import { usePermissions } from "../context/authPermissions";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";


export default function Transferencias() {
    const { permissions } = usePermissions();
    const navigate = useNavigate();

    useEffect(() => {
        if (permissions.home === undefined) return;

        if (!permissions.user) {
            toast.error("No tienes permiso para acceder a Transacciones");
            navigate("/");
        }
    }, [permissions, navigate]);



    const onSubmit = async (mode, data) => {
        try {
            const backendData = transformData.toBackend(data);
            if (mode === "add") {
                await api.create(backendData);
                toast.success("Transacción agregada exitosamente.");
            } else if (mode === "edit") {
                await handleApiCall(
                    () => api.update(backendData.ID_TRANSACCION, backendData),
                    "Transacción actualizado exitosamente."
                );
            }
            return { success: true };
        } catch (error) {
            const rawMessages = error?.response?.data?.message;
            if (Array.isArray(rawMessages)) {
                rawMessages.forEach(msg => toast.error(msg));
            } else {
                toast.error("Ocurrió un error al procesar la transacción.");
            }

        }
    };

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
    } = TransactionConfig;


    return (
        <>
            <EntityPage
                entityName={entityName}
                titlePage={titlePage}
                entityMessage={entityMessage}
                columns={columns}
                fields={fields}
                fetchAll={api.fetchAll}
                searchByName={api.searchTransaction}
                onSubmit={onSubmit}
                onDelete={(transaction) => api.delete(transaction.ID_TRANSACCION)}
                entityKey={entityKey}
                modalComponent={TransactionForm}
                transformData={transformData?.toFrontend}
                transformConfig={transformConfig}
                actions={actions}
                action={"Anular"}
                confirmButtonText={"Anular"}
            />
        </>
    );
}