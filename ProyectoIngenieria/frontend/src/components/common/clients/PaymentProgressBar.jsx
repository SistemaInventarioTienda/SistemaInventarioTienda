const PaymentProgressBar = ({ totalAmount = 0, paid = 0 }) => {
    // Aseguramos que los valores sean números y no negativos
    const validTotal = Math.max(totalAmount, 0);
    const validPaid = Math.max(paid, 0);

    // Evitar divisiones por 0
    const percentage = validTotal > 0 ? (validPaid / validTotal) * 100 : 0;

    return (
        <div>
            <div className="credits-progress">
                <div
                    className="credits-progress-bar"
                    style={{ width: `${percentage}%` }}
                ></div>
            </div>
        </div>
    );
};

export default PaymentProgressBar;
