import { useNavigate, useLocation } from "react-router-dom";

export const useNavigateWithState = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const saveStateAndNavigate = (path, modalType, shoppingForm) => {
        const currentState = {
            selectedProducts: shoppingForm.selectedProducts,
            selectedSupplier: shoppingForm.selectedSupplier,
            selectedPaymentMethod: shoppingForm.selectedPaymentMethod,
            productReceiptDate: shoppingForm.productReceiptDate,
            note: shoppingForm.note,
            total: shoppingForm.total
        };

        localStorage.setItem('shoppingFormState', JSON.stringify(currentState));

        navigate(path, {
            state: {
                [`open${modalType}Modal`]: true,
                returnTo: {
                    pathname: '/shopping/new',
                    state: {
                        [`from${modalType}`]: true,
                        previousState: location.state
                    }
                },
            }
        });
    };

    return { saveStateAndNavigate };
};