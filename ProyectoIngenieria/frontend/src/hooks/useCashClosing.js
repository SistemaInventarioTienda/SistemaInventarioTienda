import { useEffect, useState } from "react";
import { cashClosingConfig } from "../config/entities/cashClosingConfig";
import { toast } from "sonner";

export const useCashClosing = () => {
    const [metrics, setMetrics] = useState({});
    const [data, setData] = useState([]);
    const [sortedData, setSortedData] = useState([]);
    const [sortField, setSortField] = useState(null);
    const [sortOrder, setSortOrder] = useState("asc");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await cashClosingConfig.api.fetchAll();

                const cashData = response.cashData || [];
                const totals = response.totals;

                const transformedData = cashData.map(cashClosingConfig.transformData.toFrontend);
                setData(transformedData);
                setSortedData(transformedData);

                if (totals) {
                    setMetrics(formatMetrics(totals));
                }
            } catch (err) {
                console.error("❌ Error en fetchData:", err);
                setError("Error cargando datos del cierre de caja.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        setSortedData(data);
        setSortField(null);
        setSortOrder("asc");
    }, [data]);

    const handleSort = (field) => {
        let order = "asc";
        if (sortField === field && sortOrder === "asc") {
            order = "desc";
        }
        setSortField(field);
        setSortOrder(order);

        const sorted = [...data].sort((a, b) => {
            const aField = a[field];
            const bField = b[field];

            if (field === "HORA") {
                const [aH, aM] = aField.split(":").map(Number);
                const [bH, bM] = bField.split(":").map(Number);
                return order === "asc"
                    ? aH !== bH ? aH - bH : aM - bM
                    : bH !== aH ? bH - aH : bM - aM;
            }

            if (typeof aField === "string" && typeof bField === "string") {
                return order === "asc"
                    ? aField.localeCompare(bField)
                    : bField.localeCompare(aField);
            }

            if (typeof aField === "number" && typeof bField === "number") {
                return order === "asc" ? aField - bField : bField - aField;
            }

            return 0;
        });

        setSortedData(sorted);
    };

    const formatMetrics = (metrics) => {
        return {
            ventas: metrics.TOTAL_VENTAS,
            ingresos: metrics.TOTAL_ABONO,
            egresos: metrics.TOTAL_COMPRAS,
            total: metrics.TOTAL,
            transacciones: metrics.TOTAL_TRANSACCIONES,

            ventasFormatted: formatCurrency(metrics.TOTAL_VENTAS),
            ingresosFormatted: formatCurrency(metrics.TOTAL_ABONO),
            egresosFormatted: formatCurrency(-metrics.TOTAL_COMPRAS),
            totalFormatted: formatCurrency(metrics.TOTAL),
            transaccionesFormatted: formatCurrency(metrics.TOTAL_TRANSACCIONES),
        };
    };

    const formatCurrency = (amount) =>
        new Intl.NumberFormat("es-CR", {
            style: "currency",
            currency: "CRC",
        }).format(amount);

    const currentDate = new Date().toLocaleDateString("es-CR", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });

    const handleConfirmCashClosing = async () => {
        try {
            await cashClosingConfig.api.create();
            toast.success("Cierre de caja realizado exitosamente.");
            setIsModalOpen(false);
        } catch (error) {
            toast.error("Error al realizar el cierre de caja.");
        }
    };

    return {
        metrics,
        data,
        sortedData,
        sortField,
        sortOrder,
        handleSort,
        currentDate,
        loading,
        error,
        isModalOpen,
        setIsModalOpen,
        handleConfirmCashClosing,
    };
};
