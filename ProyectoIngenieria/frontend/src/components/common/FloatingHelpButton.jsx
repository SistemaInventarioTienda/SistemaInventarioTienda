import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { HelpCircle } from "lucide-react";
import "./styles/FloatingHelpButton.css";

const moduleToHelpTab = {
    "/users": "users",
    "/product": "products",
    "/category": "categories",
    "/suppliers": "suppliers",
    "/clients": "clients",
    "/sales": "sales",
    "/credits": "sales",
    "/shopping": "purchases",
    "/transactions": "transacctions",
    "/reports": "reports"
};

export default function FloatingHelpButton() {
    const location = useLocation();
    const navigate = useNavigate();

    const currentModule = Object.keys(moduleToHelpTab).find((path) =>
        location.pathname.startsWith(path)
    );

    const helpTab = moduleToHelpTab[currentModule] || "users";

    const handleClick = () => {
        navigate(`/help-center?tab=${helpTab}`);
    };

    return (
        <button
            className="floating-help-button"
            onClick={handleClick}
            title="Centro de Ayuda"
        >
            <HelpCircle size={28} strokeWidth={2.5} />
        </button>
    );
}
