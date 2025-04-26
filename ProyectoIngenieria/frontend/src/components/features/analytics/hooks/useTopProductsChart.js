import { useState, useEffect } from "react";
import { getAllDataFromGraphic } from "../../../../api/graphics";

export function useTopProductsChart() {
    const today = new Date();
    const formattedToday = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    const [dateRange, setDateRange] = useState({ start: '2020-01-01', end: formattedToday });
    const [chartData, setChartData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const isDateValid = (date) => date && !isNaN(new Date(date).getTime());

    useEffect(() => {
        console.log("FEC INICIO", dateRange.start);
        console.log("FEC FINAL", dateRange.end);
    });

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
            console.log("DATA", data.results);
            const parsedResults = Array.isArray(data.results)
                ? data.results
                : Object.values(data.results || {});
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

    const handleDateChange = (name, date) => {
        const formattedDate = date.toISOString().split("T")[0];
        setDateRange((prev) => ({
            ...prev,
            [name]: formattedDate,
        }));
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
