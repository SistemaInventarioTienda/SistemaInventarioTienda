import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useShoppingForm from '../hooks/useShoppingForm';
import PageLayout from "../components/layout/PageLayout";
import { ShoppingDetailsCard, ShoppingSummaryCard } from "../components/features/shoppings";
import { toast } from "sonner";
import { usePermissions } from "../context/authPermissions";
import "./styles/AddShoppingPage.css"


const AddShoppingPage = () => {
    const shoppingForm = useShoppingForm();
    const { permissions } = usePermissions();
    const navigate = useNavigate();

    useEffect(() => {
        if (permissions.home === undefined) return;

        if (!permissions.user) {
            toast.error("No tienes permiso para acceder a compras");
            navigate("/");
        }
    }, [permissions, navigate]);

    return (
        <PageLayout>
            <div className="page-header">
                <div>
                    <h1>Nueva Compra</h1>
                    <p>Seleccione o digite los datos correspondientes para realizar una nueva compra</p>
                </div>
            </div>
            <div className="sales-grid">
                <ShoppingDetailsCard shoppingForm={shoppingForm} />
                <ShoppingSummaryCard shoppingForm={shoppingForm} />
            </div>
        </PageLayout>
    );
};

export default AddShoppingPage;