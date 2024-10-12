import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";

function HomePage() {
  const navigate = useNavigate();
  const { isAuthenticated} = useAuth();

  useEffect(() => {
    document.title = "Inicio";
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated]);

  return (
  <section className="bg-red-500 flex justify-center items-center">
    <header className="bg-zinc-800 p-10">
      <h1 className="text-5xl py-2 font-bold">Inicio</h1>
      <p className="text-md text-slate-400">
        Esta es la pagina de inicio
      </p>
    </header>
  </section>
  );
}

export default HomePage;
