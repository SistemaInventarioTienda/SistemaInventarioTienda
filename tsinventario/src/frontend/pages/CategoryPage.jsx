import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
import PageLayout from "../components/PageLayout";
import Table from "../components/ui/Table";
import Pagination from "../components/ui/Pagination";
import { getAllCategories, saveCategory, updateCategory, deleteCategory, searchCategoryByName } from "../api/category";
import { Button, Input, Select, Alert } from "../components/ui";
import ModalConfirmation from "../components/ui/ModalConfirmation";
import ModalComponent from "../components/Modal";
import { Tag, Search } from "lucide-react";
// import { Alert } from "../components/ui";
import "./css/Page.css";

export default function CategoryPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [isModalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("add");
  const [modalData, setModalData] = useState(null);
  const [isConfirmationModalOpen, setConfirmationModalOpen] = useState(false);

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

  const [alert, setAlert] = useState({ show: false, message: "", type: "" });

  // Lógica para ordenar los datos
  const [sortField, setSortField] = useState('DSC_NOMBRE');
  const [sortOrder, setSortOrder] = useState('asc');

  const columns = [
    { field: "DSC_NOMBRE", label: "Nombre" },
    { field: "ESTADO", label: "Estado" },
    { field: "actions", label: "Acciones" }
  ];

  const categoryFields = [
    { name: "nombre", label: "Nombre", type: "text", required: true },
    { name: "estado", label: "Estado", type: "select", required: true },
  ];

  const refreshData = async (data) =>  {
    try{
      const transformedCategories = data.category ? data.category.map(category => ({
        ...category,
        ESTADO: category.ESTADO === 1 ? "ACTIVO" : "INACTIVO",
      })) : [];
      setData(transformedCategories);
      setFilteredData(transformedCategories);
      setTotalPages(data.totalPages);
    } catch (err) {
      setError(err.message);
    }
  }

  const allCategories = async (field, order, flag) => {
    if(flag === true){
      setCurrentPage(1);
      const response = await getAllCategories(1, itemsPerPage, field, order);
      refreshData(response);
    } else {
      const response = await getAllCategories(currentPage, itemsPerPage, field, order);
      refreshData(response);
    }
  }

  const searchCategory = async (field, order, flag) => {
    if(flag === true){
      setCurrentPage(1);
      const response = await searchCategoryByName(1, itemsPerPage, searchTerm, field, order);
      refreshData(response);
    } else {
      const response = await searchCategoryByName(currentPage, itemsPerPage, searchTerm, field, order);
      refreshData(response);
    }
  }

  useEffect(() => {
    document.title = 'Categorias';
    if (!isAuthenticated) {
      navigate("/login");
    } else {
      if(!searchTerm.trim()) {
        allCategories(sortField, sortOrder, false);
      } else {
        searchCategory(sortField, sortOrder, false);
      }
    }
  }, [isAuthenticated, navigate, currentPage, itemsPerPage]);


  // Lógica para ordenar los datos
  const sortData = async (field) => {
    if (field === "actions") return;
  
    let newOrder = sortOrder;
    if (field !== sortField) {
      setSortField(field);
      newOrder = 'desc';
    } else {
      newOrder = sortOrder === 'asc' ? 'desc' : 'asc';
    }
    setSortOrder(newOrder);
    if(!searchTerm.trim()){
      allCategories(field, newOrder, false);
    } else {
      searchCategory(field, newOrder, false);
    }
    
  };

  const handlePageChange = (page) => setCurrentPage(page);

  // Funciones para gestionar acciones en la tabla
  const handleEditCategory = (category) => openModal("edit", category);

  const confirmDelete = (category) => {
    setModalData(category);
    setModalOpen(false);
    setConfirmationModalOpen(true);
  };

  const handleDeleteCategory = (category) => {
    confirmDelete(category);
  };

  const handleDelete = async (category) => {
    setAlert({ show: false, message: "", type: "" });
    try {
      await deleteCategory(category.DSC_NOMBRE);
      setAlert({ show: true, message: "Categoria eliminada exitosamente", type: "success" }); // Mostrar alerta de éxito
      if(!searchTerm.trim()){
        allCategories(sortField, sortOrder, false);
      } else {
        searchCategory(sortField, sortOrder, false);
      }

    } catch (error) {
      const errorMessage = error.response?.data?.message || "Error desconocido al eliminar la categoría.";
      setAlert({ show: true, message: errorMessage, type: "error" }); // Mostrar alerta de error
    }
    setConfirmationModalOpen(false);  // Cerrar modal de confirmación después de eliminar
  };

  const handleAddCategory = () => openModal("add");

  const openModal = (mode, category = null) => {
    setModalMode(mode);
    setModalData(category ? mapCategoryFields(category) : null);
    setModalOpen(true);
    setConfirmationModalOpen(false);
  };

  const mapCategoryFields = (category) => ({
    id: category.ID_CATEGORIA,
    nombre: category.DSC_NOMBRE,
    estado: category.ESTADO === "ACTIVO" ? 1 : 2,

  });

  const handleSubmit = async (categoryData) => {
    setAlert({ show: false, message: "", type: "" });
    let successMessageText = "";

    if (modalMode === "add") {
      const categoryPayload = {
        DSC_NOMBRE: categoryData.nombre,
        ESTADO: categoryData.estado,
      };

      try {
        await saveCategory(categoryPayload);
        successMessageText = "Categoría agregada exitosamente";
        setAlert({ show: true, message: successMessageText, type: "success" }); // Mostrar alerta de éxito
        if(!searchTerm.trim()){
          allCategories(sortField, sortOrder, true);
        } else {
          searchCategory(sortField, sortOrder, true);
        }


      } catch (error) {
        const errorMessage = error.response?.data?.message || "Error desconocido al agregar la categoría.";
        setAlert({ show: true, message: errorMessage, type: "error" }); // Mostrar alerta de error

      }
    }
    if (modalMode === "edit") {

      const categoryPayload = {
        ID_CATEGORIA: categoryData.id,
        DSC_NOMBRE: categoryData.nombre,
        ESTADO: categoryData.estado,
      };

      try {

        await updateCategory(categoryPayload);
        successMessageText = "Categoria actualizada exitosamente";
        setAlert({ show: true, message: successMessageText, type: "success" }); // Mostrar alerta de éxito

        if(!searchTerm.trim()){
          allCategories(sortField, sortOrder, false);
        } else {
          searchCategory(sortField, sortOrder, false);
        }

      } catch (error) {
        const errorMessage = error.response?.data?.message || "Error desconocido al agregar la categoría.";
        setAlert({ show: true, message: errorMessage, type: "error" }); // Mostrar alerta de error

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
          <h1>Categorías</h1>
          <p>Gestión de categorías del sistema</p>
        </div>
        <Button className="add-btn" onClick={handleAddCategory}>
          <Tag size={20} />
          Agregar Categoría
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
                allCategories(sortField, sortOrder, true);
              } else {
                setSearchTerm(e.target.value);
              }
            }}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                if (e.target.value.trim() === '') {
                  setSearchTerm("");
                  allCategories(sortField, sortOrder, true);
                } else {
                  setSearchTerm(e.target.value);
                  searchCategory(sortField, sortOrder, true);
                }
              }
            }}
            placeholder="Buscar categorías..."
          />
          <Button className="search-btn" onClick={async () => {
            if(!searchTerm.trim()){
              allCategories(sortField, sortOrder, true);
            } else {
              searchCategory(sortField, sortOrder, true);
            }
          }}>
            <Search size={20} />
            Buscar
          </Button>
        </div>


        {searchError && <div className="alert alert-warning">{searchError}</div>}  {/* Mostrar la alerta si hay un error */}

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
        actions={{ edit: handleEditCategory, delete: handleDeleteCategory }}
        onSort={sortData}
        sortField={sortField}
        sortOrder={sortOrder}
      />
      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />

      <ModalConfirmation
        isOpen={isConfirmationModalOpen}
        onClose={() => setConfirmationModalOpen(false)}
        onConfirm={() => handleDelete(modalData)}//() => handleDelete(modalData)
        entityName={modalData?.DSC_NOMBRE}
        action="eliminar"
        confirmButtonText="Eliminar"
        cancelButtonText="Cancelar"
        errorMessages={errorMessages}

      />

      <ModalComponent
        isOpen={isModalOpen}
        mode={modalMode}
        fields={categoryFields}
        data={modalData}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
        errorMessages={errorMessages}
        setErrorMessages={setErrorMessages}
        entityName="Categoría"
      />
    </PageLayout>
  );
}