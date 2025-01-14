import { useState } from "react";

export const usePagination = (initialPage = 1, initialItemsPerPage = 5) => {
    const [currentPage, setCurrentPage] = useState(initialPage);
    const [itemsPerPage, setItemsPerPage] = useState(initialItemsPerPage);
    
    return {
        currentPage,
        itemsPerPage,
        setCurrentPage,
        setItemsPerPage,
    };
};
