// React imports
import React, { useState, useEffect } from 'react';
// Routing
import { useNavigate } from 'react-router-dom';
// Form validation
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
// Context
import { useAuth } from '../context/authContext';
// Schemas
import { loginSchema } from '../schemas/auth';
// Common components
import { Card, Button, Input, Alert } from "../components/common";
// Icons
import { ShoppingBag, User, Lock, Eye, EyeOff } from 'lucide-react';
// Styles
import './styles/LoginPage.css';

export function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const { register, handleSubmit, formState: { errors }, setValue } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const { signin, errors: loginErrors, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'Iniciar Sesión';
    if (isAuthenticated) {
      navigate('/');
    } else {
      const storedRememberMe = localStorage.getItem('rememberMe') === 'true';
      setRememberMe(storedRememberMe);

      if (storedRememberMe) {
        const storedUsername = localStorage.getItem('username');
        const storedPassword = localStorage.getItem('password');

        if (storedUsername) {
          setValue('DSC_NOMBREUSUARIO', storedUsername);
        }
        if (storedPassword) {
          setValue('DSC_CONTRASENIA', storedPassword);
        }
      }
    }
  }, [isAuthenticated, navigate, setValue]);

  const onSubmit = (data) => {
    signin({ ...data, REMEMBERME: rememberMe });
    console.log(rememberMe);

    if (rememberMe) {
      localStorage.setItem('username', data.DSC_NOMBREUSUARIO);
      localStorage.setItem('password', data.DSC_CONTRASENIA);
      localStorage.setItem('rememberMe', 'true');
    } else {
      localStorage.removeItem('username');
      localStorage.removeItem('password');
      localStorage.setItem('rememberMe', 'false');
    }
  };

  return (
    <div className="h-[calc(200vh-200px)] flex items-center justify-center bg-secondary-custom border-custom">
      <Card className="login-card shadow-lg">
        <div className="card-body p-5">
          <div className="text-center mb-4">
            <ShoppingBag size={48} className="mb-2 text-primary-custom" />
            <h2 className="fw-bold text-primary-custom">Inicio de Sesión</h2>
          </div>
          <form onSubmit={handleSubmit(onSubmit)}>

            <div className="mb-3">
              <div className="input-group">
                <span className="input-group-text bg-primary-custom text-secondary-custom">
                  <User size={18} />
                </span>
                <Input
                  id="usernameInput"
                  type="text"
                  style={{
                    backgroundColor: "#F5F7FA",
                    borderColor: "#05004E",
                    boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
                    fontSize: "16px",
                    fontWeight: "500",
                    fontFamily: "Poppins, sans-serif",
                    color: "#05004E",
                  }}
                  className={`form-control border-custom ${errors.DSC_NOMBREUSUARIO ? 'is-invalid' : ''}`}
                  placeholder="Usuario"
                  {...register('DSC_NOMBREUSUARIO')}
                />
              </div>
              {errors.DSC_NOMBREUSUARIO && (
                <div className="invalid-feedback d-block">{errors.DSC_NOMBREUSUARIO.message}</div>
              )}
            </div>

            <div className="mb-4">
              <div className="input-group">
                <span className="input-group-text bg-primary-custom text-secondary-custom">
                  <Lock size={18} />
                </span>
                <Input
                  id="passwordInput"
                  type={showPassword ? 'text' : 'password'}
                  style={{
                    backgroundColor: "#F5F7FA",
                    borderColor: "#05004E",
                    boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
                    fontSize: "16px",
                    fontWeight: "500",
                    fontFamily: "Poppins, sans-serif",
                    color: "#05004E",
                  }}
                  className={`form-control border-custom ${errors.DSC_CONTRASENIA ? 'is-invalid' : ''}`}
                  placeholder="Contraseña"
                  {...register('DSC_CONTRASENIA')}
                />
                <Button
                  id="paswordField"
                  type="button"
                  className="btn"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </Button>
              </div>
              {errors.DSC_CONTRASENIA && (
                <div className="invalid-feedback d-block">{errors.DSC_CONTRASENIA.message}</div>
              )}
            </div>

            {loginErrors && loginErrors.map((error, i) => (
              <Alert
                key={i}
                type="error"
                message={error}
                duration={5000}
                onClose={() => console.log(`Error ${i} cerrado`)}
              />
            ))}
            <hr />
            <div className="mb-3 form-check">
              <input
                type="checkbox"
                className="form-check-input"
                id="rememberMe"
                checked={rememberMe}
                onChange={() => setRememberMe(!rememberMe)}
              />
              <label className="form-check-label" htmlFor="rememberMe">
                Recordar usuario y contraseña
              </label>
            </div>
            <Button
              type="submit"
              className="btn btn-primary w-100 border-custom"
            >
              Iniciar Sesión
            </Button>
          </form>
        </div>
      </Card>
    </div>
  );
}

export default LoginPage;
