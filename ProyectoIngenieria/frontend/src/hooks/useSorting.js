import { useState } from 'react';

export const useSorting = (defaultField = null, defaultOrder = 'asc') => {
    const [sortField, setSortField] = useState(defaultField);
    const [sortOrder, setSortOrder] = useState(defaultOrder);

    const toggleSortOrder = (field) => {
        const newOrder = field === sortField && sortOrder === 'asc' ? 'desc' : 'asc';
        setSortField(field);
        setSortOrder(newOrder);
    };

    return {
        sortField,
        sortOrder,
        setSortField,
        setSortOrder,
        toggleSortOrder,
    };
};
