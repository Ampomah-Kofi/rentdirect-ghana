"use client";

import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "rentdirect_favorites";

function readStorage(): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? new Set(JSON.parse(raw) as string[]) : new Set();
  } catch {
    return new Set();
  }
}

function writeStorage(ids: Set<string>) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(ids)));
}

export function useFavorites() {
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  useEffect(() => {
    setFavorites(readStorage());
  }, []);

  const toggle = useCallback((id: string) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      writeStorage(next);
      return next;
    });
  }, []);

  const isSaved = useCallback((id: string) => favorites.has(id), [favorites]);

  return { favorites, toggle, isSaved, count: favorites.size };
}
