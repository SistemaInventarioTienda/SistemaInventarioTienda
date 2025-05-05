import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { default as useSaleForm } from '../hooks/useSaleForm';
import PageLayout from "../components/layout/PageLayout";
import { SalesDetailsCard, SalesSummaryCard } from "../components/features/sales";
import { toast } from "sonner";
import { usePermissions } from "../context/authPermissions";
import "./styles/AddSalePage.css"

const AddSalePage = () => {
    const saleForm = useSaleForm();
    const { permissions } = usePermissions();
    const navigate = useNavigate();

    useEffect(() => {
        if (permissions.home === undefined) return;

        if (!permissions.sales) {
            toast.error("No tienes permiso para acceder a ventas");
            navigate("/");
        }
    }, [permissions, navigate]);

    return (
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
    );
};

export default AddSalePage;