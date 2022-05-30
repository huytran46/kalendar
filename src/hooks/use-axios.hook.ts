import { useEffect, useRef, useState } from "react";
import axios from "axios";
import type { Method, AxiosResponse } from "axios";

export default function useAxios<P, R>(
  url: string,
  method: Method,
  payload: P
) {
  const [data, setData] = useState<R | null>(null);

  const [error, setError] = useState("");

  const [loading, setLoading] = useState(false);

  const controllerRef = useRef(new AbortController());

  const cancelRequest = () => {
    controllerRef.current.abort();
  };

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const response = await axios.request<P, AxiosResponse<R>>({
          data: payload,
          signal: controllerRef.current.signal,
          method,
          url,
        });
        setData(response.data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return { cancel: cancelRequest, data, error, loading };
}
