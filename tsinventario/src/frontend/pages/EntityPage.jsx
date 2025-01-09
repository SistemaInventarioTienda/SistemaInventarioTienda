import React from "react";
import PageLayout from "../components/layout/PageLayout";
import { Table, Pagination, Button, InputButton, Select, Alert } from "../components/common";
import { ModalComponent, ModalConfirmation } from "../components/modals";
import { useEntityPage } from "../hooks/useEntity";
import { Search, Plus } from "lucide-react";

export const EntityPage = ({
    entityName,
    columns,
    fields,
    fetchAll,
    searchByName,
    onSubmit,
    onDelete,
    modalComponent: ModalFormComponent,
    entityKey,
}) => {
    const {
        data,
        setData,
        filteredData,
        setFilteredData,
        currentPage,
        totalPages,
        loading,
        error,
        searchTerm,
        itemsPerPage,
        sortField,
        sortOrder,
        setCurrentPage,
        setSearchTerm,
        setItemsPerPage,
        setSortField,
        setSortOrder,
        fetchData,
    } = useEntityPage({ fetchAll, searchByValue: searchByName, entityKey });

    const [isModalOpen, setModalOpen] = React.useState(false);
    const [modalMode, setModalMode] = React.useState("add");
    const [modalData, setModalData] = React.useState(null);
    const [isConfirmationModalOpen, setConfirmationModalOpen] = React.useState(false);
    const [alert, setAlert] = React.useState({ show: false, message: "", type: "" });

    const handleAdd = () => {
        setModalMode("add");
        setModalData({});
        setModalOpen(true);
    };

    const handleEdit = (rowData) => {
        setModalMode("edit");
        setModalData(rowData);
        setModalOpen(true);
    };

    const handleDeleteConfirmation = (rowData) => {
        setModalData(rowData);
        setConfirmationModalOpen(true);
    };

    const handleDelete = async () => {
        try {
            await onDelete(modalData);

            // Recargar los datos después de la eliminación
            fetchData();

            // Mostrar la alerta de éxito
            setAlert({ show: true, message: `${entityName} eliminado exitosamente.`, type: "success" });
        } catch (error) {
            console.log("error", error);
            // Mostrar la alerta de error
            setAlert({ show: true, message: `Error al eliminar ${entityName}.`, type: "error" });
        } finally {
            setConfirmationModalOpen(false);
        }
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <PageLayout>
            <div className="page-header">
                <h1>{entityName}</h1>
                <Button className="add-btn" onClick={handleAdd}>
                    <Plus size={20} />
                    Agregar {entityName}
                </Button>
            </div>
            <div className="page-controls">
                {/* Buscador */}
                <div className="search-container">
                    <InputButton
                        inputClassName="search-input"
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder={`Buscar ${entityName.toLowerCase()}...`}
                        icon={Search}
                    />
                </div>
                {/* Selección de registros por página */}
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
            {/* Tabla */}
            <Table
                columns={columns}
                data={filteredData}
                onSort={(field) => setSortField(field)}
                sortField={sortField}
                sortOrder={sortOrder}
                actions={{
                    edit: handleEdit,
                    delete: handleDeleteConfirmation,
                }}
            />
            {/* Paginación */}
            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
            />
            {/* Modal de formulario */}
            <ModalComponent
                isOpen={isModalOpen}
                title={modalMode === "add" ? `Agregar ${entityName}` : `Editar ${entityName}`}
                onClose={() => setModalOpen(false)}
                onSubmit={(formData) => {
                    onSubmit(modalMode, formData);
                    fetchData();
                    setModalOpen(false);
                }}
                initialData={modalData}
                fields={fields}
            >
                <ModalFormComponent data={modalData} />
            </ModalComponent>
            {/* Modal de confirmación */}
            <ModalConfirmation
                isOpen={isConfirmationModalOpen}
                onClose={() => setConfirmationModalOpen(false)}
                onConfirm={handleDelete}
            />
            {/* Alerta */}
            {alert.show && (
                <Alert
                    type={alert.type}
                    message={alert.message}
                    duration={3000}
                    onClose={() => setAlert({ ...alert, show: false })}
                />
            )}
        </PageLayout>
    );
};
