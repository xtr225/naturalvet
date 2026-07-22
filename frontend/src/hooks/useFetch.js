import { useCallback, useEffect, useState } from "react";

export function useFetch(fetcher) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      setData(await fetcher());
    } catch (currentError) {
      setError(currentError);
    } finally {
      setIsLoading(false);
    }
  }, [fetcher]);

  useEffect(() => {
    const timer = window.setTimeout(load, 0);

    return () => {
      window.clearTimeout(timer);
    };
  }, [load]);

  return { data, error, isLoading, reload: load };
}
