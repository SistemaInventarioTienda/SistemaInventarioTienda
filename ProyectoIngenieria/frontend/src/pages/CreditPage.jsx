import { useEffect, useState } from "react";
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
    const location = useLocation();
    const { /*creditInfo,*/ fields, entityName } = location.state || {}; // Obtenemos el estado pasado

    //constantes para manejar los estados del modal.
    const [isModalOpen, setModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState("add");
    const [modalData, setModalData] = useState(null);
    //const [isConfirmationModalOpen, setConfirmationModalOpen]= useState(false);
    const [creditInfo, setCreditInfo] = useState(location.state?.creditInfo || null);
    
    

    // Función para obtener los datos actualizados del crédito
    const fetchCreditData = async () => {
        try {
          const creditId = creditInfo?.ID_CREDITO;
          if (!creditId) return;
    
          // Llamar al endpoint para obtener los datos del crédito
          const response = await creditConfig.api.getCreditById(creditId);
 
          setCreditInfo(response); // Actualizar el estado con los datos nuevos
        } catch (error) {
          console.error("Error al obtener los datos del crédito:", error);
        }
      };
    
  
    const handleAdd = () => {
        // Abre el modal para agregar un nuevo pago
        setModalMode("add");
        setModalData({});
        setModalOpen(true);
 
    };

     //Logica para manejar el envio de datos al y desde el formulario.
    const formatDate = (isoDate) => {
        if (!isoDate) return ""; // Manejo de valores nulos o vacíos
        const date = new Date(isoDate);
        return date.toLocaleDateString("es-ES", { day: "numeric", month: "numeric", year: "numeric" });
      };


      const onSubmit = async (data) => {
        try {
 
    
          if (!data || typeof data !== "object") {
            throw new Error("Los datos recibidos en onSubmit son inválidos.");
          }
    
          if (!data.MON_ABONADO || !data.ID_CREDITO) {
            throw new Error("Faltan campos obligatorios (MON_ABONADO o ID_CREDITO).");
          }
    
          // Transformar los datos para el backend
          const backendData = await creditConfig.transformData.toBackend(data);
 
    
          // Enviar la solicitud al backend
          const idCredit = data.ID_CREDITO;
          await handleApiCall(
            () => creditConfig.api.create(idCredit, backendData),
            "Abono registrado exitosamente."
          );
    
          // Refrescar los datos del crédito
          await fetchCreditData();
    
          // Cerrar el modal
          setModalOpen(false);
    
          return { success: true };
        } catch (error) {
          console.error("Error desde CreditSalePage: ", error.message);
          return { success: false };
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

    let firsName = creditInfo.DSC_NOMBRE || "";
    let lastName1 = creditInfo?.sale?.Client.DSC_APELLIDOUNO || "";
    let lastName2 = creditInfo?.sale?.Client.DSC_APELLIDODOS || "";
    const fullName = `${firsName} ${lastName1} ${lastName2}`.trim();

    let phoneNumber = creditInfo.sale?.Client.TelefonoClientes[0].DSC_TELEFONO;

    const client = {
        name: fullName,
        id: "119160537",//Falta este campo
        phone:phoneNumber,//Falta este campo
        paid: paid,
        pending: creditInfo.MON_PENDIENTE,
    }



    const payments = creditInfo?.payments?.map(payment => ({
      id: payment.ID_ABONO, // ID del abono
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
                    <PaymentHistoryTable 
                    payments={payments}
                    creditConfig={creditConfig}
                    fetchCreditData={fetchCreditData}
                    pendingAmount= {creditInfo.MON_PENDIENTE}
                     />
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