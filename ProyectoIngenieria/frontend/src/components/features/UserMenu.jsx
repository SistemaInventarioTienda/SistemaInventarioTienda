import React, { useState } from 'react';
import { useAuth } from '../../context/authContext';
import { User, Settings, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ModalConfirmation } from "../modals";
import './styles/userMenu.css';

const UserMenu = ({ isOpen }) => {
    const [confirmationModalOpen, setConfirmationModalOpen] = useState(false);
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const goToUserProfile = () => {
        navigate('/profile');
    };

    const handleLogout = () => {
        setConfirmationModalOpen(true);
    };

    const handleConfirmLogout = async () => {
        await logout();
        setConfirmationModalOpen(false);
        navigate('/login');
    };

    return (
        <>
            <div className={`user-menu ${isOpen ? 'open' : ''}`}>
                <div className="dropdown-menu">
                    <div className="user-info">
                        <strong>{user?.name}</strong>
                        <div>{user?.email}</div>
                    </div>
                    <span className="dropdown-item" onClick={goToUserProfile}>
                        <User size={16} className="icon" /> Perfil
                    </span>
                    <span className="dropdown-item" onClick={() => {/* futuro */ }}>
                        <Settings size={16} className="icon" /> Configuración
                    </span>
                    <button onClick={handleLogout} className="dropdown-item">
                        <LogOut size={16} className="icon" /> Cerrar sesión
                    </button>
                </div>
            </div>

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