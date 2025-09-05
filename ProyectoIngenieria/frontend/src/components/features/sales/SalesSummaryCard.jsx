import { useEffect } from "react";
import { DatePicker, Select, Button, Textarea, Input } from "../../common";
import { ModalConfirmation } from "../../modals";
import { useEntityPage } from "../../../hooks/useEntityPage";
import { getClients } from "../../../api/client";
import { paymentMethods } from "../../../constants/paymentOptions";

const SalesSummaryCard = ({ saleForm }) => {
    const { subtotal, discountAmount, subtotalAfterDiscount, taxAmount, total } = saleForm.calculateTotal();

    const { filteredData: clients, fetchData } = useEntityPage({
        fetchAll: getClients,
        entityKey: "clients",
        transformConfig: {
            DSC_CEDULA: (item) => item.DSC_CEDULA,
            DSC_NOMBRE: (item) => item.DSC_NOMBRE,
        },
    });

    useEffect(() => {
        fetchData();
    }, []);

    const clientOptions = [
        { value: null, label: "Sin Definir" },
        ...clients.map(client => ({
            value: client.DSC_CEDULA,
            label: client.DSC_NOMBRE,
        }))
    ];

    return (
        <div className="sales-card sales-card-fixed">
            <div className="sales-card-header">
                <h2 className="sales-card-title">Resumen de Venta</h2>
            </div>
            <div className="sales-card-content">

                <label className="sales-card-label">Tipo de Venta</label>
                <Select
                    options={[
                        { value: 3, label: "Seleccione una opción válida" },
                        { value: 1, label: "Venta a crédito" },
                        { value: 0, label: "Venta a contado" },
                    ]}
                    label="Seleccionar Tipo de Venta"
                    value={saleForm.selectedSaleType}
                    onChange={(e) => saleForm.setSelectedSaleType(Number(e.target.value))}
                    name="saleType"
                />

                {saleForm.selectedSaleType === 1 && (
                    <DatePicker
                        label="Fecha de Vencimiento del Crédito"
                        value={saleForm.creditDueDate}
                        onChange={(date) => saleForm.setCreditDueDate(date)}
                        allowPastDates={false}
                        className="input"
                        placeholder="Selecciona una fecha"
                        dateFormat="d/m/Y"
                        firstDayOfWeek={1}
                    />
                )}

                <label className="sales-card-label">
                    Cliente de la compra (Opcional)
                </label>
                <Select
                    name="client"
                    options={clientOptions}
                    value={saleForm.selectedClient}
                    onChange={(e) => saleForm.setSelectedClient(e.target.value === "null" ? null : e.target.value)}
                />
                <label className="sales-card-label">
                    Correo del cliente(Opcional)
                </label>
                <Input
                    type="text"
                    value={saleForm.email}
                    placeholder="Correo para enviar la factura."
                    onChange={(e) => saleForm.setEmail(e.target.value)}
                />

                <label className="sales-card-label">Método de pago</label>
                <Select
                    options={paymentMethods}
                    label="Seleccionar Método de Pago"
                    value={saleForm.selectedPaymentMethod}
                    onChange={(e) => saleForm.setSelectedPaymentMethod(e.target.value)}
                    name="paymentMethod"
                />

                <label className="sales-card-label">
                    Nota o comentario (Opcional)
                </label>
                <Textarea
                    onChange={(e) => saleForm.setNote(e.target.value)}
                    style={{ height: '100px' }}
                    className="sales-textarea"
                    placeholder="Agregar una nota o comentario"
                />

                <div className="sales-summary">
                    <div className="sales-summary-row">
                        <span>Subtotal:</span>
                        <span>₡{subtotal}</span>
                    </div>
                    <div className="sales-summary-row">
                        <span>Total de descuentos aplicados:</span>
                        <span className="discount">-₡{discountAmount}</span>
                    </div>
                    <div className="sales-summary-row">
                        <span>Subtotal después de descuentos:</span>
                        <span>₡{subtotalAfterDiscount}</span>
                    </div>
                    <div className="sales-summary-row">
                        <span>Total de impuestos agregados:</span>
                        <span>₡{taxAmount}</span>
                    </div>
                    <div className="sales-summary-total">
                        <span>Total a pagar:</span>
                        <span>₡{total}</span>
                    </div>
                </div>


                <Button
                    onClick={saleForm.handleSubmit}
                    className="add-btn"
                    style={{ marginTop: '1rem', marginBottom: '1rem', width: '100%', borderRadius: '16px' }}
                >
                    Finalizar Compra
                </Button>

                <ModalConfirmation
                    isOpen={saleForm.isConfirmationModalOpen}
                    onClose={() => saleForm.setConfirmationModalOpen(false)}
                    onConfirm={saleForm.confirmationCallback}
                    entityName="venta"
                    action="make_sale"
                    customLabel="¿Estás seguro de realizar la venta sin seleccionar un cliente o agregar una nota?"
                    confirmButtonText="Confirmar"
                    cancelButtonText="Cancelar"
                />
            </div>
        </div >
    );
};

export default SalesSummaryCard;