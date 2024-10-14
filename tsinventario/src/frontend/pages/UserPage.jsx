import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
import PageLayout from "../components/PageLayout";
import Table from "../components/ui/Table";
import Pagination from "../components/ui/Pagination";
import { getUsers, updateUser } from "../api/user";
import { Button, Input, Select } from "../components/ui";
import ModalComponent from "../components/Modal";
import { UserPlus } from "lucide-react";
import "./css/Page.css";

export default function UserPage() {
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
    { field: "DSC_CEDULA", label: "Cédula" },
    { field: "DSC_NOMBRE", label: "Nombre" },
    { field: "DSC_APELLIDOUNO", label: "Primer Apellido" },
    { field: "DSC_APELLIDODOS", label: "Segundo Apellido" },
    { field: "DSC_NOMBREUSUARIO", label: "Usuario" },
    { field: "ESTADO", label: "Estado" },
    { field: "actions", label: "Acciones" }
  ];

  const userFields = [
    { name: "cedula", label: "Cédula", type: "text", required: true },
    { name: "nombre", label: "Nombre", type: "text", required: true },
    { name: "primerApellido", label: "Primer Apellido", type: "text", required: true },
    { name: "segundoApellido", label: "Segundo Apellido", type: "text" },
    { name: "correo", label: "Correo", type: "email", required: true },
    { name: "telefono", label: "Teléfono", type: "text", required: true },
    { name: "nombreUsuario", label: "Nombre de Usuario", type: "text", required: true },
    { name: "estado", label: "Estado", type: "select", required: true },
    { name: "contrasena", label: "Contraseña", type: "password", required: true },
    { name: "confirmarContrasena", label: "Confirmar Contraseña", type: "password", required: true },
  ];

  // Lógica para obtener usuarios
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    } else {
      const fetchUsers = async () => {
        try {
          const response = await getUsers(currentPage, itemsPerPage);
          const transformedUsers = response.users.map(user => ({
            ...user,
          })) || [];
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

  // Lógica de búsqueda
  useEffect(() => {
    const filtered = searchTerm.trim()
      ? data.filter(user => user.DSC_NOMBRE.toLowerCase().includes(searchTerm.toLowerCase()) || user.DSC_CEDULA.includes(searchTerm))
      : data;
    setFilteredData(filtered);
  }, [searchTerm, data]);

  const handlePageChange = (page) => setCurrentPage(page);

  // Funciones para gestionar acciones en la tabla
  const handleViewUser = (user) => openModal("view", user);
  const handleEditUser = (user) => openModal("edit", user);
  // eslint-disable-next-line
  const handleDeleteUser = user => ("delete", user);
  // eslint-disable-next-line
  const handleGrantPermissionsUser = user => ("grantPermissions", user);

  const handleAddUser = () => openModal("add");

  const openModal = (mode, user = null) => {
    setModalMode(mode);
    setModalData(user ? mapUserFields(user) : null);
    setModalOpen(true);
  };

  const mapUserFields = (user) => ({
    cedula: user.DSC_CEDULA,
    nombre: user.DSC_NOMBRE,
    primerApellido: user.DSC_APELLIDOUNO,
    segundoApellido: user.DSC_APELLIDODOS,
    correo: user.DSC_CORREO,
    telefono: user.DSC_TELEFONO,
    nombreUsuario: user.DSC_NOMBREUSUARIO,
    estado: user.ESTADO === "ACTIVO" ? 1 : 2,
    contrasena: '',
    confirmarContrasena: '',
  });

  const handleSubmit = async (userData) => {
    if (modalMode === "edit") {
      console.log("Updating user with data:", userData);

      const userPayload = {
        DSC_CEDULA: userData.cedula,
        DSC_NOMBRE: userData.nombre,
        DSC_APELLIDOUNO: userData.primerApellido,
        DSC_APELLIDODOS: userData.segundoApellido,
        DSC_CORREO: userData.correo,
        DSC_TELEFONO: userData.telefono,
        DSC_NOMBREUSUARIO: userData.nombreUsuario,
        ESTADO: userData.estado,
        DSC_CONTRASENIA: userData.contrasena,
      };

      console.log("Updating user with  payload:", userPayload);
      
      if (!userPayload.DSC_CONTRASENIA) {
        userPayload.DSC_CONTRASENIA = 'adminadmin';
      }

      try {
        const updatedUser = await updateUser(userData.cedula, userPayload);
        const updatedData = data.map((user) =>
          user.DSC_CEDULA === userData.cedula ? { ...user, ...userPayload } : user
        );
        setData(updatedData);
        setFilteredData(updatedData);
        setModalOpen(false);
        setErrorMessages([]);
        console.log("User updated successfully:", updatedUser);
      } catch (error) {
        const errorMessage = error.response?.data?.message || "Error desconocido al actualizar el usuario.";
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
          <h1>Usuarios</h1>
          <p>Gestión de usuarios del sistema</p>
        </div>
        <Button className="add-btn" onClick={handleAddUser}>
          <UserPlus size={20} />
          Agregar Usuario
        </Button>
      </div>
      <div className="page-controls">
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
            value={itemsPerPage}
            onChange={(e) => setItemsPerPage(Number(e.target.value))}
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={15}>15</option>
          </Select>
        </div>
      </div>
      <Table columns={columns} data={filteredData} actions={{ grantPermissions: handleGrantPermissionsUser, view: handleViewUser, edit: handleEditUser, delete: handleDeleteUser }} />
      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />

      <ModalComponent
        isOpen={isModalOpen}
        mode={modalMode}
        fields={userFields}
        data={modalData}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
        errorMessages={errorMessages}
        setErrorMessages={setErrorMessages}
      />

    </PageLayout>
  );
}
