import { useState, useEffect } from "react";
import axios from "axios";

// Use env if present, else default to local Laravel port
const API_BASE =
  import.meta.env.VITE_BACKEND_URL || "http://127.0.0.1:8000";

export default function useIkeaSearch(keyword) {
  const [data, setData] = useState({ query: "", results: [] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const q = (keyword || "").trim();
    if (!q) return;

    let cancelled = false;
    setLoading(true);
    setError(null);

    axios
      .get(`${API_BASE}/api/ikea/search`, { params: { q } })
      .then((res) => {
        if (!cancelled) setData(res.data);
      })
      .catch((err) => {
        if (!cancelled) {
          console.error(err);
          setError(err);
          setData({ query: q, results: [] });
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [keyword]);

  return { data, loading, error };
}
