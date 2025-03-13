import { useEffect, useState } from "react";
import { Select, Button, Textarea } from "../../common";
import { useEntityPage } from "../../../hooks/useEntityPage";
import { getClients } from "../../../api/client";


const SalesSummaryCard = ({ saleForm }) => {

    const total = saleForm.calculateTotal();

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

    const clientOptions = clients.map((client) => ({
        value: client.DSC_CEDULA,
        label: client.DSC_NOMBRE,
    }));

    return (
        <div className="sales-card sales-card-fixed">
            <div className="sales-card-header">
                <h2 className="sales-card-title">Resumen de Venta</h2>
            </div>
            <div className="sales-card-content">

                <label className="sales-card-label">
                    Cliente de la compra
                </label>
                <Select
                    name="client"
                    options={clientOptions}
                    value={saleForm.selectedClient}
                    onChange={(e) => saleForm.setSelectedClient(e.target.value)}
                />

                <label className="sales-card-label">Método de pago</label>
                <Select
                    options={[
                        { value: "", label: "Seleccione una opción válida" },
                        { value: "sinpe", label: "Sinpe Movil" },
                        { value: "efectivo", label: "Pago en efectivo" },
                    ]}
                    label="Seleccionar Método de Pago"
                    value={saleForm.selectedPaymentMethod}
                    onChange={(e) => saleForm.setSelectedPaymentMethod(e.target.value)}
                    name="paymentMethod"
                />

                <label className="sales-card-label">
                    Nota o comentario
                </label>
                <Textarea
                    onChange={(e) => saleForm.setNote(e.target.value)}
                    style={{ height: '100px', marginBottom: '1rem' }}
                    className="sales-textarea"
                    placeholder="Agregar una nota o comentario"
                />

                <p className="sales-total">Total: ₡ {total}</p>

                <Button
                    onClick={saleForm.handleSubmit}
                    className="add-btn"
                    style={{ marginTop: '1rem', marginBottom: '1rem', width: '100%', borderRadius: '16px' }}
                >
                    Finalizar Compra
                </Button>
            </div>
        </div>
    );
};


export default SalesSummaryCard;