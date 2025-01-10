import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/authContext';

export const useEntityPage = ({ fetchAll, searchByValue, entityKey }) => {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();

    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [itemsPerPage, setItemsPerPage] = useState(5);
    const [sortField, setSortField] = useState(null);
    const [sortOrder, setSortOrder] = useState("asc");

    const fetchData = async (resetPage = false) => {
        setLoading(true);
        try {
            const page = resetPage ? 1 : currentPage;

            const response = searchTerm.trim()
                ? await searchByValue(page, itemsPerPage, searchTerm, sortField, sortOrder)
                : await fetchAll(page, itemsPerPage, sortField, sortOrder);

            // Mapeo dinámico basado en el nombre de la entidad
            const items = response[entityKey] || [];
            
            const transformedData = items.map(item => ({
                ...item,
                ESTADO: item.ESTADO === 1 ? "ACTIVO" : "INACTIVO",
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
        } else {
            fetchData();
        }
    }, [isAuthenticated, navigate, currentPage, itemsPerPage, sortField, sortOrder, searchTerm]);

    return {
        data,
        setData,
        filteredData,
        setFilteredData,
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
        setSortField,
        setSortOrder,
        fetchData,
    };
};
