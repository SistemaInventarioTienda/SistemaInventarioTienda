import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '../context/authContext';
import { loginSchema } from '../schemas/auth';
import { Card, Button, Spinner, InputWithIcon } from "../components/common";
import { ShoppingBag, User, Lock, Eye, EyeOff } from 'lucide-react';
import './styles/LoginPage.css';
import { toast } from "sonner"; // Importa Sonner

export function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const { register, handleSubmit, formState: { errors }, setValue } = useForm({
    resolver: zodResolver(loginSchema),
  });
  const { signin, errors: loginErrors, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

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

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      await signin({ ...data, REMEMBERME: rememberMe });
      if (rememberMe) {
        localStorage.setItem('username', data.DSC_NOMBREUSUARIO);
        localStorage.setItem('password', data.DSC_CONTRASENIA);
        localStorage.setItem('rememberMe', 'true');
      } else {
        localStorage.removeItem('username');
        localStorage.removeItem('password');
        localStorage.setItem('rememberMe', 'false');
      }
      // Si el login es exitoso, redirigir al usuario
      navigate('/');
    } catch (error) {
      console.error('Error during login:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Mostrar errores de autenticación con Sonner
  useEffect(() => {
    if (loginErrors && loginErrors.length > 0) {
      console.log('Length', loginErrors.length);
      loginErrors.forEach((error) => {
        toast.error(error);
      });
      loginErrors.length = 0;
    }
  }, [loginErrors]);

  return (
    <div className="login-page-container">
      {isLoading && <Spinner text="Iniciando sesión" />}
      <Card className="login-card">
        <div className="card-login-body">
          <div className="text-center mb-4">
            <ShoppingBag size={48} className="mb-2 text-primary-custom" />
            <h2 className="fw-bold text-primary-custom">Inicio de Sesión</h2>
          </div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-4">
              <InputWithIcon
                id="usernameInput"
                icon={User}
                type="text"
                placeholder="Usuario"
                className={`input-field border-custom ${errors.DSC_NOMBREUSUARIO ? 'is-invalid' : ''}`}
                {...register('DSC_NOMBREUSUARIO')}
              />
              {errors.DSC_NOMBREUSUARIO && (
                <div className="invalid-feedback d-block">{errors.DSC_NOMBREUSUARIO.message}</div>
              )}
            </div>
            <div className="mb-4">
              <InputWithIcon
                id="passwordInput"
                icon={Lock}
                rightIcon={showPassword ? EyeOff : Eye}
                onRightIconClick={() => setShowPassword(!showPassword)}
                type={showPassword ? 'text' : 'password'}
                placeholder="Contraseña"
                className={`input-field border-custom ${errors.DSC_CONTRASENIA ? 'is-invalid' : ''}`}
                {...register('DSC_CONTRASENIA')}
              />
              {errors.DSC_CONTRASENIA && (
                <div className="invalid-feedback d-block">{errors.DSC_CONTRASENIA.message}</div>
              )}
            </div>
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
              disabled={isLoading}
            >
              {isLoading ? 'Iniciando Sesión...' : 'Iniciar Sesión'}
            </Button>
          </form>
        </div>
      </Card>
    </div>
  );
}

export default LoginPage;