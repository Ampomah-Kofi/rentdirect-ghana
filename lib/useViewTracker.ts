"use client";

import { useEffect } from "react";

const STORAGE_KEY = "rentdirect_views";

function getViews(): Record<string, number> {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "{}");
  } catch {
    return {};
  }
}

/** Call on listing detail page mount - records one view per session per listing */
export function useRecordView(listingId: string) {
  useEffect(() => {
    if (!listingId) return;
    const sessionKey = `view_seen_${listingId}`;
    if (sessionStorage.getItem(sessionKey)) return; // already counted this session
    sessionStorage.setItem(sessionKey, "1");
    const views = getViews();
    views[listingId] = (views[listingId] ?? 0) + 1;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(views));
  }, [listingId]);
}

/** Returns view count for a listing (0 if none) */
export function getViewCount(listingId: string): number {
  const views = getViews();
  return views[listingId] ?? 0;
}

/** Returns total views across all listings for a given landlord's listing IDs */
export function getTotalViews(listingIds: string[]): number {
  const views = getViews();
  return listingIds.reduce((sum, id) => sum + (views[id] ?? 0), 0);
}

/** Returns per-listing view map for a set of IDs */
export function getViewsForListings(listingIds: string[]): Record<string, number> {
  const views = getViews();
  const result: Record<string, number> = {};
  listingIds.forEach((id) => { result[id] = views[id] ?? 0; });
  return result;
}
