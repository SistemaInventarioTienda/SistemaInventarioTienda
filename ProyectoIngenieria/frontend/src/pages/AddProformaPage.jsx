import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { default as useProformaForm } from '../hooks/useProformaForm.js';
import PageLayout from "../components/layout/PageLayout";
import { ProformaDetailsCard, ProformaSummaryCard } from "../components/features/proforma";
import { toast } from "sonner";
import { usePermissions } from "../context/authPermissions";
import "./styles/AddProformaPage.css"

const AddProformaPage = () => {
    const proformaForm = useProformaForm();
    const { permissions } = usePermissions();
    const navigate = useNavigate();

    useEffect(() => {
        if (permissions.home === undefined) return;

        if (!permissions.proforma) {
            toast.error("No tienes permiso para acceder a proformas");
            navigate("/");
        }
    }, [permissions, navigate]);

    return (
        <PageLayout>
            <div className="page-header">
                <div>
                    <h1>Nueva Proforma</h1>
                    <p>Seleccione o digite los datos correspondientes para realizar una nueva proforma</p>
                </div>
            </div>
            <div className="proforma-grid">
                <ProformaDetailsCard proformaForm={proformaForm} />
                <ProformaSummaryCard proformaForm={proformaForm} />
            </div>
        </PageLayout>
    );
};

export default AddProformaPage;