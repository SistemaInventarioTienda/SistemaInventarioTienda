import React from "react";
import { EntityPage } from "./EntityPage";
import { getClients, searchClient, registerClient, updateClient, deleteClient } from "../api/client";
import ClientForm from "./forms/ClientForm";
import { clientFormFields } from '../pages/forms/fields/ClientFormFields';

export default function ClientPage() {

    const mapClientFields = (client) => ({
        cedula: client.DSC_CEDULA,
        nombre: client.DSC_NOMBRE,
        primerApellido: client.DSC_APELLIDOUNO,
        segundoApellido: client.DSC_APELLIDODOS,
        direccion: client.DSC_DIRECCION,
        foto: process.env.PUBLIC_URL + '/Assets/image/clientes/' + client.URL_FOTO,
        estado: client.ESTADO === "ACTIVO" ? 1 : 2,
        telefonos: client.TelefonoClientes
            ? client.TelefonoClientes.map((t) => t.DSC_TELEFONO)
            : [],
    });

    const mapToBackendFields = (formData) => ({
        DSC_CEDULA: formData.cedula,
        DSC_NOMBRE: formData.nombre,
        DSC_APELLIDOUNO: formData.primerApellido,
        DSC_APELLIDODOS: formData.segundoApellido,
        DSC_DIRECCION: formData.direccion,
        URL_FOTO: formData.foto?.name || formData.foto,
        ESTADO: formData.estado,

        TelefonoClientes: formData.telefonos?.map((telefono) => ({
            DSC_TELEFONO: telefono,
        })) || [],
    });

    const handleClientSubmit = async (mode, clientData) => {
        const backendData = mapToBackendFields(clientData);
        if (mode === "add") {
            await registerClient(backendData);
        } else if (mode === "edit") {
            await updateClient(backendData.DSC_CEDULA, backendData);
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
            fields={clientFormFields}
            fetchAll={getClients}
            searchByName={searchClient}
            onSubmit={handleClientSubmit}
            onDelete={(client) => deleteClient(client.DSC_CEDULA)}
            modalComponent={ClientForm}
            entityKey="clients"
            transformData={mapClientFields}
        />
    );
}    