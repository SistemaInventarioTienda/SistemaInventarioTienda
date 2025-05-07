import { useState, useEffect } from "react";
import { getAllDataFromGraphic } from "../../../../api/graphics";
import { getAllSubcategories } from "../../../../api/subcategory";
import { getAllCategories } from "../../../../api/category";
export function useInventoryComparisonChart() {
    const today = new Date();
    const formattedToday = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

    const [dateRange, setDateRange] = useState({ start: '2020-01-01', end: formattedToday });
    const [chartData, setChartData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [filterType, setFilterType] = useState('category');
    const [filterOptions, setFilterOptions] = useState([]);
    const [selectedFilter, setSelectedFilter] = useState('');

    const addOneDay = (dateStr) => {
        const date = new Date(dateStr);
        date.setDate(date.getDate() + 1);
        return date.toISOString().split('T')[0];
    };

    const fetchCategories = async () => {
        try {
            const response = await getAllCategories(1, 100, 'DSC_NOMBRE', 'asc');
            const options = response.category.map(cat => ({
                label: cat.DSC_NOMBRE,
                value: cat.DSC_NOMBRE
            }));
            if (filterType === 'category') {
                setFilterOptions(options);
            }
        } catch (err) {
            console.error("Error al cargar las categorías");
        }
    };

    const fetchSubcategories = async () => {
        try {
            const response = await getAllSubcategories(1, 100, 'DSC_NOMBRE', 'asc');
            const options = response.subcategory.map(sub => ({
                label: sub.DSC_NOMBRE,
                value: sub.DSC_NOMBRE
            }));
            if (filterType === 'subcategory') {
                setFilterOptions(options);
            }
            console.log("SUBCATEGORIES", response.subcategory);
        } catch (err) {
            console.error("Error al cargar las subcategorías");
        }
    };

    const fetchData = async () => {
        try {
            setLoading(true);
            setError('');
            const response = await getAllDataFromGraphic({
                MIN_FEC: dateRange.start,
                MAX_FEC: dateRange.end,
                // MAX_FEC: addOneDay(dateRange.end),
                CATEGORY: selectedFilter,
            });
            
            const parsed = Object.values(response.products_stock_sold || {}).map((item) => ({
                nombre: item.DSC_NOMBRE,
                stock: Number(item.CANTIDAD),
                vendidos: Number(item.TOTAL_VENDIDO),
                ratio: Number(item.TOTAL_VENDIDO) > 0 ? Number(item.TOTAL_VENDIDO) / Number(item.CANTIDAD || 1) : 0,
            }));
            console.log("TIPO FILTRADO", filterType);
            console.log("FILTRO SELECCIONADO", filterType, selectedFilter);
            console.log("RESPONSE", response.products_stock_sold);
            setChartData(parsed);
        } catch (err) {
            setError("Error al cargar los datos.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (filterType === 'category') {
            fetchCategories();
        } else if (filterType === 'subcategory') {
            fetchSubcategories();
        }
    }, [filterType]);

    useEffect(() => {
        if (dateRange.start && dateRange.end) {
            fetchData();
        }
    }, [dateRange, selectedFilter, filterType]);

    const handleDateChange = (name, date) => {
        const formattedDate = date.toISOString().split("T")[0];
        setDateRange((prev) => ({ ...prev, [name]: formattedDate }));
    };

    const handleFilterTypeChange = (e) => {
        setFilterType(e.target.value);
        setSelectedFilter('');
    };

    const handleFilterChange = (e) => {
        setSelectedFilter(e.target.value);
    };

    return {
        dateRange,
        handleDateChange,
        chartData,
        loading,
        error,
        filterType,
        handleFilterTypeChange,
        filterOptions,
        selectedFilter,
        handleFilterChange,
    };
}