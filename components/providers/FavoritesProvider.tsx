"use client";

import { createContext, useContext } from "react";
import { useFavorites } from "@/lib/useFavorites";

interface FavoritesCtx {
  favorites: Set<string>;
  toggle: (id: string) => void;
  isSaved: (id: string) => boolean;
  count: number;
}

const FavoritesContext = createContext<FavoritesCtx>({
  favorites: new Set(),
  toggle: () => {},
  isSaved: () => false,
  count: 0,
});

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const value = useFavorites();
  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavoritesContext() {
  return useContext(FavoritesContext);
}
