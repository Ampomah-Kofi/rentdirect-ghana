"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface CompareContextValue {
  compareIds: string[];
  addToCompare: (id: string) => void;
  removeFromCompare: (id: string) => void;
  inCompare: (id: string) => boolean;
  clearCompare: () => void;
}

const CompareContext = createContext<CompareContextValue | null>(null);

export function CompareProvider({ children }: { children: ReactNode }) {
  const [compareIds, setCompareIds] = useState<string[]>([]);

  const addToCompare = (id: string) => {
    setCompareIds((prev) => prev.includes(id) || prev.length >= 3 ? prev : [...prev, id]);
  };

  const removeFromCompare = (id: string) => {
    setCompareIds((prev) => prev.filter((x) => x !== id));
  };

  const inCompare = (id: string) => compareIds.includes(id);

  const clearCompare = () => setCompareIds([]);

  return (
    <CompareContext.Provider value={{ compareIds, addToCompare, removeFromCompare, inCompare, clearCompare }}>
      {children}
    </CompareContext.Provider>
  );
}

export function useCompare() {
  const ctx = useContext(CompareContext);
  if (!ctx) throw new Error("useCompare must be used inside CompareProvider");
  return ctx;
}
