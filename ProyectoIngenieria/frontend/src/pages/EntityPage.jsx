import React from "react";
import PageLayout from "../components/layout/PageLayout";
import { Table, Pagination, Button, InputButton, Select, Alert } from "../components/common";
import { ModalComponent, ModalConfirmation } from "../components/modals";
import { useEntityPage } from "../hooks/useEntity";
import { Search, Plus } from "lucide-react";


export const EntityPage = ({
    entityName,
    entityMessage,
    columns,
    fields,
    fetchAll,
    searchByName,
    onSubmit,
    onDelete,
    modalComponent: ModalFormComponent,
    entityKey,
    transformData,
}) => {
    const {
        data,
        filteredData,
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
        setModalData(transformData ? transformData(rowData) : rowData);
        setModalOpen(true);
    };

    const handleView = (rowData) => {
        setModalMode("view");
        setModalData(transformData ? transformData(rowData) : rowData);
        setModalOpen(true);
    };

    const handleDeleteConfirmation = (rowData) => {
        setModalData(rowData);
        setConfirmationModalOpen(true);
    };

    const handleDelete = async () => {
        try {
            await onDelete(modalData);

            fetchData(); // Recargar datos tras eliminación
            setAlert({ show: true, message: `${entityName} eliminado exitosamente.`, type: "success" });
        } catch (error) {
            setAlert({ show: true, message: `Error al eliminar ${entityName}.`, type: "error" });
        } finally {
            setConfirmationModalOpen(false);
        }
    };

    const handleSearch = () => {
        fetchData(true); // Forzar búsqueda con el término actual
    };

    const handleSort = (field) => {
        const order = sortField === field && sortOrder === "asc" ? "desc" : "asc";
        setSortField(field);
        setSortOrder(order);
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <PageLayout>
            <div className="page-header">
                <div>
                    <h1>{entityName}</h1>
                    <p>{entityMessage}</p>
                </div>
                <Button className="add-btn" onClick={handleAdd}>
                    <Plus size={20} />
                    Agregar {entityName}
                </Button>
            </div>
            <div className="page-controls">
                <div className="search-container">
                    <InputButton
                        inputClassName="search-input"
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyPress={(e) => {
                            if (e.key === "Enter") handleSearch();
                        }}
                        placeholder={`Buscar ${entityName.toLowerCase()}...`}
                        icon={Search}
                        onButtonClick={handleSearch}
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
                onSort={handleSort}
                sortField={sortField}
                sortOrder={sortOrder}
                actions={{
                    view: handleView,
                    edit: handleEdit,
                    delete: handleDeleteConfirmation,
                }}
            />
            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
            />
            <ModalComponent
                isOpen={isModalOpen}
                title={
                    modalMode === "add"
                        ? `Agregar ${entityName}`
                        : `Editar ${entityName}`
                }
                mode={modalMode} // Prop adicional
                onClose={() => setModalOpen(false)}
                onSubmit={(formData) => {
                    onSubmit(modalMode, formData);
                    fetchData();
                    setModalOpen(false);
                }}
                entityName={entityName}
            >
                <ModalFormComponent
                    mode={modalMode}
                    initialData={modalData}
                    fields={fields}
                    onSubmit={(formData) => {
                        onSubmit(modalMode, formData);
                    }}
                />
            </ModalComponent>

            <ModalConfirmation
                isOpen={isConfirmationModalOpen}
                onClose={() => setConfirmationModalOpen(false)}
                onConfirm={handleDelete}
            />
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
