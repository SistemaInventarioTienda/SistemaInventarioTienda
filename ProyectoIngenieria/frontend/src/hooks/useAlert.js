// src/hooks/useAlert.js
import { useState } from "react";

const useAlert = () => {
    const [alert, setAlert] = useState({ show: false, message: "", type: "" });

    const showAlert = (message, type) => {
        setAlert({ show: true, message, type });
    };

    const hideAlert = () => {
        setAlert({ show: false, message: "", type: "" });
    };

    return { alert, showAlert, hideAlert };
};

export default useAlert;
