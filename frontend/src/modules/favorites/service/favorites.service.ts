import apiClient from "@/shared/service/apiClient";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
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

export const useAddFavorite = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (movieId: number) =>
      apiClient.post(endpoints.FAVORITES, FavoriteSchema, { movie_id: movieId }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [queryKeyProvider.FAVORITES_LIST],
      });
    },
  });
};

export const useRemoveFavorite = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (movieId: number) =>
      apiClient.delete(`${endpoints.FAVORITES}/${movieId}`, z.any()),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [queryKeyProvider.FAVORITES_LIST],
      });
    },
  });
};