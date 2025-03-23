import { Printer } from 'lucide-react';

const PaymentHistoryTable = ({ payments }) => {
    return (
        <div className="credits-card" style={{ marginTop: "1.5rem" }}>
            <div className="credits-card-header">
                <h2 className="credits-card-title">Historial de Pagos</h2>
                <p className="credits-card-description">Registro de pagos realizados para este crédito</p>
            </div>
            <div className="credits-content">
                <table className="credits-table">
                    <thead>
                        <tr>
                            <th>Fecha</th>
                            <th>Monto</th>
                        </tr>
                    </thead>
                    <tbody>
                        {payments.map((payment, index) => (
                            <tr key={index}>
                                <td>{payment.date}</td>
                                <td>₡{payment.amount.toLocaleString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default PaymentHistoryTable;