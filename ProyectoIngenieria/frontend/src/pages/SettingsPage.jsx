import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
import SettingsForm from "./pagesForms/SettingsForm";
import PageLayout from "../components/layout/PageLayout";
import handleApiCallSetting from "../utils/handleApiCallSetting";
// import handleApiCall from "../utils/handleApiCall";
import { settingConfig } from "../config/entities/settingConfig";

function SettingsPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [initialData, setInitialData] = useState(null);
  const [empresaID, setEmpresaID] = useState(null);

  useEffect(() => {
    document.title = "Perfil";
    if (!isAuthenticated) {
      navigate("/login");
    }
    const fetchInitialData = async () => {
      try {
        const { data } = await handleApiCallSetting(
          () => settingConfig.api.fetchAll(),"Datos cargados correctamente."
        );
    
        // Verifica que la respuesta tenga éxito y contenga datos
        if (Array.isArray(data) && data.length > 0) {
    
          const frontendData = settingConfig.transformData.toFrontend(data[0]);
    
          setInitialData(frontendData);
          setEmpresaID(data[0].ID_EMPRESA); // Debug
        } else {
          console.error("La respuesta del backend no contiene datos válidos.");
        }
      } catch (error) {
        console.error("Error al cargar los datos:", error);
      }
    };
    fetchInitialData();
  }, [isAuthenticated, navigate]);

  const {
    entityName,
    titlePage,
    entityMessage,
    fields,
    api,
    transformData,
    actions,
  }= settingConfig;



  const onSubmit = async (data) => {
    try {
      const updateData = {
        ...data,
        id: empresaID
      };
 
      const backendData = await settingConfig.transformData.toBackend(updateData);
 
      
      // const formDataObj = {};

      // for (const [key, value] of Object.entries(backendData)) {
      //   formDataObj[key] = value;
      // }
 

        //const settingId = parseInt(backendData.get("ID_EMPRESA"), 10);
        await handleApiCallSetting(
          () => api.update(backendData),
          "Configuracion Actualizada Correctamente."
        );
      return { success: true };
    } catch (error) {
      console.error("Error:", error);
            return { success: false };
    }
  };

  

 
  if (!initialData) {
    return <p>Cargando configuraciones...</p>
  }
  return (
    <PageLayout>
      <div className="page-header">
        <div>
          <h1>Perfil de Configuración</h1>
          <p>Información acerca del sistema</p>
        </div>
      </div>
      <div className="card-body-settings">
        <SettingsForm 
          initialData={initialData}
          fields= {fields}
          onSubmit={onSubmit}
        />
      </div>
    </PageLayout>
  );
}

export default SettingsPage;
