import React, { useEffect } from "react";
import { EntityPage } from "./EntityPage";
import { creditConfig } from "../config/entities/creditConfig.js";

import { usePermissions } from "../context/authPermissions";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
//import CreditPage from "./CreditPage";
import FloatingHelpButton from "../components/common/FloatingHelpButton";

export default function CreditSalePage() {
  const { permissions } = usePermissions();
  const navigate = useNavigate();

  useEffect(() => {
    if (permissions.home === undefined) return;

    if (!permissions.sales) {
      toast.error("No tienes permiso para acceder a credito de ventas");
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
    manageCreditsHandler: (creditData) => {
      navigate(`/credits`, {
        state: {
          creditInfo: creditData,
          fields: creditConfig.fields,
          entityName: creditConfig.entityName,

        }
      });
    }
  };


  return (
    <>
      {/* <CreditPage /> */}
      <EntityPage
        entityName={entityName}
        titlePage={titlePage}
        entityMessage={entityMessage}
        columns={columns}
        // fields={fields}
        entityKey={entityKey}
        fetchAll={api.fetchAll}
        transformData={transformData.toFrontend}
        transformConfig={transformConfig}
        actions={enhancedActions}
        searchByName={api.searchByName}
      />
      <FloatingHelpButton />
    </>
  );
}
