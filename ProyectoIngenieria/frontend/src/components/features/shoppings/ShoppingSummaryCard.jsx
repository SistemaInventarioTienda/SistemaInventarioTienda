import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Select, Button, Textarea } from "../../common";
import { User } from "lucide-react";
import { useEntityPage } from "../../../hooks/useEntityPage";
import { getSuppliers } from "../../../api/supplier";
import { ModalConfirmation } from "../../modals";

const ShoppingSummaryCard = ({ shoppingForm }) => {
    const navigate = useNavigate();
    const { filteredData: suppliers, fetchData } = useEntityPage({
        fetchAll: getSuppliers,
        entityKey: "suppliers",
        transformConfig: {
            IDENTIFICADOR_PROVEEDOR: (item) => item.IDENTIFICADOR_PROVEEDOR,
            DSC_NOMBRE: (item) => item.DSC_NOMBRE,
        },
    });

    useEffect(() => {
        fetchData();
    }, []);


    const supplierOptions = [
        ...suppliers.map(supplier => ({
            value: supplier.IDENTIFICADOR_PROVEEDOR,
            label: supplier.DSC_NOMBRE,
        }))
    ];

    const { total } = shoppingForm.calculateTotal();

    return (
        <div className="shoppings-card shoppings-card-fixed">
            <div className="shoppings-card-header">
                <h2 className="shoppings-card-title">Resumen de Compra</h2>
            </div>
            <div className="shoppings-card-content">
                <label className="shoppings-card-label">
                    Proveedor de la compra
                </label>
                <Select
                    options={supplierOptions}
                    value={shoppingForm.selectedSupplier}
                    onChange={(e) => shoppingForm.setSelectedSupplier(e.target.value)}
                    name="supplier"
                />

                <Button
                    className="add-btn"
                    style={{ marginTop: '1rem', marginBottom: '1rem', width: '100%', borderRadius: '16px' }}
                    onClick={() => navigate('/suppliers', { state: { openSupplierModal: true } })}
                >
                    <User size={18} />
                    Nuevo Proveedor
                </Button>

                <label className="shoppings-card-label">
                    Método de pago
                </label>
                <Select
                    options={[
                        { value: "", label: "Seleccione método de pago" },
                        { value: "Transferencia", label: "Transferencia" },
                        { value: "Efectivo", label: "Efectivo" },
                    ]}
                    value={shoppingForm.selectedPaymentMethod}
                    onChange={(e) => shoppingForm.setSelectedPaymentMethod(e.target.value)}
                    name="paymentMethod"
                />

                <label className="shoppings-card-label">
                    Nota o comentario
                </label>
                <Textarea
                    value={shoppingForm.note}
                    onChange={(e) => shoppingForm.setNote(e.target.value)}
                    style={{ height: '100px', marginBottom: '1rem' }}
                    placeholder="Agregar una nota o comentario"
                />

                <div className="shoppings-summary-total">
                    <span>Total:</span>
                    <span>₡{total}</span>
                </div>

                <Button
                    onClick={shoppingForm.handleSubmit}
                    className="add-btn"
                    style={{ marginTop: '1rem', width: '100%' }}
                >
                    Finalizar Compra
                </Button>


                <ModalConfirmation
                    isOpen={shoppingForm.isConfirmationModalOpen}
                    onClose={() => shoppingForm.setConfirmationModalOpen(false)}
                    onConfirm={shoppingForm.confirmationCallback}
                    entityName="venta"
                    action="make_purchase"
                    customLabel="¿Estás seguro de realizar la venta sin agregar una nota?"
                    confirmButtonText="Confirmar"
                    cancelButtonText="Cancelar"
                />
            </div>
        </div>
    );
};

export default ShoppingSummaryCard;