import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { default as useSaleForm } from '../hooks/useSaleForm';
import PageLayout from "../components/layout/PageLayout";
import { SalesDetailsCard, SalesSummaryCard } from "../components/features/sales";
import { toast } from "sonner";
import { usePermissions } from "../context/authPermissions";
import FloatingHelpButton from "../components/common/FloatingHelpButton";
import { useLocation } from "react-router-dom";
import "./styles/AddSalePage.css"

const AddSalePage = () => {
    const saleForm = useSaleForm();
    const { permissions } = usePermissions();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (permissions.home === undefined) return;

        if (!permissions.sales) {
            toast.error("No tienes permiso para acceder a ventas");
            navigate("/");
        }
    }, [permissions, navigate]);

    useEffect(() => {
        if (location.state?.proforma) {
            const { proforma } = location.state;

            // Cliente
            if (proforma.ID_CLIENTE) {
                saleForm.setSelectedClient(proforma.ID_CLIENTE);
            }

            // Nota
            if (proforma.DSC_PROFORMA) {
                saleForm.setNote(proforma.DSC_PROFORMA);
            }

            // Productos
            if (proforma.PRODUCTS_LISTS?.length > 0) {
                proforma.PRODUCTS_LISTS.forEach((prod) => {
                    saleForm.addProduct({
                        id: prod.ID,
                        name: prod.DSC_NOMBRE,
                        price: prod.PRECIO_UNITARIO,
                        quantity: prod.CANTIDAD || 1,
                        subtotal: prod.PRECIO_UNITARIO * (prod.CANTIDAD || 1),
                        tax: prod.IMPUESTO,
                        discount: prod.DESCUENTO
                    });
                });
            }

        }
    }, [location.state]);

    return (
        <>
            <PageLayout>
                <div className="page-header">
                    <div>
                        <h1>Nueva Venta</h1>
                        <p>Seleccione o digite los datos correspondientes para realizar una nueva venta</p>
                    </div>
                </div>
                <div className="sales-grid">
                    <SalesDetailsCard saleForm={saleForm} />
                    <SalesSummaryCard saleForm={saleForm} />
                </div>
            </PageLayout>
            <FloatingHelpButton />
        </>
    );
};

export default AddSalePage;