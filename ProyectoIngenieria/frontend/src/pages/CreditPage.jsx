import PageLayout from "../components/layout/PageLayout";
import { useLocation } from "react-router-dom";
import { ClientInfoCard, CreditDetailsCard, PaymentHistoryTable } from "../components/common/clients/";
import "./styles/CreditsPage.css"


const CreditPage = () => {

    const location = useLocation();
    const { creditInfo } = location.state || {}; // Obtenemos el estado pasado

    console.log("Datos recibidos a [CREDITPAGE]:", creditInfo);

    const credit = {
        id: creditInfo.ID_CREDITO,
        issueDate: "2023-07-10",
        dueDate: creditInfo.FEC_VENCIMIENTO,
        amount: 100000,
        pendingAmount: creditInfo.MON_PENDIENTE,
        status: creditInfo.ESTADO_CREDITO,
        //description: "Crédito para compra de mercadería",
    }

    //Suma los valores de MON_ABONADO y los retorna al valor paid del objeto client.
    const paid = creditInfo?.payments?.reduce((total, payment) => {
        return total + (payment.MON_ABONADO || 0);
    }, 0) || 0;

    const client = {
        name: creditInfo.DSC_NOMBRE,
        id: "119160537",
        phone: "60900809",
        paid: paid,
        pending: creditInfo.MON_PENDIENTE,
    }

    const payments = [{ date: "2023-07-25", amount: 30000, type: "PARCIAL" }]

    return (
        <PageLayout>
            <div className="credits-grid">
                <div>
                    <CreditDetailsCard credit={credit} />
                </div>
                <div>
                    <ClientInfoCard client={client} credit={credit} />
                </div>
                <div style={{ gridColumn: '1 / -1' }}>
                    <PaymentHistoryTable payments={payments} />
                </div>
            </div>
        </PageLayout>
    )
}

export default CreditPage

