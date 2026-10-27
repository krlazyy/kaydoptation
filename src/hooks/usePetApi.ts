import { useCallback, useEffect, useState } from "react";
import type {
  LifestyleMatchParams,
  PetMatchResponse,
  PetSearchParams,
  PetSearchResponse,
} from "../types/pet";
import {
  LifestyleMatchSchema,
  PetSearchQuerySchema,
} from "../../shared/schemas.mjs";

const API_BASE_URL =
  `${import.meta.env.VITE_API_BASE_URL || "/api/v1"}`.replace(/\/$/, "");

function requestError(response: Response, label: string) {
  if (response.status === 429) {
    const retryAfter = response.headers.get("Retry-After");
    return new Error(
      `Too many ${label} requests.${retryAfter ? ` Try again in ${retryAfter} seconds.` : " Try again shortly."}`,
    );
  }
  return new Error(`${label} failed (${response.status}).`);
}

export function usePetSearch(initialParams: PetSearchParams = {}) {
  const [params, setParams] = useState<PetSearchParams>({
    page: 1,
    limit: 12,
    ...initialParams,
  });
  const [data, setData] = useState<PetSearchResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPets = useCallback(
    async (signal?: AbortSignal) => {
      setLoading(true);
      setError(null);
      try {
        const query = new URLSearchParams();
        const validation = PetSearchQuerySchema.safeParse(params);
        if (!validation.success) {
          throw new Error(
            validation.error.issues.map((issue) => issue.message).join("; "),
          );
        }
        Object.entries(validation.data).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== "")
            query.set(key, String(value));
        });
        const response = await fetch(
          `${API_BASE_URL}/pets?${query.toString()}`,
          { signal },
        );
        if (!response.ok) throw requestError(response, "Pet search");
        setData((await response.json()) as PetSearchResponse);
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") return;
        setError(
          err instanceof Error ? err.message : "An unknown error occurred.",
        );
      } finally {
        if (!signal?.aborted) setLoading(false);
      }
    },
    [params],
  );

  useEffect(() => {
    const controller = new AbortController();
    void fetchPets(controller.signal);
    return () => controller.abort();
  }, [fetchPets]);

  const updateFilters = (newParams: Partial<PetSearchParams>) =>
    setParams((prev) => ({ ...prev, ...newParams, page: 1 }));
  const setPage = (page: number) => setParams((prev) => ({ ...prev, page }));

  return {
    pets: data?.data ?? [],
    pagination: data?.pagination,
    loading,
    error,
    params,
    updateFilters,
    setPage,
    refetch: () => fetchPets(),
  };
}

export function usePetMatch() {
  const [result, setResult] = useState<PetMatchResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getMatches = async (questionnaire: LifestyleMatchParams) => {
    setLoading(true);
    setError(null);
    try {
      const validation = LifestyleMatchSchema.safeParse(questionnaire);
      if (!validation.success) {
        throw new Error(
          validation.error.issues.map((issue) => issue.message).join("; "),
        );
      }
      const response = await fetch(`${API_BASE_URL}/pets/match`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validation.data),
      });
      if (!response.ok) throw requestError(response, "Matching");
      const matches = (await response.json()) as PetMatchResponse;
      setResult(matches);
      return matches;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to calculate matches.";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    matches: result?.matches ?? [],
    loading,
    error,
    getMatches,
    resetMatches: () => {
      setResult(null);
      setError(null);
    },
  };
}
