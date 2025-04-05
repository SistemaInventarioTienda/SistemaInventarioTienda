import { Printer, Pencil, DollarSign, Calendar, Clock, Wallet, Coins } from "lucide-react";

const CreditDetailsCard = ({ credit, onRegisterPayment }) => {
    return (
        <div className="credits-card credits-card-fixed">
            <div className="credits-card-header">
                <h2 className="credits-card-title">Información del Crédito</h2>
                <p className="credits-card-description">Detalles del crédito otorgado</p>
            </div>
            <div className="credits-card-content">
                <div className="credits-grid-2">
                    <div className="credits-info-item">
                        <p className="credits-info-label">Número de Crédito</p>
                        <p className="credits-info-value">{credit.id}</p>
                    </div>
                    <div className="credits-info-item">
                        <p className="credits-info-label">Estado</p>
                        <p className="credits-info-value">
                            <span className="credits-badge credits-badge-yellow">{credit.status}</span>
                        </p>
                    </div>
                    <div className="credits-info-item">
                        <p className="credits-info-label">Fecha de Emisión</p>
                        <p className="credits-info-value">
                            <Calendar className="credits-icon" />
                            {credit.issueDate}
                        </p>
                    </div>
                    <div className="credits-info-item">
                        <p className="credits-info-label">Fecha de Vencimiento</p>
                        <p className="credits-info-value">
                            <Clock className="credits-icon" />
                            {credit.dueDate}
                        </p>
                    </div>
                    <div className="credits-info-item">
                        <p className="credits-info-label">Monto Original</p>
                        <p className="credits-info-value">
                            <Wallet className="credits-icon" />₡{credit.amount.toLocaleString()}
                        </p>
                    </div>
                    <div className="credits-info-item">
                        <p className="credits-info-label">Saldo Pendiente</p>
                        <p className="credits-info-value">
                            <Coins className="credits-icon" />₡{credit.pendingAmount.toLocaleString()}
                        </p>
                    </div>
                </div>

                {/* <div className="credits-info-item" style={{ marginTop: "1.5rem" }}>
                    <h3 className="credits-info-label">Descripción</h3>
                    <p className="credits-info-value">{credit.description}</p>
                </div> */}
            </div>
            <div className="credits-card-footer">
                {/* <button className="credits-button credits-button-outline">
                    <Printer className="credits-icon" /> Imprimir
                </button> */}
                <div>
                    <button className="credits-button credits-button-edit" style={{ marginRight: "0.5rem" }}>
                        <Pencil className="credits-icon" /> Editar
                    </button>
                    <button className="credits-button credits-button-primary" onClick={onRegisterPayment}>
                        <DollarSign className="credits-icon" /> Registrar Pago
                    </button>
                </div>
            </div>
        </div>
    )
}

export default CreditDetailsCard;
