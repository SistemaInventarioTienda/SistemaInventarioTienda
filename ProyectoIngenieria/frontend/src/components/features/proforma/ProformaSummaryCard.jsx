import { DatePicker, Button, Textarea } from "../../common";
import { ModalConfirmation } from "../../modals";

const ProformaSummaryCard = ({ proformaForm }) => {
    const { subtotal, discountAmount, subtotalAfterDiscount, taxAmount, total } =
        proformaForm.calculateTotal();

    return (
        <div className="sales-card sales-card-fixed">
            <div className="sales-card-header">
                <h2 className="sales-card-title">Resumen de Proforma</h2>
            </div>

            <div className="sales-card-content">
                <label className="sales-card-label">Fecha límite de la proforma</label>
                <DatePicker
                    value={proformaForm.limitDate}
                    onChange={(date) => proformaForm.setLimitDate(date)}
                    allowPastDates={false}
                    className="input"
                    placeholder="Selecciona una fecha"
                    dateFormat="d/m/Y"
                    firstDayOfWeek={1}
                />

                <label className="sales-card-label">Nota o comentario (Opcional)</label>
                <Textarea
                    onChange={(e) => proformaForm.setNote(e.target.value)}
                    value={proformaForm.note}
                    style={{ height: "100px" }}
                    className="sales-textarea"
                    placeholder="Agregar una nota o comentario"
                />

                <div className="sales-summary">
                    <div className="sales-summary-row">
                        <span>Subtotal:</span>
                        <span>₡{subtotal}</span>
                    </div>
                    <div className="sales-summary-row">
                        <span>Descuento:</span>
                        <span className="discount">-₡{discountAmount}</span>
                    </div>
                    <div className="sales-summary-row">
                        <span>Subtotal con descuento:</span>
                        <span>₡{subtotalAfterDiscount}</span>
                    </div>
                    <div className="sales-summary-row">
                        <span>Impuesto:</span>
                        <span>₡{taxAmount}</span>
                    </div>
                    <div className="sales-summary-total">
                        <span>Total:</span>
                        <span>₡{total}</span>
                    </div>
                </div>

                <Button
                    onClick={proformaForm.handleSubmit}
                    className="add-btn"
                    style={{
                        marginTop: "1rem",
                        marginBottom: "1rem",
                        width: "100%",
                        borderRadius: "16px",
                    }}
                >
                    Generar Proforma
                </Button>

                <ModalConfirmation
                    isOpen={proformaForm.isConfirmationModalOpen}
                    onClose={() => proformaForm.setConfirmationModalOpen(false)}
                    onConfirm={proformaForm.confirmationCallback}
                    entityName="proforma"
                    action="make_proforma"
                    customLabel="¿Estás seguro de generar la proforma sin agregar nota o comentario?"
                    confirmButtonText="Confirmar"
                    cancelButtonText="Cancelar"
                />
            </div>
        </div>
    );
};

export default ProformaSummaryCard;
