import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PageLayout from "../components/layout/PageLayout";
import { toast } from "sonner";
import { usePermissions } from "../context/authPermissions";
import { Button, MetricCard, Table } from "../components/common";
import { cashClosingConfig } from "../config/entities/cashClosingConfig";
import { useCashClosing } from "../hooks/useCashClosing";
import ModalConfirmation from "../components/modals/ModalConfirmation";
import ReportViewer from "../components/features/reports/ReportViewer";
import { openReportViewerInNewWindow } from "../components/features/reports/utils/openReportViewer";
import {
    ShoppingCart,
    CreditCard,
    Package,
    DollarSign,
    Repeat,
} from "lucide-react";

const CashClosingPage = () => {
    const { permissions } = usePermissions();
    const navigate = useNavigate();
    const {
        metrics,
        sortedData,
        sortField,
        sortOrder,
        handleSort,
        loading,
        error,
        currentDate,
        handleConfirmCashClosing,
        isModalOpen,
        setIsModalOpen,
        reportLinks
    } = useCashClosing();

    useEffect(() => {
        if (permissions.home === undefined) return;
        if (!permissions.sales) {
            toast.error("No tienes permiso para acceder al cierre de caja");
            navigate("/");
        }
    }, [permissions, navigate]);

    useEffect(() => {
        if (reportLinks?.pdf) {
            toast.success("Reporte PDF generado correctamente.");
            openReportViewerInNewWindow("pdf", reportLinks.pdf);
        }
        if (reportLinks?.xlsx) {
            toast.success("Reporte Excel generado correctamente.");
            openReportViewerInNewWindow("xlsx", reportLinks.xlsx);
        }
    }, [reportLinks]);

    return (
        <PageLayout>
            <div className="page-header">
                <div>
                    <h1>Cierre de Caja</h1>
                    <p>Registro de movimientos y cierre del día</p>
                    <p>
                        <strong>Fecha:</strong> {currentDate}
                    </p>
                </div>
                <div style={{ display: "flex", gap: "10px" }}>
                    <Button className="add-btn" onClick={() => setIsModalOpen(true)}>
                        <DollarSign size={18} /> Realizar Cierre de Caja
                    </Button>
                </div>
            </div>

            {/* Cards métricas */}
            <div className="metric-grid-2">
                <MetricCard
                    title="Ventas"
                    value={metrics.ventasFormatted}
                    icon={<ShoppingCart size={20} />}
                    dynamicColor
                />
                <MetricCard
                    title="Abonos a Créditos"
                    value={metrics.ingresosFormatted}
                    icon={<CreditCard size={20} />}
                    dynamicColor
                />
                <MetricCard
                    title="Gastos en Compras"
                    value={metrics.egresosFormatted}
                    icon={<Package size={20} />}
                    dynamicColor
                />
                <MetricCard
                    title="Transacciones"
                    value={metrics.transaccionesFormatted}
                    icon={<Repeat size={20} />}
                    dynamicColor
                />
                <MetricCard
                    title="Total"
                    value={metrics.totalFormatted}
                    icon={<DollarSign size={20} />}
                    dynamicColor
                />
            </div>
            <div className="page-header">
                <h1>Registro de movimientos</h1>
            </div>
            <div className="table-container">
                <Table
                    columns={cashClosingConfig.columns}
                    data={sortedData}
                    entityKey={cashClosingConfig.entityKey}
                    onSort={handleSort}
                    sortField={sortField}
                    sortOrder={sortOrder}
                />
            </div>
            <ModalConfirmation
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConfirm={handleConfirmCashClosing}
                entityName="Cierre de Caja"
                action="Realizar"
                message={
                    <>
                        <strong>¿Está seguro que desea realizar el cierre de caja?</strong><br />
                        Esta acción no se puede deshacer.<br /><br />
                        <span style={{ color: 'darkorange' }}>
                            Al confirmar el cierre de caja, se registrarán todos los movimientos del día y se generará unos documentos (pdf y excel) con los datos.
                        </span>
                    </>
                }
                confirmButtonText="Confirmar Cierre"
                cancelButtonText="Cancelar"
            />
        </PageLayout>
    );
};

export default CashClosingPage;
