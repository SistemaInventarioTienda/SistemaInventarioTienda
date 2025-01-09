import React from "react";
import { EntityPage } from "./EntityPage";
import { getClients, searchClient, registerClient, updateClient, deleteClient } from "../api/client";
import ClientForm from "./forms/ClientForm";

export default function ClientPage() {
    const handleClientSubmit = async (mode, clientData) => {
        if (mode === "add") {
            await registerClient(clientData);
        } else if (mode === "edit") {
            await updateClient(clientData.cedula, clientData);
        }
    };

    return (
        <EntityPage
            entityName="Clientes"
            entityMessage="Gestión de clientes del sistema"
            columns={[
                { field: "DSC_CEDULA", label: "Cédula" },
                { field: "DSC_NOMBRE", label: "Nombre" },
                { field: "DSC_APELLIDOUNO", label: "Primer Apellido" },
                { field: "DSC_APELLIDODOS", label: "Segundo Apellido" },
                { field: "DSC_TELEFONO", label: "Teléfono" },
                { field: "ESTADO", label: "Estado" },
                { field: "actions", label: "Acciones" },
            ]}
            fields={[
                { name: "cedula", label: "Cédula", type: "text", required: true },
                { name: "nombre", label: "Nombre", type: "text", required: true },
                { name: "primerApellido", label: "Primer Apellido", type: "text", required: true },
                { name: "segundoApellido", label: "Segundo Apellido", type: "text" },
                { name: "direccion", label: "Dirección", type: "text", required: true },
                { name: "estado", label: "Estado", type: "select", required: true },
                { name: "foto", label: "Fotografía", type: "file", required: true },
            ]}
            fetchAll={getClients}
            searchByName={searchClient}
            onSubmit={handleClientSubmit}
            onDelete={(client) => deleteClient(client.DSC_CEDULA)}
            modalComponent={ClientForm}
            entityKey="clients" // Clave para identificar la entidad en useEntity
        />
    );
}
