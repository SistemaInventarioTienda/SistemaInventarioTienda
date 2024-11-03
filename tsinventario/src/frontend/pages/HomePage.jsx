import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
import PageLayout from "../components/PageLayout";
import InputFile from "../components/ui/InputFile";
function HomePage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    document.title = "Inicio";
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  return (
    <PageLayout
      title="Inicio"
      description="Esta es la página de inicio"
    >
      <InputFile></InputFile>
    </PageLayout>
  );
}

export default HomePage;