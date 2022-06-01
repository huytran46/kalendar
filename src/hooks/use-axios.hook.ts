import { useCallback, useEffect, useRef, useState } from "react";
import axios from "axios";
import type { Method, AxiosResponse } from "axios";

const baseUrl = "http://localhost:4000";

function useAxios<P, R>(
  resourceUrl: string,
  method: Method,
  payload?: P,
  fetchOnMount = true
) {
  const [data, setData] = useState<R | null>(null);

  const [error, setError] = useState("");

  const [loading, setLoading] = useState(false);

  const controllerRef = useRef(new AbortController());

  const cancelRequest = () => {
    controllerRef.current.abort();
  };

  const caller = useCallback(
    async (_payload?: P, _resourceUrl = resourceUrl) => {
      try {
        setLoading(true);
        const response = await axios.request<P, AxiosResponse<R>>({
          data: _payload ?? payload,
          signal: controllerRef.current.signal,
          method,
          url: baseUrl + _resourceUrl,
        });
        setData(response.data);
        return response;
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    },
    [payload, method, resourceUrl]
  );

  useEffect(() => {
    (async () => {
      if (method !== "GET" || !fetchOnMount) return;
      try {
        setLoading(true);
        const response = await caller();
        setData(response.data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [caller, method, fetchOnMount]);

  return { cancel: cancelRequest, data, error, loading, execute: caller };
}

export default useAxios;
