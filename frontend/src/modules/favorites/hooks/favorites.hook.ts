import { useEffect } from "react";
import { useFavoritesQuery } from "../service/favorites.service";
import { useFavoritesStore } from "../store/favorites.store";

interface UseFavoritesOptions {
  enabled?: boolean;
}

export const useFavorites = ({ enabled = true }: UseFavoritesOptions = {}) => {
  const setFavorites = useFavoritesStore((state) => state.setFavorites);
  const query = useFavoritesQuery(enabled);

  useEffect(() => {
    if (query.data) {
      setFavorites(query.data);
    }
  }, [query.data, setFavorites]);

  return query;
};