// src/hooks/useGraphicData.js
import { useState, useEffect, useCallback } from "react";
import { getAllDataFromGraphic } from "../../../../api/graphics";

export function useGraphicData(initialParams = {}, parseDataFn = (data) => data) {
    const [params, setParams] = useState(initialParams);
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const fetchData = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const response = await getAllDataFromGraphic(params);
            const parsed = parseDataFn(response);
            setData(parsed);
        } catch (err) {
            console.error(err);
            setError('Error cargando datos.');
        } finally {
            setLoading(false);
        }
    }, [params, parseDataFn]);

    useEffect(() => {
        if (params) {
            fetchData();
        }
    }, [fetchData]);

    return {
        data,
        loading,
        error,
        setParams,
    };
}
