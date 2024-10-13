import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '../context/authContext';
import { loginSchema } from '../schemas/auth';
import { Card } from '../components/ui';
import { ShoppingBag, User, Lock, Eye, EyeOff } from 'lucide-react'; // Ojo y ojo tachado para el icono de mostrar/ocultar
import './css/LoginPage.css'; // Importa el archivo CSS específico para la página de login

export function LoginPage() {
  const [showPassword, setShowPassword] = useState(false); // Estado para controlar la visibilidad de la contraseña
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });
  const { signin, errors: loginErrors, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const onSubmit = (data) => signin(data);

  useEffect(() => {
    document.title = 'Iniciar Sesión';
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

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
                <input
                  type="text"
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
                <input
                  type={showPassword ? 'text' : 'password'} // Cambia el tipo de input entre password y text
                  className={`form-control border-custom ${errors.DSC_CONTRASENIA ? 'is-invalid' : ''}`}
                  placeholder="Contraseña"
                  {...register('DSC_CONTRASENIA')}
                />
                <button id="paswordField"
                  type="button"
                  className="btn"
                  onClick={() => setShowPassword(!showPassword)} // Alterna entre mostrar y ocultar
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />} {}
                </button>
              </div>
              {errors.DSC_CONTRASENIA && (
                <div className="invalid-feedback d-block">{errors.DSC_CONTRASENIA.message}</div>
              )}
            </div>

            {loginErrors && loginErrors.map((error, i) => (
              <div key={i} className="alert alert-custom">{error}</div>
            ))}

            <button
              type="submit"
              className="btn btn-primary w-100 border-custom"
            >
              Iniciar Sesión
            </button>

          </form>
        </div>
      </Card>
    </div>
  );
}

export default LoginPage;
