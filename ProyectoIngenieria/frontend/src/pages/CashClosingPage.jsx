import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PageLayout from "../components/layout/PageLayout";
import { toast } from "sonner";
import { usePermissions } from "../context/authPermissions";
import { Button, MetricCard, Table } from "../components/common";
import {
    Plus,
    DollarSign,
    ArrowUpCircle,
    ArrowDownCircle,
    Calculator,
} from "lucide-react";
import { cashClosingConfig } from "../config/entities/cashClosingConfig";
import { useCashClosing } from "../hooks/useCashClosing";

const CashClosingPage = () => {
    const { permissions } = usePermissions();
    const navigate = useNavigate();

    const { metrics, data, currentDate } = useCashClosing();

    useEffect(() => {
        if (permissions.home === undefined) return;
        if (!permissions.sales) {
            toast.error("No tienes permiso para acceder al cierre de caja");
            navigate("/");
        }
    }, [permissions, navigate]);

    const currency = (amount) =>
        new Intl.NumberFormat("es-CR", {
            style: "currency",
            currency: "CRC",
        }).format(amount);

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
                    <Button className="add-btn">
                        <Plus size={18} /> Realizar Cierre de Caja
                    </Button>
                </div>
            </div>

            <div className="metric-grid">
                <MetricCard
                    title="Ventas"
                    value={currency(metrics.ventas)}
                    icon={<DollarSign size={20} />}
                    dynamicColor
                />
                <MetricCard
                    title="Ingresos"
                    value={currency(metrics.ingresos)}
                    icon={<ArrowDownCircle size={20} />}
                    dynamicColor
                />
                <MetricCard
                    title="Egresos"
                    value={currency(metrics.egresos)}
                    icon={<ArrowUpCircle size={20} />}
                    dynamicColor
                />
                <MetricCard
                    title="Total"
                    value={currency(metrics.total)}
                    icon={<Calculator size={20} />}
                    dynamicColor
                />
            </div>

            <div className="table-container">
                <Table
                    columns={cashClosingConfig.columns}
                    data={data}
                    entityKey={cashClosingConfig.entityKey}
                />
            </div>
        </PageLayout>
    );
};

export default CashClosingPage;
