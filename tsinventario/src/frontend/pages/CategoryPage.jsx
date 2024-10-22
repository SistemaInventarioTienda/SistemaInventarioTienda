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
   const [isUpdateConfirmationOpen, setUpdateConfirmationOpen] = useState(false); // Estado para confirmar la actualización
  
  // eslint-disable-next-line
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [errorMessages, setErrorMessages] = useState([]);
  // eslint-disable-next-line
  const [searchError, setSearchError] = useState(null);

  const [alert, setAlert] = useState({ show: false, message: "", type: "" }); // Estado para gestionar la alerta

  const columns = [
    { field: "DSC_NOMBRE", label: "Nombre" },
    { field: "ESTADO", label: "Estado" },
    { field: "actions", label: "Acciones" }
  ];

  const categoryFields = [
    { name: "nombre", label: "Nombre", type: "text", required: true },
    { name: "estado", label: "Estado", type: "select", required: true },
  ];

  // Lógica para obtener categorías
  const fetchCategories = async () => {
    try {
      const response = await getAllCategories(currentPage, itemsPerPage, sortField, sortOrder);
      const transformedCategories = response.category ? response.category.map(category => ({
        ...category,
        ESTADO: category.ESTADO === 1 ? "ACTIVO" : "INACTIVO",
      })) : [];
      setData(transformedCategories);
      setFilteredData(transformedCategories);
      setTotalPages(response.totalPages);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    document.title = 'Categorias';
    if (!isAuthenticated) {
      navigate("/login");
    } else {
      fetchCategories();
    }
  }, [isAuthenticated, navigate, currentPage, itemsPerPage]);

  // Lógica para ordenar los datos
  const [sortField, setSortField] = useState(null);
  const [sortOrder, setSortOrder] = useState('asc');

  // Lógica para ordenar los datos
  const sortData = async (field) => {
    if (field === "actions") {
      return;
    }

    setSortField(field);
    const newSortOrder = sortOrder === 'asc' ? 'desc' : 'asc';
    setSortOrder(newSortOrder);

    try {
      const response = await getAllCategories(currentPage, itemsPerPage, field, newSortOrder);
      const transformedCategories = response.category ? response.category.map(category => ({
        ...category,
        ESTADO: category.ESTADO === 1 ? "ACTIVO" : "INACTIVO",
      })) : [];
      setData(transformedCategories);
      setFilteredData(transformedCategories);
      setTotalPages(response.totalPages);
    } catch (err) {
      setError(err.message);
    }

    // setSortField(field);
    // let newSortOrder = 'asc';
    // if (sortField === field) {
    //   newSortOrder = sortOrder === 'asc' ? 'desc' : 'asc';
    // }
    // setSortOrder(newSortOrder);

    // const sortedData = [...filteredData].sort((a, b) => {
    //   if (newSortOrder === 'asc') {
    //     return a[field] > b[field] ? 1 : -1;
    //   }
    //   return a[field] < b[field] ? 1 : -1;
    // });

    // setFilteredData(sortedData);
  };

  // Lógica de búsqueda
  const handleSearch = async () => {
    if (!searchTerm.trim()) {

      await fetchCategories();
      setSearchError(null);
      return;
    }

    try {
      setLoading(true);
      setSearchError(null);
      await setCurrentPage(1);
      const response = await searchCategoryByName(1, itemsPerPage, searchTerm);
      console.log(response);

      if (!response.category || response.category.length === 0) {
        setAlert({ show: true, message: "No se encontraron resultados para esa categoria.", type: "error" });
      } else {
        const transformedCategories = response.category.map(category => ({
          ...category,
          ESTADO: category.ESTADO === 1 ? "ACTIVO" : "INACTIVO",
        }));
        setFilteredData(transformedCategories);
        setTotalPages(1);
      }

    } catch (err) {
      setSearchError("No se encontraron resultados para la categoria.");
    } finally {
      setLoading(false);
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
    try {
      await deleteCategory(category.DSC_NOMBRE);
      setAlert({ show: true, message: "Eliminado exitosamente", type: "success" }); // Mostrar alerta de éxito
      await fetchCategories();

    } catch (error) {
      const errorMessage = error.response?.data?.message || "Error desconocido al eliminar la categoría.";
      setAlert({ show: true, message: errorMessage, type: "error" }); // Mostrar alerta de error
    }
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
        await fetchCategories();
   

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
        
        await fetchCategories();
        
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
      {/* Mostramos la alerta dinámica */}
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
              setSearchTerm(e.target.value);
              if (e.target.value === '') {
                fetchCategories();
                setSearchError(null);//Limpiamos el mensaje de error si el input esta vacio.
              } else {
                setSearchError(null);// Limpiamos el error si el usuario vuelve a escribir
              }
            }}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleSearch(); // Realiza la busqueda al presionar Enter
              }
            }}
            placeholder="Buscar categorías..."
          />
          <Button className="search-btn" onClick={handleSearch}>
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
        onDelete={() => handleDelete(modalData)}
        entityName={modalData?.DSC_NOMBRE}
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