"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { MOCK_LISTINGS } from "@/lib/mock-data";
import {
  addListing,
  approveListingForPayment,
  approveListingFree,
  payListingToGoLive,
  rejectListing,
  toggleListingHidden,
  toggleListingHold,
  updateListingById,
} from "@/lib/listing-workflow";
import type { Room } from "@/lib/types";

const STORAGE_KEY = "rentdirect_listings";

interface ListingsContextValue {
  listings: Room[];
  /** Landlord: submit a new listing for admin review */
  createListing: (listing: Room) => void;
  /** Admin: approve -> paid path */
  adminApprovePaid: (id: string) => void;
  /** Admin: approve -> free, goes live immediately */
  adminApproveFree: (id: string) => void;
  /** Admin: reject */
  adminReject: (id: string) => void;
  /** Landlord: toggle hide/show */
  toggleHide: (id: string) => void;
  /** Landlord: toggle on hold/live */
  toggleHold: (id: string) => void;
  /** Landlord: pay listing fee -> goes live */
  payToGoLive: (id: string) => void;
  /** Demo: restore seed listings */
  resetDemoListings: () => void;
}

const ListingsContext = createContext<ListingsContextValue | null>(null);

export function ListingsProvider({ children }: { children: ReactNode }) {
  const [listings, setListings] = useState<Room[]>(MOCK_LISTINGS);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setListings(JSON.parse(saved) as Room[]);
    } catch {
      setListings(MOCK_LISTINGS);
    } finally {
      setLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (!loaded) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(listings));
  }, [listings, loaded]);

  const now = () => new Date().toISOString();

  const createListing = (listing: Room) =>
    setListings((prev) => addListing(prev, listing));

  const adminApprovePaid = (id: string) =>
    setListings((prev) => updateListingById(prev, id, (listing) => approveListingForPayment(listing, now())));

  const adminApproveFree = (id: string) =>
    setListings((prev) => updateListingById(prev, id, (listing) => approveListingFree(listing, now())));

  const adminReject = (id: string) =>
    setListings((prev) => updateListingById(prev, id, rejectListing));

  const toggleHide = (id: string) =>
    setListings((prev) => updateListingById(prev, id, toggleListingHidden));

  const toggleHold = (id: string) =>
    setListings((prev) => updateListingById(prev, id, toggleListingHold));

  const payToGoLive = (id: string) =>
    setListings((prev) => updateListingById(prev, id, (listing) => payListingToGoLive(listing, now())));

  const resetDemoListings = () => {
    localStorage.removeItem(STORAGE_KEY);
    setListings(MOCK_LISTINGS);
  };

  return (
    <ListingsContext.Provider value={{
      listings,
      createListing,
      adminApprovePaid,
      adminApproveFree,
      adminReject,
      toggleHide,
      toggleHold,
      payToGoLive,
      resetDemoListings,
    }}>
      {children}
    </ListingsContext.Provider>
  );
}

export function useListings() {
  const ctx = useContext(ListingsContext);
  if (!ctx) throw new Error("useListings must be used inside ListingsProvider");
  return ctx;
}
