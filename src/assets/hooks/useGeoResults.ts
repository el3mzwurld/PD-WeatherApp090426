import type { GeoCodingRes, GeoCodingResponse } from "../Types/weatherTypes";
import { useRef, useState } from "react";

const API_URL = "https://geocoding-api.open-meteo.com/v1/search";

interface UseGeoCodingReturn {
  results: GeoCodingRes[];
  isSearching: boolean;
  error: string | null;
  searchCities: (query: string) => void;
  clearResults: () => void;
}

const useGeocoding = (): UseGeoCodingReturn => {
  const [results, setResults] = useState<GeoCodingRes[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  //Handle any fetch lags and overlaps
  const abortRef = useRef<AbortController | null>(null);

  //Remember this feature : I'm trying to make sure the API fetching happens a short while AFTER the user finishes typing
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const searchCities = (query: string) => {
    // Kill every timer when the user taps a key
    if (debounceRef.current) clearTimeout(debounceRef.current);

    // If there's no query, clear the results state
    if (!query.trim()) {
      setResults([]);
      setError(null);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      // if there are any current requests cancel anyone, upon a new keystroke

      if (abortRef.current) abortRef.current.abort();

      abortRef.current = new AbortController();

      setIsSearching(true);
      setError(null);

      try {
        const geoSearchParams = new URLSearchParams({
          name: query.trim(),
          count: "6",
          language: "en",
          format: "json",
        });

        const res = await fetch(`${API_URL}?${geoSearchParams}`, {
          signal: abortRef.current.signal,
        });

        if (!res.ok) throw new Error("failed to fetch the geolocation data");

        const data: GeoCodingResponse = await res.json();

        setResults(data.results ?? []);

        if (!data.results || data.results.length === 0) {
          setError("No cities found. Try a different name.");
        }
      } catch (error) {
        if (error instanceof Error && error.name === "AbortError") return;
        setError("Something went wrong. Please try again.");
      } finally {
        setIsSearching(false);
      }
    }, 400);
  };

  const clearResults = () => {
    setResults([]);
    setError(null);
  };

  return {
    results,
    error,
    isSearching,
    searchCities,
    clearResults,
  };
};

export default useGeocoding;
