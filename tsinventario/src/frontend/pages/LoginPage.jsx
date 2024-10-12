import { useAuth } from "../context/authContext";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card } from "../components/ui";
import { loginSchema } from "../schemas/auth";
import 'bootstrap-icons/font/bootstrap-icons.css';


export function LoginPage() {
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
    document.title = "Inicio Sesión";
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated]);
  
  return (
    <div className="h-[calc(100vh-100px)] flex items-center justify-center">
    <div className="hold-transition login-page">
      <div className="login-box" style={ {width: "400px"}}>
        <Card>
          <div className="card card-outline">
            <div className="card-header text-center bg-white">
              <h1><b>Iniciar</b> Sesión</h1>
              <img
                className="img-thumbnail"
                src="https://solucionsistemas.com/salesphp/Assets/img/logo.png"
                width="150"
                alt="Logo"
              />
            </div>
            <div className="card-body">
              <form id="frmLogin" onSubmit={handleSubmit(onSubmit)}>
              {loginErrors && (
                  <div className="mt-3">
                    {loginErrors.map((error, i) => (
                      <p className="text-danger" key={i}>{error}</p>
                    ))}
                  </div>
                )}
                <div className="input-group mb-3">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Usuario"
                    name="DSC_NOMBREUSUARIO"
                    id="usuario"
                    {...register("DSC_NOMBREUSUARIO")}
                  />
                  <div className="input-group-append">
                    <div className="input-group-text">
                      <i className="bi bi-person-fill"></i>
                    </div>
                  </div>
                  <p className="text-danger">{errors.DSC_NOMBREUSUARIO?.message}</p>
                </div>

                <div className="input-group mb-3">
                  <input
                    type="password"
                    className="form-control"
                    placeholder="Contraseña"
                    name="DSC_CONTRASENIA"
                    id="clave"
                    {...register("DSC_CONTRASENIA")}
                  />
                  <div className="input-group-append">
                    <div className="input-group-text">
                      <i className="bi bi-lock-fill"></i>
                    </div>
                  </div>
                  <p className="text-danger">{errors.DSC_CONTRASENIA?.message}</p>
                </div>
                <button
                  type="submit"
                  className="btn btn-primary btn-block"
                  id="btnAccion"
                >
                  Iniciar Sesión
                </button>
              </form>
            </div>
          </div>
        </Card>
      </div>
    </div>
    </div>
  );
}

export default LoginPage;

