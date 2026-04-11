import apiClient from "@/shared/service/apiClient";
import { useQuery } from "@tanstack/react-query";
import { ENDPOINTS, QUERYKEYPROVIDER } from "@/config/constants";
import { MovieSchema } from "../types/movies.type";
import type { Movie, MovieSearchParams } from "../types/movies.type";

export const useMoviesQuery = (
  params: MovieSearchParams,
  isEnabled: boolean = true,
) => {
  const fetchData = async () => {
    const { q, ...filters } = params;
    const searchParams = new URLSearchParams();

    // Add valid parameters to query string
    if (q) searchParams.append("q", q);
    if (filters.year) searchParams.append("year", filters.year);
    if (filters.sort) searchParams.append("sort", filters.sort);

    const queryString = searchParams.toString();
    const endpoint = q
      ? `${ENDPOINTS.MOVIES_SEARCH}?${queryString}`
      : `${ENDPOINTS.MOVIES_LIST}${queryString ? `?${queryString}` : ""}`;

    const response = await apiClient.get(
      endpoint,
      MovieSchema,
    );

    return response as Movie[];
  };

  return useQuery({
    queryKey: [QUERYKEYPROVIDER.MOVIES_LIST_DATA, params],
    queryFn: fetchData,
    enabled: isEnabled,
    placeholderData: (prev) => prev,
    // Movies are static for the lifetime of the session — never refetch
    // unless the query key changes (i.e. filters change).
    staleTime: Infinity,
    gcTime: Infinity,
  });
};
