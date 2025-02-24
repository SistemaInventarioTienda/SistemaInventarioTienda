import React, { forwardRef, useImperativeHandle } from "react"; // Importar forwardRef y useImperativeHandle
import PageLayout from "../components/layout/PageLayout";
import {
  Table,
  Pagination,
  Button,
  InputButton,
  Select,
} from "../components/common";
import { ModalComponent, ModalConfirmation } from "../components/modals";
import { useEntityPage } from "../hooks/useEntityPage";
import { Search, Plus } from "lucide-react";
import { toast } from "sonner";

// Usar forwardRef para envolver el componente
export const EntityPage = forwardRef(
  (
    {
      entityName,
      titlePage,
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
      transformConfig,
      actions = {},
      expandableKey,
      onAddSubcategory,
      subcategoryActions,
    },
    ref
  ) => {
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
      fetchData,
      toggleSortOrder,
    } = useEntityPage({
      fetchAll,
      searchByValue: searchByName,
      entityKey,
      transformConfig,
    });

    const [isModalOpen, setModalOpen] = React.useState(false);
    const [modalMode, setModalMode] = React.useState("add");
    const [modalData, setModalData] = React.useState(null);
    const [isConfirmationModalOpen, setConfirmationModalOpen] =
      React.useState(false);

    // Exponer fetchData al componente padre usando useImperativeHandle
    useImperativeHandle(ref, () => ({
      fetchData: () => {
        fetchData({ transformConfig });
      },
    }));

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
      console.log("Ver detalles de:", rowData);
      setModalMode("view");
      setModalData(transformData ? transformData(rowData) : rowData);
      setModalOpen(true);
    };

    const handleDeleteConfirmation = (rowData) => {
      setModalData(rowData);
      setConfirmationModalOpen(true);
    };

    const tableActions = Object.entries(actions)
      .filter(([actionKey, isEnabled]) => isEnabled)
      .reduce((acc, [actionKey, isEnabled]) => {
        if (isEnabled) {
          acc[actionKey] =
            actionKey === "grantPermissions"
              ? actions.grantPermissions
              : actionKey === "edit"
              ? handleEdit
              : actionKey === "delete"
              ? handleDeleteConfirmation
              : actionKey === "view"
              ? handleView
              : undefined;
        }
        return acc;
      }, {});

    React.useEffect(() => {
      if (searchTerm.trim() === "") {
        fetchData({ resetPage: true, term: "", transformConfig });
      }
    }, [searchTerm]);

    const handleDelete = async () => {
      try {
        await onDelete(modalData);
        fetchData({ transformConfig });
        toast.success(`${entityName} eliminado exitosamente.`);
      } catch (error) {
        toast.error(error.response?.data?.message);
      } finally {
        setConfirmationModalOpen(false);
      }
    };

    const handleSearch = () => {
      fetchData({ resetPage: true, transformConfig });
    };

    const handleSort = (field) => {
      toggleSortOrder(field);
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
      <PageLayout>
        <div className="page-header">
          <div>
            <h1>{titlePage}</h1>
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
              onChange={(e) => {
                const value = e.target.value;
                setSearchTerm(value);

                if (value.trim() === "") {
                  fetchData({
                    resetPage: true,
                    term: "",
                    transformConfig: transformConfig,
                  });
                }
              }}
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
          actions={tableActions}
          expandableKey={expandableKey}
          onAddSubcategory={onAddSubcategory}
          subcategoryActions={subcategoryActions}
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
              : modalMode === "edit"
              ? `Editar ${entityName}`
              : `Información detallada`
          }
          mode={modalMode}
          onClose={() => setModalOpen(false)}
          entityName={entityName}
        >
          <ModalFormComponent
            mode={modalMode}
            initialData={modalData}
            fields={fields}
            onSubmit={async (formData) => {
              try {
                const response = await onSubmit(modalMode, formData);
                console.log(response);
                if (response && response.success) {
                  await fetchData({ transformConfig });
                  setModalOpen(false);
                  console.log("✅ Modal cerrado correctamente");
                } else {
                  console.error("❌ Error: Respuesta no exitosa", response);
                }
              } catch (error) {
                console.error("❌ Error al guardar:", error);
              }
            }}
            onCancel={() => setModalOpen(false)}
          />
        </ModalComponent>

        <ModalConfirmation
          isOpen={isConfirmationModalOpen}
          onClose={() => setConfirmationModalOpen(false)}
          onConfirm={handleDelete}
          entityName={entityName}
          action="delete"
          confirmButtonText="Eliminar"
          cancelButtonText="Cancelar"
        />
      </PageLayout>
    );
  }
);
