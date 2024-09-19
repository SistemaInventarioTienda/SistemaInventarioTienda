import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import Notification from './Notification';
import './Login.css';

const Login = () => {
    const [usuario, setUsuario] = useState('');
    const [clave, setClave] = useState('');
    const [notification, setNotification] = useState({ message: '', error: false });
    const navigate = useNavigate();
    const { login, isAuthenticated } = useAuth(); 

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/home');
        }
    }, [isAuthenticated, navigate]);
    
    const handleSubmit = (event) => {
        event.preventDefault();

        if (usuario && clave) {
            sessionStorage.setItem('usuario', usuario);
            login(); // Establecer el estado de autenticación
            navigate('/home'); // Redirigir al home
        } else {
            setNotification({ message: 'Por favor, complete todos los campos.', error: true });
        }
    };

    const closeNotification = () => {
        setNotification({ message: '', error: false });
    };

    return (
        <div className="login-box">
            {notification.message && 
                <Notification 
                    message={notification.message} 
                    error={notification.error} 
                    onClose={closeNotification} 
                />
            }
            <div className="card card-outline">
                <div className="card-header text-center">
                    <a href="#" className="h1"><b>Iniciar</b> Sesión</a>
                    <img className="img-thumbnail" src="/Assets/image/logo.png" width="150" alt="Logo" />
                </div>
                <div className="card-body">
                    <form onSubmit={handleSubmit}>
                        <div className="input-group mb-3">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Usuario"
                                value={usuario}
                                onChange={(e) => setUsuario(e.target.value)}
                            />
                        </div>
                        <div className="input-group mb-3">
                            <input
                                type="password"
                                className="form-control"
                                placeholder="Contraseña"
                                value={clave}
                                onChange={(e) => setClave(e.target.value)}
                            />
                        </div>
                        <button type="submit" className="btn btn-primary btn-block">Iniciar sesión</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;
