import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import useShoppingForm from '../hooks/useShoppingForm';
import PageLayout from "../components/layout/PageLayout";
import { ShoppingDetailsCard, ShoppingSummaryCard } from "../components/features/shoppings";
import { toast } from "sonner";
import { usePermissions } from "../context/authPermissions";
import "./styles/AddShoppingPage.css"

const AddShoppingPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [initialState, setInitialState] = useState(() => {
        const savedState = sessionStorage.getItem('shoppingFormState');
        return savedState ? JSON.parse(savedState) : null;
    });

    const shoppingForm = useShoppingForm(initialState);
    const { permissions } = usePermissions();

    useEffect(() => {
        const checkState = () => {
            if (location.state?.fromSupplier || location.state?.shouldRefreshSuppliers) {
                const savedState = sessionStorage.getItem('shoppingFormState');
                if (savedState) {
                    const parsedState = JSON.parse(savedState);
                    shoppingForm.initialize({
                        selectedProducts: parsedState.selectedProducts,
                        selectedSupplier: parsedState.selectedSupplier,
                        selectedPaymentMethod: parsedState.selectedPaymentMethod,
                        productReceiptDate: parsedState.productReceiptDate,
                        note: parsedState.note,
                        total: parsedState.total
                    });

                    sessionStorage.removeItem('shoppingFormState');
                    navigate(location.pathname, { state: {}, replace: true });
                }
            }
        };

        checkState();
    }, [location.state, location.pathname, navigate, shoppingForm]);

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