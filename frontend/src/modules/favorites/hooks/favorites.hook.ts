import { useEffect } from "react";
import { useFavoritesQuery } from "../service/favorites.service";
import { useFavoritesStore } from "../store/favorites.store";

export const useFavorites = () => {
  const setFavorites = useFavoritesStore((state) => state.setFavorites);
  const query = useFavoritesQuery();

  useEffect(() => {
    if (query.data) {
      setFavorites(query.data);
    }
  }, [query.data, setFavorites]);

  return query;
};