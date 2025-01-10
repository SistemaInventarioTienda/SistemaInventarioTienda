// React imports
import React, { useEffect } from "react";
// Routing
import { useNavigate } from "react-router-dom";
// Context
import { useAuth } from "../context/authContext";
// Layout components
import PageLayout from "../components/layout/PageLayout";

function HomePage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    document.title = "Inicio";
    if (isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  return (
    <PageLayout
      title="Inicio"
      description="Esta es la página de inicio"
    >
    </PageLayout>
  );
}

export default HomePage;