import { useEffect, useState } from "react";
import { cashClosingConfig } from "../config/entities/cashClosingConfig";
import { toast } from "sonner";

export const useCashClosing = () => {
    const [metrics, setMetrics] = useState({});
    const [data, setData] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await cashClosingConfig.api.fetchAll();
                const rawData = response.data || [];
                const transformedData = rawData.map(cashClosingConfig.transformData.toFrontend);
                setData(transformedData);

                if (response.metrics) {
                    setMetrics(formatMetrics(response.metrics));
                }
            } catch (err) {
                console.error(err);
                setError("Error cargando datos del cierre de caja.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const formatMetrics = (metrics) => {
        return {
            ventas: metrics.ventas,
            ingresos: metrics.ingresos,
            egresos: metrics.egresos,
            total: metrics.total,
            ventasFormatted: formatCurrency(metrics.ventas),
            ingresosFormatted: formatCurrency(metrics.ingresos),
            egresosFormatted: formatCurrency(metrics.egresos),
            totalFormatted: formatCurrency(metrics.total),
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
        currentDate,
        loading,
        error,
        isModalOpen,
        setIsModalOpen,
        handleConfirmCashClosing,
    };
};
