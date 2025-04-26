import { useState, useEffect } from "react";
import { getAllDataFromGraphic } from "../../../../api/graphics";
import { getAllCategories } from "../../../../api/category";

export function useInventoryComparisonChart() {
    const today = new Date();
    const formattedToday = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

    const [dateRange, setDateRange] = useState({ start: '2020-01-01', end: formattedToday });
    const [chartData, setChartData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');

    const addOneDay = (dateStr) => {
        const date = new Date(dateStr);
        date.setDate(date.getDate() + 1);
        return date.toISOString().split('T')[0];
    };

    const fetchCategories = async () => {
        try {
            const response = await getAllCategories(1, 100, 'DSC_NOMBRE', 'asc');
            console.log("CATEGORÍAS", response);
            const options = response.category.map(cat => ({
                label: cat.DSC_NOMBRE,
                value: cat.DSC_NOMBRE
            }));
            setCategories(options);
        } catch (err) {
            console.error("Error al cargar las categorías");
        }
    };

    const fetchData = async () => {
        try {
            setLoading(true);
            setError('');
            const response = await getAllDataFromGraphic({
                MIN_FEC: dateRange.start,
                MAX_FEC: addOneDay(dateRange.end),
                // NOTA: aún no se filtra por categoría
            });

            const parsed = Object.values(response.other || {}).map((item) => ({
                nombre: item.DSC_NOMBRE,
                stock: Number(item.CANTIDAD),
                vendidos: Number(item.TOTAL_VENDIDO),
                ratio: Number(item.TOTAL_VENDIDO) > 0 ? Number(item.TOTAL_VENDIDO) / Number(item.CANTIDAD || 1) : 0,
            }));

            setChartData(parsed);
        } catch (err) {
            setError("Error al cargar los datos.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    useEffect(() => {
        if (dateRange.start && dateRange.end) {
            fetchData();
        }
    }, [dateRange]);

    const handleDateChange = (name, date) => {
        const formattedDate = date.toISOString().split("T")[0];
        setDateRange((prev) => ({ ...prev, [name]: formattedDate }));
    };

    const handleCategoryChange = (e) => {
        setSelectedCategory(e.target.value);
    };

    return {
        dateRange,
        handleDateChange,
        chartData,
        loading,
        error,
        categories,
        selectedCategory,
        handleCategoryChange,
    };
}
