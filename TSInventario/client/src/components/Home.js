import React, { useEffect } from 'react';
import { useAuth } from '../AuthContext';
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();
    const usuario = sessionStorage.getItem('usuario');
    const { isAuthenticated } = useAuth();

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login'); // Redirige al login si no está autenticado
        }
    }, [isAuthenticated, navigate]);

    const handleLogout = () => {
        logout(); // Cambia el estado de autenticación
        sessionStorage.removeItem('usuario'); // Opcional: limpiar datos del usuario
        navigate('/'); // Redirigir al login
    };

    return (
        <div>
            <h1>Página de Inicio</h1>
            <h1>Bienvenido, {usuario}!</h1>
            <button onClick={handleLogout}>Cerrar sesión</button>
        </div>
    );
};

export default Home;
