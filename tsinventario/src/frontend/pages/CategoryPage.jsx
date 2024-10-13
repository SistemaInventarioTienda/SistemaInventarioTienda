import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
import PageLayout from "../components/PageLayout";

function CategoryPage() {
  const navigate = useNavigate();
  const { isAuthenticated} = useAuth();

  useEffect(() => {
    document.title = "Inicio";
    if (!isAuthenticated) {
      navigate("/category");
    }
  }, [isAuthenticated]);

  return (
    <PageLayout
      title="Categorias"
      description="Lista de categorias del sistema"
    >
    </PageLayout>
  );
}

export default CategoryPage;
