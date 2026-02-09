import { useState, useEffect, useCallback } from 'react';

export function useLivePolling(fetchFunction, interval = 10000) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [lastUpdated, setLastUpdated] = useState(null);

    const fetchData = useCallback(async () => {
        try {
            const response = await fetchFunction();
            setData(response.data);
            setLastUpdated(new Date());
            setError(null);
        } catch (err) {
            setError(err.message || 'Failed to fetch data');
        } finally {
            setLoading(false);
        }
    }, [fetchFunction]);

    useEffect(() => {
        fetchData();

        const pollInterval = setInterval(fetchData, interval);

        return () => clearInterval(pollInterval);
    }, [fetchData, interval]);

    const refetch = useCallback(() => {
        setLoading(true);
        fetchData();
    }, [fetchData]);

    return { data, loading, error, lastUpdated, refetch };
}

export function usePollingMultiple(fetchFunctions, interval = 10000) {
    const [data, setData] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [lastUpdated, setLastUpdated] = useState(null);

    const fetchAllData = useCallback(async () => {
        try {
            const results = await Promise.all(
                Object.entries(fetchFunctions).map(async ([key, fn]) => {
                    const response = await fn();
                    return [key, response.data];
                })
            );

            setData(Object.fromEntries(results));
            setLastUpdated(new Date());
            setError(null);
        } catch (err) {
            setError(err.message || 'Failed to fetch data');
        } finally {
            setLoading(false);
        }
    }, [fetchFunctions]);

    useEffect(() => {
        fetchAllData();

        const pollInterval = setInterval(fetchAllData, interval);

        return () => clearInterval(pollInterval);
    }, [fetchAllData, interval]);

    const refetch = useCallback(() => {
        setLoading(true);
        fetchAllData();
    }, [fetchAllData]);

    return { data, loading, error, lastUpdated, refetch };
}

export default useLivePolling;
