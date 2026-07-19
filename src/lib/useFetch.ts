'use client';

import { useCallback, useEffect, useState } from 'react';
import { api } from './api';

interface UseFetchResult<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  reload: () => void;
}

export function useFetch<T>(url: string | null): UseFetchResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(!!url);
  const [error, setError] = useState<string | null>(null);
  const [reloadIndex, setReloadIndex] = useState(0);

  const reload = useCallback(() => setReloadIndex((i) => i + 1), []);

  useEffect(() => {
    if (!url) {
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    api
      .get<T>(url)
      .then((response) => {
        if (!cancelled) setData(response.data);
      })
      .catch((err) => {
        if (!cancelled) setError(err?.message || 'Failed to load data');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [url, reloadIndex]);

  return { data, loading, error, reload };
}
