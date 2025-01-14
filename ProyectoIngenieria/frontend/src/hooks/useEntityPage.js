import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/authContext';
import { usePagination } from './usePagination';
import { useSearch } from './useSearch';
import { useSorting } from './useSorting';

export const useEntityPage = ({ fetchAll, searchByValue, entityKey, transformConfig }) => {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();

    const { currentPage, itemsPerPage, setCurrentPage, setItemsPerPage } = usePagination();
    const { searchTerm, setSearchTerm, handleSearchChange } = useSearch();
    const { sortField, sortOrder, setSortOrder, toggleSortOrder } = useSorting(); // Incluido setSortField y setSortOrder

    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!isAuthenticated) {
            navigate("/login");
        } else if (currentPage || itemsPerPage || sortField || sortOrder) {
            fetchData({ transformConfig });
        }
    }, [isAuthenticated, navigate, currentPage, itemsPerPage, sortField, sortOrder]);    

    const fetchData = async ({
        resetPage = false,
        field = null,
        order = null,
        term = searchTerm,
        transformConfig = null,
    } = {}) => {
        try {
            const page = resetPage ? 1 : currentPage;

            if (field !== null) toggleSortOrder(field);
            if (order !== null) setSortOrder(order);

            const response = term.trim()
                ? await searchByValue(page, itemsPerPage, term, sortField, sortOrder)
                : await fetchAll(page, itemsPerPage, sortField, sortOrder);

            const items = response[entityKey] || [];

            const transformedData = items.map(item =>
                applyTransformations(item, transformConfig)
            );
            console.log("transformed", transformedData);
            setData(transformedData);
            setFilteredData(transformedData);
            setTotalPages(response.totalPages);
            if (resetPage) setCurrentPage(1);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Función genérica para aplicar transformaciones
    const applyTransformations = (item, config) => {
        if (!config || typeof config !== "object") return item;
    
        const transformedItem = { ...item };
    
        Object.entries(config).forEach(([key, transformRule]) => {
            if (typeof transformRule === "function") {
                transformedItem[key] = transformRule(item);
            }
        });
    
        return transformedItem;
    };
    
    return {
        filteredData,
        currentPage,
        totalPages,
        loading,
        error,
        searchTerm,
        itemsPerPage,
        sortField,
        sortOrder,
        setCurrentPage,
        setSearchTerm,
        setItemsPerPage,
        fetchData,
        toggleSortOrder,
    };
};