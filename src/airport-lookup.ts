import { useCallback, useEffect, useState } from 'react';
import type { Airport } from './types';

const AIRPORTS_URL = '/airports.json';
const MAX_RESULTS = 5;

/** Pure filter: case-insensitive substring match on IATA code OR city. */
export function searchAirports(
  airports: Airport[],
  term: string,
  limit = MAX_RESULTS,
): Airport[] {
  const q = term.trim().toLowerCase();
  if (!q) return [];

  const results: Airport[] = [];
  for (const a of airports) {
    if (a.code.toLowerCase().includes(q) || a.city.toLowerCase().includes(q)) {
      results.push(a);
      if (results.length === limit) break;
    }
  }
  return results;
}

/** Loads airports.json at runtime and exposes search(term). */
export function useAirportLookup() {
  const [airports, setAirports] = useState<Airport[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    fetch(AIRPORTS_URL, { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json() as Promise<Airport[]>;
      })
      .then((data) => {
        setAirports(data);
        setLoading(false);
      })
      .catch((err: unknown) => {
        if (err instanceof DOMException && err.name === 'AbortError') return;
        setError('Could not load airports.');
        setLoading(false);
      });

    return () => controller.abort();
  }, []);

  const search = useCallback(
    (term: string) => searchAirports(airports, term),
    [airports],
  );

  return { search, loading, error };
}
