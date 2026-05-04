"use client";

import Link from "next/link";
import { X, GitCompare } from "lucide-react";
import { useCompare } from "@/components/providers/CompareProvider";
import { useListings } from "@/components/providers/ListingsProvider";

export default function CompareBar() {
  const { compareIds, removeFromCompare, clearCompare } = useCompare();
  const { listings } = useListings();

  if (compareIds.length === 0) return null;

  const items = compareIds.map((id) => listings.find((l) => l.id === id)).filter(Boolean);

  return (
    <div className="fixed bottom-16 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none">
      <div className="pointer-events-auto bg-gray-900 text-white rounded-2xl shadow-2xl px-4 py-3 flex items-center gap-3 max-w-lg w-full border border-gray-700">
        <GitCompare className="w-4 h-4 text-brand shrink-0" />
        <div className="flex items-center gap-2 flex-1 min-w-0 overflow-x-auto">
          {items.map((l) => l && (
            <div key={l.id} className="flex items-center gap-1.5 bg-gray-800 rounded-xl px-2.5 py-1.5 shrink-0">
              <span className="text-xs font-medium truncate max-w-[100px]">{l.title}</span>
              <button
                onClick={() => removeFromCompare(l.id)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
          {compareIds.length < 3 && (
            <span className="text-xs text-gray-500 shrink-0">
              +{3 - compareIds.length} more
            </span>
          )}
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {compareIds.length >= 2 && (
            <Link
              href={`/compare?ids=${compareIds.join(",")}`}
              className="bg-brand text-white text-xs font-bold px-3 py-1.5 rounded-xl hover:bg-brand-hover transition-colors"
            >
              Compare
            </Link>
          )}
          <button onClick={clearCompare} className="text-gray-400 hover:text-white transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
