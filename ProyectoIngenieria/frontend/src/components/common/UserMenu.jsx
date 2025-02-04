import React from 'react';
import { useAuth } from '../../context/authContext';
import { User, Settings, LogOut } from 'lucide-react';
import '../common/styles/UserMenu.css';

const UserMenu = ({ isOpen }) => {
    const { user, logout } = useAuth();

    return (
        <div className={`user-menu ${isOpen ? 'open' : ''}`}>
            <div className="dropdown-menu">
                <div className="user-info">
                    <strong>{user?.name}</strong>
                    <div>{user?.email}</div>
                </div>
                <hr />
                {/* Enlace al perfil del usuario */}
                <span className="dropdown-item" onClick={() => {/* futuro */ }}>
                    <User size={16} className="usermenu-icon" /> Perfil
                </span>
                {/* Enlace a la configuración */}
                <span className="dropdown-item" onClick={logout}>
                    <Settings size={16} className="usermenu-icon" /> Configuración
                </span>
                <hr />
                <button onClick={logout} className="dropdown-item">
                    <LogOut size={16} className="usermenu-icon" /> Cerrar sesión
                </button>
            </div>
        </div>
    );
};

export default UserMenu;
