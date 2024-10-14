import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
import PageLayout from "../components/PageLayout";
import Table from "../components/ui/Table";
import Pagination from "../components/ui/Pagination";
import { getUsers } from "../api/user";
import { Button, Input, Select } from "../components/ui";
import { UserPlus } from "lucide-react";
import "./css/UserPage.css";

export default function UserPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [itemsPerPage, setItemsPerPage] = useState(5);

  useEffect(() => {
    document.title = "Usuarios";
    if (!isAuthenticated) {
      navigate("/login");
    } else {
      const fetchUsers = async () => {
        try {
          const response = await getUsers(currentPage, itemsPerPage);
          // Mapeamos los usuarios para transformar el estado
          const transformedUsers = response.users.map(user => ({
            ...user,
            ESTADO: user.ESTADO === 1 ? "ACTIVO" : "INACTIVO", // Cambia 1 y 0 a texto
          }));
          setData(transformedUsers);
          setFilteredData(transformedUsers);
          setTotalPages(response.totalPages);
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };
      fetchUsers();
    }
  }, [isAuthenticated, navigate, currentPage, itemsPerPage]);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredData(data);
    } else {
      const filtered = data.filter((user) =>
        user.DSC_NOMBRE.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.DSC_CEDULA.includes(searchTerm)
      );
      setFilteredData(filtered);
    }
  }, [searchTerm, data]);

  const columns = [
    { field: "DSC_CEDULA", label: "Cédula" },
    { field: "DSC_NOMBRE", label: "Nombre" },
    { field: "DSC_APELLIDOUNO", label: "Primer Apellido" },
    { field: "DSC_APELLIDODOS", label: "Segundo Apellido" },
    { field: "DSC_NOMBREUSUARIO", label: "Usuario" },
    { field: "ESTADO", label: "Estado" },
    { field: "actions", label: "Acciones" },
  ];

  const handleView = (user) => {
    console.log("View user:", user);
  };

  const handleEdit = (user) => {
    console.log("Edit user:", user);
  };

  const handleDelete = (user) => {
    console.log("Delete user:", user);
  };

  const handleGrantPermissions = (user) => {
    console.log("Grant permissions to user:", user);
  };

  const actions = {
    view: handleView,
    edit: handleEdit,
    delete: handleDelete,
    grantPermissions: handleGrantPermissions,
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <PageLayout>
      <div className="user-page-header">
        <div>
          <h1>Usuarios</h1>
          <p>Gestión de usuarios del sistema</p>
        </div>
        <Button className="add-user-btn" onClick={() => navigate("/agregar-usuario")}>
          <UserPlus size={20} />
          Agregar Usuarios
        </Button>
      </div>
      <div className="user-page-controls">
        <Input
          type="text"
          className="search-input"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Buscar usuarios..."
        />
        <div className="items-per-page">
          <label htmlFor="itemsPerPage">Cantidad de registros a mostrar:</label>
          <Select
            id="itemsPerPage"
            value={itemsPerPage}
            onChange={(e) => setItemsPerPage(Number(e.target.value))}
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={15}>15</option>
            <option value={20}>20</option>
          </Select>
        </div>
      </div>
      <Table columns={columns} data={filteredData} actions={actions} />
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </PageLayout>
  );
}