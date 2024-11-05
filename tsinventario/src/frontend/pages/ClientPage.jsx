import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
import PageLayout from "../components/PageLayout";
import Table from "../components/ui/Table";
import Pagination from "../components/ui/Pagination";
import { Button, InputButton, Select, Alert } from "../components/ui";
import ModalComponent from "../components/Modal";
import ModalConfirmation from "../components/ui/ModalConfirmation";
import { Search, UserCheck } from "lucide-react";
import { getClients, updateClient, registerClient, deleteClient, searchClient } from "../api/client";
import "./css/Page.css";

export default function ClientPage() {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();

    const [isModalOpen, setModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState("add");
    const [modalData, setModalData] = useState(null);
    const [isConfirmationModalOpen, setConfirmationModalOpen] = useState(false);
    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [itemsPerPage, setItemsPerPage] = useState(5);
    const [errorMessages, setErrorMessages] = useState([]);
    const [sortField, setSortField] = useState(null);
    const [sortOrder, setSortOrder] = useState('asc');
    const [alert, setAlert] = useState({ show: false, message: "", type: "" });

    const columns = [
        { field: "DSC_CEDULA", label: "Cédula" },
        { field: "DSC_NOMBRE", label: "Nombre" },
        { field: "DSC_APELLIDOUNO", label: "Primer Apellido" },
        { field: "DSC_APELLIDODOS", label: "Segundo Apellido" },
        { field: "DSC_TELEFONO", label: "Teléfono" },
        { field: "ESTADO", label: "Estado" },
        { field: "actions", label: "Acciones" }
    ];

    const clientFields = [
        { name: "cedula", label: "Cédula", type: "text", required: true },
        { name: "nombre", label: "Nombre", type: "text", required: true },
        { name: "primerApellido", label: "Primer Apellido", type: "text", required: true },
        { name: "segundoApellido", label: "Segundo Apellido", type: "text" },
        { name: "direccion", label: "Dirección", type: "text", required: true },
        { name: "estado", label: "Estado", type: "select", required: true },
        { name: "foto", label: "Fotografía", type: "file", required: true },
    ];

    const refreshData = async (data) => {
        try {
            const transformedClients = data.clients ? data.clients.map(client => ({
                ...client,
                ESTADO: client.ESTADO === 1 ? "ACTIVO" : "INACTIVO",
                DSC_TELEFONO: client.TelefonoClientes && client.TelefonoClientes.length > 0
                    ? client.TelefonoClientes[0].DSC_TELEFONO
                    : "No Disponible"
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

    const fetchClients = async () => {
        try {
            const response = await getClients(currentPage, itemsPerPage);
            const transformedClients = response.clients.map(client => ({
                ...client,
                ESTADO: client.ESTADO === 1 ? "ACTIVO" : "INACTIVO",
                DSC_TELEFONO: client.TelefonoClientes && client.TelefonoClientes.length > 0
                    ? client.TelefonoClientes[0].DSC_TELEFONO
                    : "No Disponible"
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

    const handleViewClient = (client) => openModal("view", client);
    const handleEditClient = (client) => openModal("edit", client);

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
            setAlert({ show: true, message: "Cliente eliminado exitosamente", type: "success" });
            await fetchClients();
            setConfirmationModalOpen(false);
        } catch (err) {
            const errorMessage = err.message?.data?.message || "Error desconocido al eliminar al usuario.";
            setAlert({ show: true, message: errorMessage, type: "error" });
        }
    };

    const handleAddClient = () => openModal("add");

    const openModal = (mode, client = {}) => {
        setModalMode(mode);
        setModalData(
            mode === "add" ? { telefonos: [] } : mapClientFields(client)
        );
        setModalOpen(true);
    };

    const mapClientFields = (client) => ({
        cedula: client.DSC_CEDULA,
        nombre: client.DSC_NOMBRE,
        primerApellido: client.DSC_APELLIDOUNO,
        segundoApellido: client.DSC_APELLIDODOS,
        direccion: client.DSC_DIRECCION,
        foto: process.env.PUBLIC_URL + '/Assets/image/clientes/' + client.URL_FOTO,
        estado: client.ESTADO === "ACTIVO" ? 1 : 2,
        telefonos: client.TelefonoClientes ? client.TelefonoClientes.map(t => t.DSC_TELEFONO) : [],
    });

    const handleSubmit = async (clientData) => {
        let successMessageText = "";
        console.log('clientData', clientData);
        const clientPayload = {
            DSC_CEDULA: clientData.cedula,
            DSC_NOMBRE: clientData.nombre,
            DSC_APELLIDOUNO: clientData.primerApellido,
            DSC_APELLIDODOS: clientData.segundoApellido,
            DSC_DIRECCION: clientData.direccion,
            URL_FOTO: clientData.foto,
            ESTADO: clientData.estado,
        };

        console.log(clientPayload);
        // Agregar teléfonos al payload
        clientData.telefonos.forEach((telefono, index) => {
            clientPayload[`DSC_TELEFONO${index + 1}`] = telefono;
        });

        try {
            if (modalMode === "add") {
                await registerClient(clientPayload);
                successMessageText = "Cliente agregado exitosamente";
            } else if (modalMode === "edit") {
                await updateClient(clientData.cedula, clientPayload);
                successMessageText = "Cliente actualizado exitosamente";
            }
            setAlert({ show: true, message: successMessageText, type: "success" });
            await fetchClients();
            setModalOpen(false);
        } catch (error) {
            const errorMessage = error.response?.data?.message || `Error desconocido al ${modalMode === "add" ? "agregar" : "actualizar"} el cliente.`;
            setAlert({ show: true, message: errorMessage, type: "error" });
        }
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
                    <InputButton
                        type="text"
                        inputClassName="search-input"
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
                        icon={Search}
                        onButtonClick={async () => {
                            if (!searchTerm.trim()) {
                                allClients(sortField, sortOrder, true);
                            } else {
                                searchClients(sortField, sortOrder, true);
                            }
                        }}
                    />
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
                mode={modalMode}
                fields={clientFields}
                data={modalData}
                onClose={() => setModalOpen(false)}
                onSubmit={handleSubmit}
                errorMessages={errorMessages}
                setErrorMessages={setErrorMessages}
                entityName="Cliente"
            />
        </PageLayout>
    );
}