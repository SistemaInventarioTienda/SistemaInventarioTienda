import React, { useState } from "react";
import { useAuth } from "../../context/authContext";
import { User, Settings, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ModalConfirmation } from "../modals";
import { Tooltip } from "react-tooltip";
import "./styles/userMenu.css";

const UserMenu = ({ isOpen }) => {
  const [confirmationModalOpen, setConfirmationModalOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const goToUserProfile = () => {
    navigate("/profile");
  };
  const goToSettingProfile = () => {
    navigate("/settings");
  };

  const handleLogout = () => {
    setConfirmationModalOpen(true);
  };

  const handleConfirmLogout = async () => {
    await logout();
    setConfirmationModalOpen(false);
    navigate("/login");
  };

  return (
    <>
      <div className={`user-menu ${isOpen ? "open" : ""}`}>
        <div className="dropdown-menu">
          <div className="user-info">
            <strong>{user?.name}</strong>
            <div
              className="email"
              data-tooltip-id="email-tooltip"
              data-tooltip-content={user?.email}
            >
              {user?.email}
            </div>
          </div>
          <span className="dropdown-item" onClick={goToUserProfile}>
            <User size={16} className="icon" /> Perfil
          </span>
          <span className="dropdown-item" onClick={goToSettingProfile}>
            <Settings size={16} className="icon" /> Configuración
          </span>
          <button onClick={handleLogout} className="dropdown-item">
            <LogOut size={16} className="icon" /> Cerrar sesión
          </button>
        </div>
      </div>

      <Tooltip
        id="email-tooltip"
        place="top"
        style={{
          backgroundColor: "var(--color-card)",
          color: "var(--color-font)",
          border: "1px solid var(--color-border)",
          borderRadius: "4px",
          padding: "8px 12px",
          fontSize: "14px",
          zIndex: 1001,
        }}
      />

      <ModalConfirmation
        isOpen={confirmationModalOpen}
        onClose={() => setConfirmationModalOpen(false)}
        onConfirm={handleConfirmLogout}
        message={"¿Estas seguro que deseas cerrar sesión?"}
        action="logout"
        confirmButtonText="Cerrar Sesión"
        cancelButtonText="Cancelar"
      />
    </>
  );
};

export default UserMenu;
