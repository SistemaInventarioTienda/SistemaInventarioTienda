import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
import PageLayout from "../components/PageLayout";
import Table from "../components/ui/Table";
import Pagination from "../components/ui/Pagination";
import { getAllCategories, saveCategory } from "../api/category";
import { Button, Input, Select } from "../components/ui";
import ModalComponent from "../components/Modal";
import { Tag } from "lucide-react";
import "./css/Page.css";

export default function CategoryPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [isModalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("add");
  const [modalData, setModalData] = useState(null);
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [errorMessages, setErrorMessages] = useState([]);
  const [showAlert, setShowAlert] = useState(false);

  const columns = [
    { field: "DSC_NOMBRE", label: "Nombre" },
    { field: "ESTADO", label: "Estado" },
    { field: "actions", label: "Acciones" }
  ];

  const categoryFields = [
    { name: "DSC_NOMBRE", label: "Nombre", type: "text", required: true },
    { name: "estado", label: "Estado", type: "select", required: true },
  ];

  // Lógica para obtener categorías
  const fetchCategories = async () => {
    try {
      const response = await getAllCategories(currentPage, itemsPerPage);
      const transformedCategories = response.category.map(category => ({
        ...category,
      }));
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
    if (!isAuthenticated) {
      navigate("/login");
    } else {
      fetchCategories();
    }
  }, [isAuthenticated, navigate, currentPage, itemsPerPage]);

  // Lógica de búsqueda
  useEffect(() => {
    const filtered = searchTerm.trim()
      ? data.filter(category => category.DSC_NOMBRE.toLowerCase().includes(searchTerm.toLowerCase()))
      : data;
    setFilteredData(filtered);
  }, [searchTerm, data]);

  const handlePageChange = (page) => setCurrentPage(page);

  // Funciones para gestionar acciones en la tabla
  const handleViewCategory = (category) => openModal("view", category);
  const handleEditCategory = (category) => openModal("edit", category);
  const handleDeleteCategory = (category) => openModal("delete", category);

  const handleAddCategory = () => openModal("add");

  const openModal = (mode, category = null) => {
    setModalMode(mode);
    setModalData(category ? mapCategoryFields(category) : null);
    setModalOpen(true);
  };

  const mapCategoryFields = (category) => ({
    nombre: category.DSC_NOMBRE,
    estado: category.ESTADO === "ACTIVO" ? 1 : 2,
  });

  const handleSubmit = async (categoryData) => {
    if (modalMode === "add") {
      const categoryPayload = {
        DSC_NOMBRE: categoryData.DSC_NOMBRE,
        ESTADO: categoryData.estado,
      };

      try {
        console.log('data', categoryData);
        console.log('payload', categoryPayload);
        await saveCategory(categoryPayload);
        await fetchCategories();
        setModalOpen(false);
        setErrorMessages([]);
        console.log("Categoría agregada exitosamente");

      } catch (error) {
        const errorMessage = error.response?.data?.message || "Error desconocido al agregar la categoría.";
        setErrorMessages([errorMessage]);
        setShowAlert(true);
        setTimeout(() => setShowAlert(false), 5000);
      }
    }
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
      <div className="page-controls">
        <Input
          type="text"
          className="search-input"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Buscar categorías..."
        />
        <div className="items-per-page">
          <label htmlFor="itemsPerPage">Cantidad de registros a mostrar:</label>
          <Select
            value={itemsPerPage}
            onChange={(e) => setItemsPerPage(Number(e.target.value))}
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={15}>15</option>
          </Select>
        </div>
      </div>
      <Table columns={columns} data={filteredData} actions={{ view: handleViewCategory, edit: handleEditCategory, delete: handleDeleteCategory }} /> {/* Cambié las acciones */}
      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />

      <ModalComponent
        isOpen={isModalOpen}
        mode={modalMode}
        fields={categoryFields}
        data={modalData}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
        errorMessages={errorMessages}
        setErrorMessages={setErrorMessages}
      />
    </PageLayout>
  );
}