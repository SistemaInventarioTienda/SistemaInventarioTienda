import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/authContext';
import { usePagination } from './usePagination';
import { useSearch } from './useSearch';
import { useSorting } from './useSorting';

export const useEntityPage = ({ fetchAll, searchByValue, entityKey }) => {
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

    const fetchData = async ({ resetPage = false, field = null, order = null, term = searchTerm } = {}) => {
        try {
            const page = resetPage ? 1 : currentPage;

            if (field !== null) toggleSortOrder(field);
            if (order !== null) setSortOrder(order);

            console.log("Search term in fetchData:", term);

            const response = term.trim()
                ? await searchByValue(page, itemsPerPage, term, sortField, sortOrder)
                : await fetchAll(page, itemsPerPage, sortField, sortOrder);

            console.log("Response:", response);

            const items = response[entityKey] || [];
            const transformedData = items.map(item => ({
                ...item,
                ESTADO: item.ESTADO === 1 ? "ACTIVO" : "INACTIVO",
                DSC_TELEFONO: item.TelefonoClientes.length > 0
                    ? item.TelefonoClientes[0].DSC_TELEFONO
                    : "Sin Información"
            }));

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

    useEffect(() => {
        if (!isAuthenticated) {
            navigate("/login");
        } else if (currentPage || itemsPerPage || sortField || sortOrder) {
            fetchData();
        }
    }, [isAuthenticated, navigate, currentPage, itemsPerPage, sortField, sortOrder]);

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