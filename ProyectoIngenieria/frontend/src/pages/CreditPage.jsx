import PageLayout from "../components/layout/PageLayout";
import { ClientInfoCard, CreditDetailsCard, PaymentHistoryTable } from "../components/common/clients/";
import "./styles/CreditsPage.css"


const CreditPage = () => {

    const credit = {
        id: 2,
        issueDate: "2023-07-10",
        dueDate: "2023-08-10",
        amount: 100000,
        pendingAmount: 70000,
        status: "PENDIENTE",
        description: "Crédito para compra de mercadería",
    }

    const client = {
        name: "Aaron Matarrita Portuguez",
        id: "119160537",
        phone: "60900809",
        paid: 30000,
        pending: 70000,
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

