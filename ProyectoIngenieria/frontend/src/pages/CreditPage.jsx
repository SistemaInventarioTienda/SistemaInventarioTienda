import { useState } from "react";
import PageLayout from "../components/layout/PageLayout";
import { useLocation } from "react-router-dom";
import handleApiCall from "../utils/handleApiCall";
import { ModalComponent, ModalConfirmation } from "../components/modals";
//import Modal from "../components/modals/Modal"; // Asegúrate de importar el Modal
import { ClientInfoCard, CreditDetailsCard, PaymentHistoryTable } from "../components/common/clients/";
import PaymentForm from "../pages/pagesForms/PaymentForm";

import { creditConfig } from "../config/entities/creditConfig";

import "./styles/CreditsPage.css"


const CreditPage = () => {

    //constantes para manejar los estados del modal.
    const [isModalOpen, setModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState("add");
    const [modalData, setModalData] = useState(null);
    //const [isConfirmationModalOpen, setConfirmationModalOpen]= useState(false);

    const location = useLocation();
    const { creditInfo, fields, entityName } = location.state || {}; // Obtenemos el estado pasado

    const handleAdd = () => {
        // Abre el modal para agregar un nuevo pago
        setModalMode("add");
        setModalData({});
        setModalOpen(true);
        console.log("Presionando boton..");
    };

     //Logica para manejar el envio de datos al y desde el formulario.
      
    //console.log("Impresion de onSubmit: ", onSubmit);

    const formatDate = (isoDate) => {
        if (!isoDate) return ""; // Manejo de valores nulos o vacíos
        const date = new Date(isoDate);
        return date.toLocaleDateString("es-ES", { day: "numeric", month: "numeric", year: "numeric" });
      };

      const onSubmit = async (mode , data) => {
          try {
              const backendData = await creditConfig.transformData.toBackend(data);
              const formDataObj = {};
              for (const [key, value] of backendData.entries()) {
                formDataObj[key] = value;
              }
              console.log("Datos enviados al backend: ", formDataObj);
      
              if (mode === "add") {
                await handleApiCall(
                  () => creditConfig.api.create(backendData),
                  "Crédito agregado exitosamente."
                );
      
                return { success: true };
              }
          } catch (error) {
              console.log('Error desde CreditSalePage: ', error);
              return { success: false }
          }
        };

    const subTotal = creditInfo?.sale?.MONT_SUBTOTAL;
    const credit = {
        id: creditInfo.ID_CREDITO,
        issueDate: "2023-07-10",
        dueDate: creditInfo.FEC_VENCIMIENTO,
        amount: subTotal,
        pendingAmount: creditInfo.MON_PENDIENTE,
        status: creditInfo.ESTADO_CREDITO,
        //description: "Crédito para compra de mercadería",
    }

    //Suma los valores de MON_ABONADO y los retorna al valor paid del objeto client.
    const paid = creditInfo?.payments?.reduce((total, payment) => {
        return total + (payment.MON_ABONADO || 0);
    }, 0) || 0;

    const fullName = creditInfo.DSC_NOMBRE+" "+creditInfo?.sale?.Client.DSC_APELLIDOUNO+" "+creditInfo?.sale?.Client.DSC_APELLIDODOS;
    const client = {
        name: fullName,
        id: "119160537",//Falta este campo
        phone: "60900809",//Falta este campo
        paid: paid,
        pending: creditInfo.MON_PENDIENTE,
    }



    const payments = creditInfo?.payments?.map(payment => ({
        date: formatDate(payment.FEC_ABONO), // Formatear la fecha
        amount: payment.MON_ABONADO || 0,   // Monto abonado
        type: "PARCIAL"                      // Tipo fijo ("PARCIAL")
    })) || [];

    return (
        <PageLayout>
            <div className="credits-grid">
                <div>
                    <CreditDetailsCard 
                    credit={credit} 
                    onRegisterPayment={handleAdd} 
                    />
                    
                </div>
                <div>
                    <ClientInfoCard 
                    client={client} 
                    credit={credit} />
                </div>
                <div style={{ gridColumn: '1 / -1' }}>
                    <PaymentHistoryTable payments={payments} />
                </div>
                
            </div>
            
            <ModalComponent
            isOpen={isModalOpen}
            title={`Agregar Abono`} 
            onClose={() => setModalOpen(false)}
            entityName={entityName}
            mode={modalMode}
            >
                <PaymentForm
                fields={fields}
                initialData={creditInfo}
                onSubmit={onSubmit}
                onCancel={() => setModalOpen(false)}
            />
            </ModalComponent>
            
        </PageLayout>
    )
}

export default CreditPage