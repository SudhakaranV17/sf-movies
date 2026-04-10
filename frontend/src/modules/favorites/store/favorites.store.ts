import { create } from "zustand";
import type { Favorite } from "../types/favorites.type";

interface FavoritesState {
  favorites: Favorite[];
  setFavorites: (favorites: Favorite[]) => void;
}

export const useFavoritesStore = create<FavoritesState>((set) => ({
  favorites: [],
  setFavorites: (favorites) => set({ favorites }),
}));