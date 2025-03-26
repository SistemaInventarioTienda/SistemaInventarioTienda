import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
import SettingsForm from "./pagesForms/SettingsForm";
import PageLayout from "../components/layout/PageLayout";

function SettingsPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    document.title = "Perfil";
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  return (
    <PageLayout>
      <div className="page-header">
        <div>
          <h1>Perfil de Configuración</h1>
          <p>Información acerca del sistema</p>
        </div>
      </div>
      <div className="card-body-settings">
        <SettingsForm/>
      </div>
    </PageLayout>
  );
}

export default SettingsPage;
