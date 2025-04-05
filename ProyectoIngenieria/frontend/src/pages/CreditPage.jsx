import PageLayout from "../components/layout/PageLayout";
import { useLocation } from "react-router-dom";

import { ClientInfoCard, CreditDetailsCard, PaymentHistoryTable } from "../components/common/clients/";
import "./styles/CreditsPage.css"


const CreditPage = () => {

    const location = useLocation();
    const { creditInfo, fields } = location.state || {}; // Obtenemos el estado pasado

    //console.log("Datos recibidos a [CREDITPAGE]:", creditInfo);
    console.log("Campos recibidos a [CREDITPAGE]:", fields);

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

    // const payments = [{ date: "2023-07-25", amount: 30000, type: "PARCIAL" }]

    const formatDate = (isoDate) => {
        if (!isoDate) return ""; // Manejo de valores nulos o vacíos
        const date = new Date(isoDate);
        return date.toLocaleDateString("es-ES", { day: "numeric", month: "numeric", year: "numeric" });
      };

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
        </PageLayout>
    )
}

export default CreditPage