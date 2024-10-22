import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
import PageLayout from "../components/PageLayout";
import Table from "../components/ui/Table";
import Pagination from "../components/ui/Pagination";
import { getUsers, updateUser, registerUser, deleteUser, searchUser } from "../api/user";
import { Button, Input, Select, Alert } from "../components/ui";
import ModalComponent from "../components/Modal";
import ModalConfirmation from "../components/ui/ModalConfirmation";
import { UserPlus, Search, User } from "lucide-react";
import "./css/Page.css";

export default function UserPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [isModalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("add");
  const [modalData, setModalData] = useState(null);
  const [isConfirmationModalOpen, setConfirmationModalOpen] = useState(false);
  const [isUpdateConfirmationOpen, setUpdateConfirmationOpen] = useState(false);
  // const [successMessage, setSuccessMessage] = useState("");
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
  // eslint-disable-next-line
  // const [showAlert, setShowAlert] = useState(false);

  const [alert, setAlert] = useState({ show: false, message: "", type: "" }); // Estado para gestionar la alerta

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
  const fetchUsers = async () => {
    try {
      const response = await getUsers(currentPage, itemsPerPage);
      const transformedUsers = response.users.map(user => ({
        ...user,
        ESTADO: user.ESTADO === 1 ? "ACTIVO" : "INACTIVO",
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

  useEffect(() => {
    document.title = 'Usuarios';
    if (!isAuthenticated) {
      navigate("/login");
    } else {

      fetchUsers();
    }
  }, [isAuthenticated, navigate, currentPage, itemsPerPage]);

  // Lógica para ordenar los datos
  const [sortField, setSortField] = useState(null);
  const [sortOrder, setSortOrder] = useState('asc');

  const sortData = (field) => {
    if (field === "actions") {
      return;
    }

    const newSortOrder = sortField === field && sortOrder === 'asc' ? 'desc' : 'asc';
    setSortField(field);
    setSortOrder(newSortOrder);

    const sortedData = [...filteredData].sort((a, b) => {
      if (newSortOrder === 'asc') {
        return a[field] > b[field] ? 1 : -1;
      }
      return a[field] < b[field] ? 1 : -1;
    });

    setFilteredData(sortedData);
  };

  // Lógica de búsqueda
  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      await fetchUsers();
      setSearchError(null);
      return;
    }

    try {
      setLoading(true);
      setSearchError(null);

      const response = await searchUser(currentPage, itemsPerPage, searchTerm);
      console.log(response);

      if (!response.users || response.users.length === 0) {
        setSearchError("No se encontraron resultados para ese criterio.");
      } else {
        const transformedUsers = response.users.map(user => ({
          ...user,
          ESTADO: user.ESTADO === 1 ? "ACTIVO" : "INACTIVO",
        }));
        setFilteredData(transformedUsers);
        setTotalPages(1);
      }
    } catch (err) {
      setSearchError("No se encontraron resultados para ese criterio.");
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page) => setCurrentPage(page);

  // Funciones para gestionar acciones en la tabla
  const handleViewUser = (user) => openModal("view", user);
  const handleEditUser = (user) => openModal("edit", user);
  // eslint-disable-next-line

  //funcion para comfirmar eliminacion de usuario de la tabla
  const confirmDelete = (user) => {
    setModalData(user);
    setModalOpen(false);
    setConfirmationModalOpen(true);
  };

  const handleDeleteUser = (user) => {
    confirmDelete(user);
  };

  const handleDelete = async (user) => {
    try {
      await deleteUser(user.DSC_CEDULA);
      setAlert({ show: true, message: "Usuario Eliminado exitosamente", type: "success" }); // Mostrar alerta de éxito
      await fetchUsers();
      setConfirmationModalOpen(false);

    } catch (err) {
      const errorMessage = err.message?.data?.message || "Error desconocido al eliminar al usuario.";
      setAlert({ show: true, message: errorMessage, type: "error" }); // Mostrar alerta de error
    }
   // setConfirmationModalOpen(false); // Cerrar modal de confirmación después de eliminar
  };
  
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
    //estado: user.ESTADO === 1 ? "ACTIVO" : "INACTIVO",
    contrasena: '',
    confirmarContrasena: '',
  });

  const handleSubmit = async (userData) => {

    let successMessageText = "";

    if (modalMode === "add") {
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
        CONFIRMARCONTRASENIA: userData.confirmarContrasena,
      };

      try {
        // console.log('data', userData);
        // console.log('payload', userPayload);
        //funcion para guardar usuario 
        await registerUser(userPayload);
        successMessageText = "Usuario agregado exitosamente";
        setAlert({ show: true, message: successMessageText, type: "success" }); // Mostrar alerta de éxito
        await fetchUsers();

        // setModalOpen(false);
        // setErrorMessages([]);
        // console.log("Usuario agregado exitosamente");
      } catch (e) {
        const errorMessage = e.response?.data?.message || "Error desconocido al agregar el usuario.";
        // setErrorMessages([errorMessage]);
        // setShowAlert(true);
        // setTimeout(() => setShowAlert(false), 5000);
        setAlert({ show: true, message: errorMessage, type: "error" }); // Mostrar alerta de error
      }
    }
    if (modalMode === "edit") {
      // console.log("Updating user with data:", userData);

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

      // console.log("Updating user with  payload:", userPayload);
      try {
        await updateUser(userData.cedula, userPayload);
        successMessageText = "Usuario actualizado exitosamente";
        setAlert({ show: true, message: successMessageText, type: "success" }); // Mostrar alerta de éxito
        await fetchUsers();
        // setModalOpen(false);
      } catch (error) {
        const errorMessage = error.response?.data?.message || "Error desconocido al actualizar el usuario.";

        setAlert({ show: true, message: errorMessage, type: "error" }); // Mostrar alerta de error
        // setErrorMessages([errorMessage]);
        // setShowAlert(true);
        // setTimeout(() => setShowAlert(false), 5000);
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
          <h1>Usuarios</h1>
          <p>Gestión de usuarios del sistema</p>
        </div>
        <Button className="add-btn" onClick={handleAddUser}>
          <User size={20} />
          Agregar Usuario
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
                fetchUsers();
                setSearchError(null);
              } else {
                setSearchError(null);
              }
            }}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleSearch();
              }
            }}
            placeholder="Buscar usuarios..."
          />
          <Button className="search-btn" onClick={handleSearch}>
            <Search size={20} />
            Buscar
          </Button>
        </div>

        <div className="items-per-page">
          <label htmlFor="itemsPerPage">Mostrar</label>
          <Select
            value={itemsPerPage}
            onChange={(e) => setItemsPerPage(Number(e.target.value))}
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
        actions={{ grantPermissions: handleGrantPermissionsUser, view: handleViewUser, edit: handleEditUser, delete: handleDeleteUser }}
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
        action= "eliminar"
        confirmButtonText="Eliminar"
        cancelButtonText="Cancelar"
        errorMessages={errorMessages}
        // successMessage={successMessage}
      />
      <ModalComponent
        isOpen={isModalOpen}
        mode={modalMode}
        fields={userFields}
        data={modalData}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
        errorMessages={errorMessages}
        setErrorMessages={setErrorMessages}
        entityName="Usuario"
      />

    </PageLayout>
  );
}
