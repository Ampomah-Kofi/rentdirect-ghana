import { getFeaturedUntil, getListingPlan } from "./monetization.ts";
import type { ListingStatus, Room } from "./types.ts";

export function addListing(listings: Room[], listing: Room): Room[] {
  return [listing, ...listings];
}

export function approveListingForPayment(listing: Room, timestamp = new Date().toISOString()): Room {
  const plan = getListingPlan(listing.listing_plan);

  return {
    ...listing,
    status: "approved",
    is_free_listing: false,
    listing_fee_amount: plan.price,
    listing_fee_paid: false,
    approved_at: timestamp,
  };
}

export function approveListingFree(listing: Room, timestamp = new Date().toISOString()): Room {
  return {
    ...listing,
    status: "live",
    is_free_listing: true,
    listing_plan: "launch_free",
    listing_fee_amount: 0,
    listing_fee_paid: true,
    is_featured: false,
    approved_at: timestamp,
    live_at: timestamp,
  };
}

export function rejectListing(listing: Room): Room {
  return {
    ...listing,
    status: "rejected",
  };
}

export function toggleListingHidden(listing: Room): Room {
  return {
    ...listing,
    is_hidden: !listing.is_hidden,
  };
}

export function toggleListingHold(listing: Room): Room {
  if (listing.status === "on_hold") return { ...listing, status: "live" as ListingStatus };
  if (listing.status === "live") return { ...listing, status: "on_hold" as ListingStatus };
  return listing;
}

export function payListingToGoLive(listing: Room, timestamp = new Date().toISOString()): Room {
  const plan = getListingPlan(listing.listing_plan);

  return {
    ...listing,
    status: "live",
    listing_fee_amount: plan.price,
    listing_fee_paid: true,
    is_featured: plan.id === "featured",
    featured_until: plan.id === "featured" ? getFeaturedUntil(plan.durationDays) : listing.featured_until,
    live_at: timestamp,
  };
}

export function updateListingById(listings: Room[], id: string, updater: (listing: Room) => Room): Room[] {
  return listings.map((listing) => (listing.id === id ? updater(listing) : listing));
}

export function getBrowsableListings(listings: Room[]): Room[] {
  return listings.filter((listing) => listing.status === "live" && !listing.is_hidden);
}
