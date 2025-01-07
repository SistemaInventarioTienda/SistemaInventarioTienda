// React imports
import React, { useEffect, useState } from "react";
// Routing
import { useNavigate } from "react-router-dom";
// Contexts
import { useAuth } from "../context/authContext";
// Layout components
import PageLayout from "../components/layout/PageLayout";
// Common components
import { Table, Pagination, Button, Input, Select, Alert, } from "../components/common";
// Modals
import { ModalComponent, ModalConfirmation } from "../components/modals";
// Forms
import ClientForm from "./forms/ClientForm";
// Icons
import { Search, UserCheck } from "lucide-react";
// API calls
import { getClients, updateClient, registerClient, deleteClient, searchClient } from "../api/client";
// Styles
import "./styles/Page.css";

export default function ClientPage() {
    const entityName = 'Clientes';
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();

    const [isModalOpen, setModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState("add");
    const [modalData, setModalData] = useState(null);
    const [isConfirmationModalOpen, setConfirmationModalOpen] = useState(false);
    const [isUpdateConfirmationOpen, setUpdateConfirmationOpen] = useState(false);
    // const [successMessage, setSuccessMessage] = useState("");
    // eslint-disable-next-line
    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [itemsPerPage, setItemsPerPage] = useState(5);
    const [errorMessages, setErrorMessages] = useState([]);
    // eslint-disable-next-line
    const [searchError, setSearchError] = useState(null);
    // eslint-disable-next-line
    // const [showAlert, setShowAlert] = useState(false);

    // Lógica para ordenar los datos
    const [sortField, setSortField] = useState(null);
    const [sortOrder, setSortOrder] = useState('asc');

    const [alert, setAlert] = useState({ show: false, message: "", type: "" }); // Estado para gestionar la alerta
    const [telephones, setTelephones] = useState([]);

    const columns = [
        { field: "DSC_CEDULA", label: "Cédula" },
        { field: "DSC_NOMBRE", label: "Nombre" },
        { field: "DSC_APELLIDOUNO", label: "Primer Apellido" },
        { field: "DSC_APELLIDODOS", label: "Segundo Apellido" },
        { field: "DSC_TELEFONO", label: "Telefono" },
        { field: "ESTADO", label: "Estado" },
        { field: "actions", label: "Acciones" }
    ];

    const clientFields = [
        { name: "cedula", label: "Cédula", type: "text", required: true },
        { name: "nombre", label: "Nombre", type: "text", required: true },
        { name: "primerApellido", label: "Primer Apellido", type: "text", required: true },
        { name: "segundoApellido", label: "Segundo Apellido", type: "text" },
        { name: "direccion", label: "Dirección", type: "text", required: true },
        { name: "fotografia", label: "Fotografía", type: "file", required: true },
        { name: 'estado', label: 'Estado', type: 'select', required: true, options: [{ value: 1, label: 'Activo' }, { value: 0, label: 'Inactivo' },], },
    ];

    const refreshData = async (data) => {
        try {
            const transformedClients = data.clients ? data.clients.map(client => ({
                ...client,
                ESTADO: client.ESTADO === 1 ? "ACTIVO" : "INACTIVO",
            })) : [];
            setData(transformedClients);
            setFilteredData(transformedClients);
            setTotalPages(data.totalPages);
        } catch (err) {
            setError(err.message);
        }
    }

    const allClients = async (field, order, flag) => {
        let aux = currentPage;
        if (flag === true) {
            aux = 1;
            setCurrentPage(1);
        }
        const response = await getClients(aux, itemsPerPage, field, order);
        refreshData(response);
    }

    const searchClients = async (field, order, flag) => {
        let aux = currentPage;
        if (flag === true) {
            aux = 1;
            setCurrentPage(1);
        }
        const response = await searchClient(aux, itemsPerPage, searchTerm, field, order);
        refreshData(response);
    }

    // Lógica para obtener usuarios
    const fetchClients = async () => {
        try {
            const response = await getClients(currentPage, itemsPerPage);
            const transformedClients = response.clients.map(client => ({
                ...client,
                ESTADO: client.ESTADO === 1 ? "ACTIVO" : "INACTIVO",
            })) || [];
            setData(transformedClients);
            setFilteredData(transformedClients);
            setTotalPages(response.totalPages);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        document.title = 'Clientes';
        if (!isAuthenticated) {
            navigate("/login");
        } else {
            if (!searchTerm.trim()) {
                allClients(sortField, sortOrder, false);
            } else {
                searchClients(sortField, sortOrder, false);
            }
        }
    }, [isAuthenticated, navigate, currentPage, itemsPerPage]);

    const sortData = (field) => {
        if (field === "actions") return;

        let newOrder = sortOrder;
        if (field !== sortField) {
            setSortField(field);
            newOrder = 'desc';
        } else {
            newOrder = sortOrder === 'asc' ? 'desc' : 'asc';
        }
        setSortOrder(newOrder);
        if (!searchTerm.trim()) {
            allClients(field, newOrder, false);
        } else {
            searchClients(field, newOrder, false);
        }
    };

    const handlePageChange = (page) => setCurrentPage(page);

    // Funciones para gestionar acciones en la tabla
    const handleViewClient = (client) => openModal("view", client);
    const handleEditClient = (client) => openModal("edit", client);
    // eslint-disable-next-line

    //funcion para comfirmar eliminacion de usuario de la tabla
    const confirmDelete = (client) => {
        setModalData(client);
        setModalOpen(false);
        setConfirmationModalOpen(true);
    };

    const handleDeleteClient = (client) => {
        confirmDelete(client);
    };

    const handleDelete = async (client) => {
        try {
            await deleteClient(client.DSC_CEDULA);
            setAlert({ show: true, message: "Cliente eliminado exitosamente", type: "success" }); // Mostrar alerta de éxito
            await fetchClients();
            setConfirmationModalOpen(false);

        } catch (err) {
            const errorMessage = err.message?.data?.message || "Error desconocido al eliminar al usuario.";
            setAlert({ show: true, message: errorMessage, type: "error" }); // Mostrar alerta de error
        }
    };

    const handleAddClient = () => openModal("add");

    const openModal = (mode, client = null) => {
        console.log("openModal ejecutado", { mode, client });
        setModalMode(mode);
        setModalData(
            mode === "add" ? { telefonos: [] } : mapClientFields(client)
        );
        setModalOpen(true);
        console.log("Estado del modal después de abrir:", isModalOpen); // Este podría no reflejar el cambio inmediato por la naturaleza asíncrona de setState
    };

    const mapClientFields = (client) => ({
        cedula: client.DSC_CEDULA,
        nombre: client.DSC_NOMBRE,
        primerApellido: client.DSC_APELLIDOUNO,
        segundoApellido: client.DSC_APELLIDODOS,
        correo: client.DSC_CORREO,
        direccion: client.DSC_DIRECCION,
        foto: client.URL_FOTO,
        estado: client.ESTADO === "ACTIVO" ? 1 : 2,
        telefonos: client.telefonos || []
    });

    const handleSubmit = async (clientData) => {

        let successMessageText = "";

        if (modalMode === "add") {
            const clientPayload = {
                DSC_CEDULA: clientData.cedula,
                DSC_NOMBRE: clientData.nombre,
                DSC_APELLIDOUNO: clientData.primerApellido,
                DSC_APELLIDODOS: clientData.segundoApellido,
                DSC_CORREO: clientData.correo,
                DSC_DIRECCION: clientData.direccion,
                URL_FOTO: clientData.foto,
                DSC_TELEFONO: clientData.telefono,
                ESTADO: clientData.estado,
            };

            try {
                //funcion para guardar cliente
                await registerClient(clientPayload);
                successMessageText = "Cliente agregado exitosamente";
                setAlert({ show: true, message: successMessageText, type: "success" }); // Mostrar alerta de éxito
                await fetchClients();
            } catch (e) {
                const errorMessage = e.response?.data?.message || "Error desconocido al agregar el cliente.";
                setModalOpen(true);
                setAlert({ show: true, message: errorMessage, type: "error" }); // Mostrar alerta de error
            }
        }
        if (modalMode === "edit") {

            const clientPayload = {
                DSC_CEDULA: clientData.cedula,
                DSC_NOMBRE: clientData.nombre,
                DSC_APELLIDOUNO: clientData.primerApellido,
                DSC_APELLIDODOS: clientData.segundoApellido,
                DSC_CORREO: clientData.correo,
                DSC_DIRECCION: clientData.direccion,
                URL_FOTO: clientData.foto,
                ESTADO: clientData.estado,
            };

            try {
                await updateClient(clientData.cedula, clientPayload);
                successMessageText = "Cliente actualizado exitosamente";
                setAlert({ show: true, message: successMessageText, type: "success" }); // Mostrar alerta de éxito
                await fetchClients();
            } catch (error) {
                const errorMessage = error.response?.data?.message || "Error desconocido al actualizar el usuario.";
                setModalOpen(false);
                setAlert({ show: true, message: errorMessage, type: "error" });
            }
        }
        setModalOpen(false);
        setErrorMessages([]);
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (

        <PageLayout>
            <div className="page-header">
                <div>
                    <h1>Clientes</h1>
                    <p>Gestión de clientes del sistema</p>
                </div>
                <Button className="add-btn" onClick={handleAddClient}>
                    <UserCheck size={20} />
                    Agregar Cliente
                </Button>
            </div>
            {alert.show && (
                <Alert
                    type={alert.type}
                    message={alert.message}
                    duration={3000}
                    onClose={() => setAlert({ ...alert, show: false })}
                />
            )}
            <div className="page-controls">
                <div className="search-container">
                    <Input
                        type="text"
                        className="search-input"
                        value={searchTerm}
                        onChange={(e) => {
                            if (e.target.value.trim() === '') {
                                setSearchTerm("");
                                allClients(sortField, sortOrder, true);
                            } else {
                                setSearchTerm(e.target.value);
                            }
                        }}
                        onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                                if (e.target.value.trim() === '') {
                                    setSearchTerm("");
                                    allClients(sortField, sortOrder, true);
                                } else {
                                    setSearchTerm(e.target.value);
                                    searchClients(sortField, sortOrder, true);
                                }
                            }
                        }}
                        placeholder="Buscar clientes..."
                    />
                    <Button className="search-btn" onClick={async () => {
                        if (!searchTerm.trim()) {
                            allClients(sortField, sortOrder, true);
                        } else {
                            searchClients(sortField, sortOrder, true);
                        }
                    }}>
                        <Search size={20} />
                        Buscar
                    </Button>
                </div>

                <div className="items-per-page">
                    <label htmlFor="itemsPerPage">Mostrar</label>
                    <Select
                        value={itemsPerPage}
                        onChange={(e) => {
                            setItemsPerPage(Number(e.target.value));
                            setCurrentPage(1);
                        }}
                    >
                        <option value={5}>5</option>
                        <option value={10}>10</option>
                        <option value={15}>15</option>
                    </Select>
                    <label htmlFor="itemsPerPage">por página</label>
                </div>
            </div>
            <Table
                columns={columns}
                data={filteredData}
                actions={{ view: handleViewClient, edit: handleEditClient, delete: handleDeleteClient }}
                onSort={sortData}
                sortField={sortField}
                sortOrder={sortOrder}
            />
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />

            <ModalConfirmation
                isOpen={isConfirmationModalOpen}
                onClose={() => setConfirmationModalOpen(false)}
                onConfirm={() => handleDelete(modalData)}
                entityName={modalData?.DSC_CEDULA}
                action="eliminar"
                confirmButtonText="Eliminar"
                cancelButtonText="Cancelar"
                errorMessages={errorMessages}
            />
            
            <ModalComponent
                isOpen={isModalOpen}
                title={
                    modalMode === "add"
                        ? `Agregar ${entityName}`
                        : modalMode === "edit"
                            ? `Editar ${entityName}`
                            : `Detalles de ${entityName}`
                }
                mode={modalMode}
                fields={clientFields} // Verifica esta línea
                data={modalData}
                onClose={() => setModalOpen(false)}
                onSubmit={handleSubmit}
                errorMessages={errorMessages}
                setErrorMessages={setErrorMessages}
                entityName="Cliente"
            >
                <ClientForm
                    mode={modalMode}
                    initialData={modalData}
                    onSubmit={handleSubmit}
                    fields={clientFields}
                />
            </ModalComponent>

        </PageLayout>
    );
}
