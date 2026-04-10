import apiClient from "@/shared/service/apiClient";
import { useQuery } from "@tanstack/react-query";
import { endpoints, queryKeyProvider } from "@/config/constants";
import { FavoriteSchema } from "../types/favorites.type";
import type { Favorite } from "../types/favorites.type";

export const useFavoritesQuery = () => {
  const fetchData = async () => {
    const response = await apiClient.get(
      endpoints.FAVORITES,
      FavoriteSchema,
      true,
    );
    return response as Favorite[];
  };

  return useQuery({
    queryKey: [queryKeyProvider.FAVORITES_LIST],
    queryFn: fetchData,
    placeholderData: (prev) => prev,
  });
};
