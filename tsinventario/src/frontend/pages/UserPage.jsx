import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
import PageLayout from "../components/PageLayout";

function UserPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    document.title = "Inicio";
    if (!isAuthenticated) {
      navigate("/user");
    }
  }, [isAuthenticated]);

  return (
    <PageLayout
      title="Usuarios"
      description="Esta es la página de usuarios"
    >
    </PageLayout>
  );
}

export default UserPage;
