import React, { useEffect, useState } from "react";
// Routing
import { useNavigate } from "react-router-dom";
// Contexts
import { useAuth } from "../context/authContext";
// Layout components
import PageLayout from "../components/layout/PageLayout";
// Common components
import { Table, Pagination, Button, InputButton, Select, Alert, } from "../components/common";
// Modals
import { ModalComponent, ModalConfirmation } from "../components/modals";
// Forms
import SupplierForm from "./pagesForms/SupplierForm";
// Icons
import { Search, Truck } from "lucide-react";
// API calls
import { getSuppliers, updateSupplier, registerSupplier, deleteSupplier, searchSupplier, getAllSupplierTypes, } from "../api/supplier";
// Styles
import "./styles/Page.css";


export default function SupplierPage() {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();

    const [isModalOpen, setModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState("add");
    const [modalData, setModalData] = useState(null);
    const [isConfirmationModalOpen, setConfirmationModalOpen] = useState(false);

    const [filteredData, setFilteredData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const [searchTerm, setSearchTerm] = useState("");
    const [itemsPerPage, setItemsPerPage] = useState(5);
    const [errorMessages, setErrorMessages] = useState([]);
    const [sortField, setSortField] = useState(null);
    const [sortOrder, setSortOrder] = useState("asc");
    const [alert, setAlert] = useState({ show: false, message: "", type: "" });

    const [supplierTypes, setSupplierTypes] = useState([]);

    const columns = [
        { field: "DSC_NOMBRE", label: "Nombre" },
        { field: "DSC_TELEFONO", label: "Telefono" },
        { field: "DSC_CORREO", label: "Correo" },
        { field: "DSC_TIPOPROVEEDOR", label: "Tipo de Proveedor" },
        { field: "ESTADO", label: "Estado" },
        { field: "actions", label: "Acciones" },
    ];

    const supplierFields = [
        { name: "nombre", label: "Nombre", type: "text", required: true },
        { name: "direccion", label: "Dirección", type: "text", required: true },
        { name: "tipoProveedor", label: "Tipo de Proveedor", type: "select", required: true, },
        { name: "estado", label: "Estado", type: "select", required: true },
    ];

    const refreshData = async (data) => {
        try {
            const transformedSuppliers = data.suppliers
                ? data.suppliers.map((supplier) => ({
                    ...supplier,
                    ESTADO: supplier.ESTADO === 1 ? "ACTIVO" : "INACTIVO",

                    DSC_TELEFONO:
                        supplier.numberSuppliers && supplier.numberSuppliers.length > 0
                            ? supplier.numberSuppliers[0].DSC_TELEFONO
                            : "No Disponible",
                    DSC_CORREO:
                        supplier.mailSuppliers && supplier.mailSuppliers.length > 0
                            ? supplier.mailSuppliers[0].DSC_CORREO
                            : "No Disponible",
                    DSC_TIPOPROVEEDOR:
                        supplier.supplierType?.DSC_NOMBRE || "No Disponible",

                }))
                : [];
            console.log(transformedSuppliers);
            setModalData(transformedSuppliers);
            setFilteredData(transformedSuppliers);
            setTotalPages(data.totalPages);
        } catch (err) {
            setError(err.message);
        }
    };

    const fetchSuppliersTypes = async () => {
        try {
            const data = await getAllSupplierTypes();
            console.log(data.type);
            setSupplierTypes(data.type || []);
        } catch (error) {
            setError("Error al cargar los tipos de proveedores");
        } finally {
            setLoading(false);
        }
    };

    const allSuppliers = async (field, order, flag) => {
        let aux = currentPage;
        if (flag === true) {
            aux = 1;
            setCurrentPage(1);
        }
        const response = await getSuppliers(aux, itemsPerPage, field, order);
        console.log(response);
        refreshData(response);
    };

    const searchSuppliers = async (field, order, flag) => {
        let aux = currentPage;
        if (flag === true) {
            aux = 1;
            setCurrentPage(1);
        }
        const response = await searchSupplier(aux, itemsPerPage, searchTerm, field, order);
        refreshData(response);
    }

    const fetchSuppliers = async () => {
        try {
            const response = await getSuppliers(currentPage, itemsPerPage);
            console.log("Datos de proveedores:", response);
            const transformedSuppliers = response.suppliers.map((supplier) => ({
                ...supplier,
                ESTADO: supplier.ESTADO === 1 ? "ACTIVO" : "INACTIVO",
                DSC_DIRECCION:
                    supplier.supplierDirection?.DSC_DIRECCIONEXACTA || "No Disponible",
                DSC_TIPOPROVEEDOR: supplier.supplierType?.DSC_NOMBRE || "No Disponible",

                DSC_TELEFONO: supplier.numberSuppliers && supplier.numberSuppliers.length > 0
                    ? supplier.numberSuppliers[0].DSC_TELEFONO
                    : "No Disponible",

                DSC_CORREO: supplier.mailSuppliers && supplier.mailSuppliers.length > 0
                    ? supplier.mailSuppliers[0].DSC_CORREO
                    : "No Disponible",
            }));
            setModalData(transformedSuppliers);
            setFilteredData(transformedSuppliers);
            setTotalPages(response.totalPages);

            console.log("Datos transformados para la tabla:", transformedSuppliers);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        document.title = "Proveedores";
        if (!isAuthenticated) {
            navigate("/login");
        } else {
            fetchSuppliersTypes();
            if (!searchTerm.trim()) {
                allSuppliers(sortField, sortOrder, false);
            } else {
                searchSuppliers(sortField, sortOrder, false);
            }
        }
    }, [isAuthenticated, navigate, currentPage, itemsPerPage]);

    //Funcion para ordenar los registros
    const sortData = (field) => {
        if (field === "actions") return;
        let newOrder = sortOrder;
        if (field !== sortField) {
            setSortField(field);
            newOrder = "desc";
        } else {
            newOrder = sortOrder === "asc" ? "desc" : "asc";
        }
        setSortOrder(newOrder);
        if (!searchTerm.trim()) {
            allSuppliers(field, newOrder, false);
        } else {
            searchSuppliers(sortField, sortOrder, false);
        }
    };

    const handlePageChange = (page) => setCurrentPage(page);

    const handleViewSupplier = (supplier) => openModal("view", supplier);
    const handleEditSupplier = (supplier) => openModal("edit", supplier);

    const confirmDelete = (supplier) => {
        setModalData(supplier);
        setModalOpen(false);
        setConfirmationModalOpen(true);
    };

    const handleDeleteSupplier = (supplier) => {
        confirmDelete(supplier);
    };

    const handleDelete = async (supplier) => {
        try {
            await deleteSupplier(supplier.IDENTIFICADOR_PROVEEDOR);
            setAlert({
                show: true,
                message: "Proveedor eliminado exitosamente",
                type: "success",
            });
            await fetchSuppliers();
            setConfirmationModalOpen(false);
        } catch (error) {
            const errorMessage =
                error.message?.data?.message ||
                "Error desconocido al eliminar el proveedor.";
            setAlert({ show: true, message: errorMessage, type: "error" });
        }
    };

    const handleAddSupplier = () => openModal("add");

    const openModal = (mode, supplier = {}) => {
        if (supplierTypes.length === 0) {
            fetchSuppliersTypes();
        }
        console.log(supplier)
        setModalMode(mode);
        setModalData(
            mode === "add" ? { telefonos: [], correos: [] } : mapSupplierFiels(supplier)
        );
        setModalOpen(true);
    };

    //map del proveedor
    const mapSupplierFiels = (supplier) => ({
        nombre: supplier.DSC_NOMBRE,
        tipoProveedor: supplier.DSC_TIPOPROVEEDOR,
        estado: supplier.ESTADO === "ACTIVO" ? 1 : 2,
        direccion: supplier.DSC_DIRECCION,
        telefonos: supplier.numberSuppliers.map(t => t.DSC_TELEFONO) || [],
        correos: supplier.mailSuppliers.map(t => t.DSC_CORREO) || [],
    });

    const handleSubmit = async (supplierData) => {
        let successMessageText = "";
        console.log("supplierData", supplierData);
        const supplierPayload = {
            IDENTIFICADOR_PROVEEDOR: supplierData.identificador, // Agrega este campo
            DSC_NOMBRE: supplierData.nombre,
            ID_TIPOPROVEEDOR: parseInt(supplierData.tipoProveedor, 10),
            ESTADO: supplierData.estado,
            DSC_DIRECCIONEXACTA: supplierData.direccion,
            phones: supplierData.telefonos,
            emails: supplierData.correos,
        };

        try {
            if (modalMode === "add") {
                await registerSupplier(supplierPayload);
                successMessageText = "Proveedor agregado exitosamente";
            } else if (modalMode === "edit") {
                await updateSupplier(supplierPayload);
                successMessageText = "Proveedor actualizado exitosamente";
            }
            setAlert({ show: true, message: successMessageText, type: "success" });
            await fetchSuppliers();
            setModalOpen(false);
        } catch (error) {
            const errorMessage =
                error.response?.data?.message ||
                `Error desconocido al ${modalMode === "add" ? "agregar" : "actualizar"} el proveedor.`;
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
                    <h1>Proveedores</h1>
                    <p>Gestión de proveedores del sistema</p>
                </div>
                <Button className="add-btn" onClick={handleAddSupplier}>
                    {/* onClick={handleAddSupplier} */}
                    <Truck size={20} />
                    Agregar Proveedor
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
                {/* header arriba de la tabla */}
                <div className="search-container">
                    <InputButton
                        type="text"
                        inputClassName="search-input"
                        value={searchTerm}
                        onChange={(e) => {
                            if (e.target.value.trim() === "") {
                                setSearchTerm("");
                                allSuppliers(sortField, sortOrder, true);
                            } else {
                                setSearchTerm(e.target.value);
                            }
                        }}
                        onKeyPress={(e) => {
                            if (e.key === "Enter") {
                                if (e.target.value.trim() === "") {
                                    setSearchTerm("");
                                    allSuppliers(sortField, sortOrder, true);
                                } else {
                                    setSearchTerm(e.target.value);
                                    searchSuppliers(sortField, sortOrder, true);
                                }
                            }
                        }}
                        placeholder="Buscar proveedores..."
                        icon={Search}
                        onButtonClick={async () => {
                            if (!searchTerm.trim()) {
                                allSuppliers(sortField, sortOrder, true);
                            } else {
                                searchSuppliers(sortField, sortOrder, true);
                            }
                        }}
                    />
                </div>
                <div className="items-per-page">
                    {/* <div>
            <h2>Tipos de Proveedores</h2>
            <ul>
                {supplierTypes.map((type) => (
                <li key={type.ID_TIPOPROVEEDOR}>{type.DSC_NOMBRE}</li> // Ajusta 'id' y 'name' según tu modelo
                ))}
            </ul>
        </div> */}
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
                actions={{ edit: handleEditSupplier, delete: handleDeleteSupplier, view: handleViewSupplier }}
                onSort={sortData}
                sortField={sortField}
                sortOrder={sortOrder}
            />
            <Pagination
                totalPages={totalPages}
                currentPage={currentPage}
                onPageChange={handlePageChange}
            />
            <ModalConfirmation
                isOpen={isConfirmationModalOpen}
                onClose={() => setConfirmationModalOpen(false)}
                onConfirm={() => handleDelete(modalData)}
                action="eliminar"
                confirmButtonText="Eliminar"
                cancelButtonText="Cancelar"
                errorMessages={errorMessages}
            />
            <ModalComponent
                isOpen={isModalOpen}
                mode={modalMode}
                fields={supplierFields}
                data={modalData}
                onClose={() => setModalOpen(false)}
                onSubmit={handleSubmit}
                errorMessages={errorMessages}
                setErrorMessages={setErrorMessages}
                entityName="Proveedor" //revisar esto
                supplierTypes={supplierTypes}
            >
                <SupplierForm
                    mode={modalMode}
                    initialData={modalData}
                    onSubmit={handleSubmit}
                    fields={supplierFields}
                />
            </ModalComponent>
        </PageLayout>
    );
}