import { useState } from "react";

const useAlert = () => {
    const [alert, setAlert] = useState({ show: false, message: "", type: "" });

    const showAlert = (message, type) => {
        // Oculta la alerta antes de mostrar la nueva para forzar actualización
        setAlert({ show: false, message: "", type: "" });

        setTimeout(() => {
            setAlert({ show: true, message, type });
        }, 10); // Pequeño delay para asegurar re-render
    };

    const hideAlert = () => {
        setAlert({ show: false, message: "", type: "" });
    };

    return { alert, showAlert, hideAlert };
};

export default useAlert;
