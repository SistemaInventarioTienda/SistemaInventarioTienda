import React, { useEffect } from "react";
import { EntityPage } from "./EntityPage";
import { creditConfig } from "../config/entities/creditConfig.js";
import handleApiCall from "../utils/handleApiCall";
import { usePermissions } from "../context/authPermissions";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
//import CreditPage from "./CreditPage";

export default function CreditSalePage() {
  const { permissions } = usePermissions();
  const navigate = useNavigate();

  useEffect(() => {
    if (permissions.home === undefined) return;

    if (!permissions.home) {
      toast.error("No tienes permiso para acceder a usuarios");
      navigate("/");
    }
  }, [permissions, navigate]);

  const {
    entityName,
    titlePage,
    entityMessage,
    columns,
    fields,
    entityKey,
    api,
    transformData,
    transformConfig,
    actions
  } = creditConfig; // Falta crear el archivo creditConfig desde esta ruta: ../config/entities

  const enhancedActions = {
    ...actions,
    manageCreditsHandler : (creditData) => {
      navigate(`/credits`,{
        state: { creditInfo: creditData,
           fields: creditConfig.fields,
         }
      });
    }
  };

  //console.log("EntityName: ",entityName,"\ntitlePage", titlePage, "\nEntityMessage: ",entityMessage);
  //console.log("fetchAll: ",api.fetchAll);
  //Logica para manejar el envio de datos al y desde el formulario.
  // const onSubmit = async (mode , data) => {
  //   try {
        
  //   } catch (error) {
  //       console.log('Error desde CreditSalePage: ', error);
  //       return { success: false }
  //   }
  // };

  return (
    <>
      {/* <CreditPage /> */}
      <EntityPage
      entityName={entityName}
      titlePage = {titlePage}
      entityMessage= {entityMessage}
      columns= {columns}
      // fields={fields}
      entityKey={entityKey}
      fetchAll={api.fetchAll}
      transformData={transformData.toFrontend}
      transformConfig={transformConfig}
      actions={enhancedActions}
      searchByName= {api.searchByName}
      />
    </>
  );
}
