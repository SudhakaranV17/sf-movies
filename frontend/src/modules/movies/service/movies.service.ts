import apiClient from "@/shared/service/apiClient";
import { useQuery } from "@tanstack/react-query";
import { endpoints, queryKeyProvider } from "@/config/constants";
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
      ? `${endpoints.MOVIES_SEARCH}?${queryString}`
      : `${endpoints.MOVIES_LIST}${queryString ? `?${queryString}` : ""}`;

    const response = await apiClient.get(
      endpoint,
      MovieSchema,
      true, // isArray
    );

    return response as Movie[];
  };

  return useQuery({
    queryKey: [queryKeyProvider.MOVIES_LIST_DATA, params],
    queryFn: fetchData,
    enabled: isEnabled,
    placeholderData: (prev) => prev,
  });
};
