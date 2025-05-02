import { useState, useEffect } from "react";
import { getAllDataFromGraphic } from "../../../../api/graphics";

export function useMonthlySalesChart() {
    const today = new Date();
    const currentYear = today.getFullYear();

    const [selectedYear, setSelectedYear] = useState(currentYear.toString());
    const [chartData, setChartData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const yearOptions = Array.from({ length: 5 }, (_, i) => {
        const year = (currentYear - i).toString();
        return { value: year, label: year };
    });

    const fetchData = async () => {
        const startOfYear = `${selectedYear}-01-01`;
        const endOfYear = `${selectedYear}-01-01`;

        try {
            setLoading(true);
            setError('');

            const data = await getAllDataFromGraphic({
                FEC_CURRENT: `${selectedYear}-12-31`,
                MIN_FEC: startOfYear,
                MAX_FEC: endOfYear,
            });

            console.log("DATA last12sales:", data.last12sales);

            const parsedResults = Array.isArray(data.last12sales)
                ? data.last12sales
                : Object.values(data.last12sales || {});

            setChartData(parsedResults);
        } catch (err) {
            console.error(err);
            setError('Error cargando datos de ventas mensuales.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (selectedYear) {
            fetchData();
        }
    }, [selectedYear]);

    const handleYearChange = (year) => {
        setSelectedYear(year);
    };

    return {
        selectedYear,
        handleYearChange,
        chartData,
        loading,
        error,
        yearOptions,
    };
}
