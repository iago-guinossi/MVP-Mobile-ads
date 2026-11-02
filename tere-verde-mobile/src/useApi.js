import { useCallback, useRef, useState } from 'react';
import { useFocusEffect } from 'expo-router';

// Carrega dados da API sempre que a tela ganha foco (assim as listas se atualizam após o admin salvar)
export function useApi(loader, deps = []) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const loaderRef = useRef(loader);
  loaderRef.current = loader;

  const load = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    try {
      const result = await loaderRef.current();
      setData(result);
      setError(null);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(
    // eslint-disable-next-line react-hooks/exhaustive-deps
    useCallback(() => {
      load();
    }, [load, ...deps])
  );

  const retry = useCallback(() => {
    setLoading(true);
    load();
  }, [load]);

  return { data, error, loading, refreshing, refresh: () => load(true), retry };
}
