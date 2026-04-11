import toast from "react-hot-toast";
import apiClient from "@/shared/service/apiClient";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { ENDPOINTS, QUERYKEYPROVIDER } from "@/config/constants";
import { FavoriteSchema } from "../types/favorites.type";
import type { Favorite } from "../types/favorites.type";

export const useFavoritesQuery = (enabled = true) => {
  const fetchData = async () => {
    const response = await apiClient.get(
      ENDPOINTS.FAVORITES,
      FavoriteSchema,
      true,
    );
    return response as Favorite[];
  };

  return useQuery({
    queryKey: [QUERYKEYPROVIDER.FAVORITES_LIST],
    queryFn: fetchData,
    enabled,
    placeholderData: (prev) => prev,
  });
};

export const useAddFavorite = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: [QUERYKEYPROVIDER.ADD_FAVORITE],
    mutationFn: (movieId: number) =>
      apiClient.post(ENDPOINTS.FAVORITES, FavoriteSchema, {
        movie_id: movieId,
      }),
    onSuccess: () => {
      toast.success("Added to favorites");
      queryClient.invalidateQueries({
        queryKey: [QUERYKEYPROVIDER.FAVORITES_LIST],
      });
    },
    onError: () => {
      toast.error("Failed to add favorite");
    },
  });
};

export const useRemoveFavorite = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: [QUERYKEYPROVIDER.REMOVE_FAVORITE],
    mutationFn: (movieId: number) =>
      apiClient.delete(`${ENDPOINTS.FAVORITES}/${movieId}`, z.any()),
    onSuccess: () => {
      toast.success("Removed from favorites");
      queryClient.invalidateQueries({
        queryKey: [QUERYKEYPROVIDER.FAVORITES_LIST],
      });
    },
    onError: () => {
      toast.error("Failed to remove favorite");
    },
  });
};