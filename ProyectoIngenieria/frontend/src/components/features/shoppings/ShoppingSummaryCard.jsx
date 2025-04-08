import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { DatePicker, Select, Button, Textarea } from "../../common";
import { User } from "lucide-react";
import { useEntityPage } from "../../../hooks/useEntityPage";
import { getAllSuppliersWithoutPagination } from "../../../api/supplier";
import { ModalConfirmation } from "../../modals";

const ShoppingSummaryCard = ({ shoppingForm }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const { filteredData: suppliers, fetchData } = useEntityPage({
        fetchAll: getAllSuppliersWithoutPagination,
        entityKey: "suppliers",
        transformConfig: {
            IDENTIFICADOR_PROVEEDOR: (item) => item.IDENTIFICADOR_PROVEEDOR,
            DSC_NOMBRE: (item) => item.DSC_NOMBRE,
        },
    });

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        if (location.state?.shouldRefreshSuppliers) {
            fetchData();
            navigate(location.pathname, { state: {}, replace: true });
        }
    }, [location.state]);

    const supplierOptions = suppliers.map(supplier => ({
        value: supplier.IDENTIFICADOR_PROVEEDOR,
        label: supplier.DSC_NOMBRE,
    }));

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
                    onClick={() => {
                        sessionStorage.setItem('shoppingFormState', JSON.stringify({
                            selectedProducts: shoppingForm.selectedProducts,
                            selectedSupplier: shoppingForm.selectedSupplier,
                            selectedPaymentMethod: shoppingForm.selectedPaymentMethod,
                            productReceiptDate: shoppingForm.productReceiptDate,
                            note: shoppingForm.note,
                            total: shoppingForm.total
                        }));

                        navigate('/suppliers', {
                            state: {
                                openSupplierModal: true,
                                returnTo: {
                                    pathname: '/shopping/new',
                                    state: { fromSupplier: true }
                                },
                            }
                        });
                    }}
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

                <DatePicker
                    label="Fecha de recepción de productos"
                    value={shoppingForm.productReceiptDate}
                    onChange={(date) => shoppingForm.setProductReceiptDate(date)}
                    allowPastDates={true}
                    className="input"
                    placeholder="Seleccione fecha de recepción"
                    dateFormat="d/m/Y"
                    firstDayOfWeek={1}
                    required
                />

                <div className="shoppings-summary">
                    <div className="shoppings-summary-total">
                        <span>Subtotal:</span>
                        <span>₡{shoppingForm.total.toFixed(2)}</span>
                    </div>
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