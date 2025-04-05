import { User, CreditCard, Smartphone, CheckCircle, AlertTriangle } from "lucide-react";
import PaymentProgressBar from "./PaymentProgressBar";

const ClientInfoCard = ({ client, credit }) => {
    const totalAmount = credit.amount || 0;
    const paid = client.paid || 0;
    const pending = Math.max(totalAmount - paid, 0); // Calculamos lo pendiente

    return (
        <div className="credits-card credits-card-fixed">
            <div className="credits-card-header">
                <h2 className="credits-card-title">Información del Cliente</h2>
                <p className="credits-card-description">Detalles del cliente</p>
            </div>
            <div className="credits-card-content">
                <div className="credits-info-item">
                    <div className="credits-info-value">
                        <User className="credits-icon" />
                        {client.name}
                    </div>
                </div>
                <div className="credits-info-item">
                    <div className="credits-info-value">
                        <CreditCard className="credits-icon" />
                        Cédula: {client.id}
                    </div>
                </div>
                <div className="credits-info-item">
                    <div className="credits-info-value">
                        <Smartphone className="credits-icon" />
                        Teléfono: {client.phone}
                    </div>
                </div>

                <div style={{ marginTop: "1.5rem" }}>
                    <h3 className="credits-info-label">Estado del Pago</h3>
                    <PaymentProgressBar paid={paid} totalAmount={totalAmount} />
                    <div style={{ marginTop: "0.5rem" }}>
                        <div className="credits-info-value" style={{ color: "#22c55e" }}>
                            <CheckCircle className="credits-icon" />
                            Pagado: ₡{paid.toLocaleString()}
                        </div>
                        <div className="credits-info-value" style={{ color: "#eab308" }}>
                            <AlertTriangle className="credits-icon" />
                            Pendiente: ₡{pending.toLocaleString()}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ClientInfoCard;
