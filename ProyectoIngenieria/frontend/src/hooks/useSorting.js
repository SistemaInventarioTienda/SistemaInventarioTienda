import { useState } from 'react';

export const useSorting = (defaultField = null, defaultOrder = 'asc') => {
    const [sortField, setSortField] = useState(defaultField);
    const [sortOrder, setSortOrder] = useState(defaultOrder);

    const toggleSortOrder = (field) => {
        if (field === sortField) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortOrder('desc');
        }
    };

    return {
        sortField,
        sortOrder,
        setSortField,
        setSortOrder,
        toggleSortOrder,
    };
};
