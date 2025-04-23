import { useState, useEffect } from "react";
import { getAllDataFromGraphic } from "../../../../api/graphics";

export function useTopProductsChart() {
    const today = new Date().toISOString().split('T')[0];
    const [dateRange, setDateRange] = useState({ start: '2020-01-01', end: today });
    const [chartData, setChartData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const isDateValid = (date) => date && !isNaN(new Date(date).getTime());

    const addOneDay = (dateStr) => {
        const date = new Date(dateStr);
        date.setDate(date.getDate() + 1);
        return date.toISOString().split('T')[0];
    };

    const fetchData = async () => {
        if (!isDateValid(dateRange.start)) {
            setError('Fecha inicial inválida');
            return;
        }
        if (!isDateValid(dateRange.end)) {
            setError('Fecha final inválida');
            return;
        }

        try {
            setLoading(true);
            setError('');
            const data = await getAllDataFromGraphic({
                MIN_FEC: dateRange.start,
                MAX_FEC: addOneDay(dateRange.end),
                LIMIT_PRODUCTS: 5,
            });

            const parsedResults = Array.isArray(data)
                ? data
                : Object.values(data || {});
            setChartData(parsedResults);
        } catch (err) {
            setError('Error cargando datos. Intente nuevamente.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (dateRange.start && dateRange.end) {
            fetchData();
        }
    }, [dateRange]);

    const handleDateChange = (e) => {
        const { name, value } = e.target;
        setDateRange(prev => ({ ...prev, [name]: value }));
    };

    const best = chartData[0] || { DSC_NOMBRE: 'N/A', TOTAL_VENDIDO: 0 };

    return {
        dateRange,
        handleDateChange,
        chartData,
        best,
        loading,
        error,
    };
}
