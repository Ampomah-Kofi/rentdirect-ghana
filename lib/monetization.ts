import type { ListingPlan, Room } from "./types";

export interface ListingPlanConfig {
  id: ListingPlan;
  name: string;
  price: number;
  durationDays: number;
  tagline: string;
  bestFor: string;
  promise: string;
  benefits: string[];
}

export const LISTING_PLANS: ListingPlanConfig[] = [
  {
    id: "launch_free",
    name: "Launch Free",
    price: 0,
    durationDays: 30,
    tagline: "Good for first-time landlords while RentDirect grows.",
    bestFor: "Testing RentDirect with one room",
    promise: "A no-risk way to prove direct landlord-to-tenant demand during launch.",
    benefits: ["Admin review", "Direct tenant calls", "Basic listing for 30 days"],
  },
  {
    id: "standard",
    name: "Standard",
    price: 50,
    durationDays: 45,
    tagline: "The main paid listing for serious landlords.",
    bestFor: "Most landlords with one available room",
    promise: "One small fee to publish, receive direct enquiries, and avoid agent dependency.",
    benefits: ["Ghana Card reviewed", "Live for 45 days", "Dashboard views", "MoMo activation"],
  },
  {
    id: "featured",
    name: "Featured",
    price: 100,
    durationDays: 30,
    tagline: "Best visibility in busy areas like Accra and Kumasi.",
    bestFor: "Competitive areas or urgent occupancy",
    promise: "Higher placement for landlords who want faster attention from serious tenants.",
    benefits: ["Priority placement", "Featured badge", "Live for 30 days", "Top of browse results"],
  },
];

export function getListingPlan(plan: ListingPlan = "standard"): ListingPlanConfig {
  return LISTING_PLANS.find((p) => p.id === plan) ?? LISTING_PLANS[1];
}

export function isFeaturedListing(listing: {
  listing_plan?: ListingPlan;
  is_featured?: boolean;
  featured_until?: string;
}): boolean {
  if (listing.listing_plan !== "featured" && !listing.is_featured) return false;
  if (!listing.featured_until) return true;
  return new Date(listing.featured_until).getTime() > Date.now();
}

export function getFeaturedUntil(days = 30): string {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString();
}

export function getListingFee(listing: Pick<Room, "listing_fee_amount" | "listing_plan">): number {
  return listing.listing_fee_amount ?? getListingPlan(listing.listing_plan).price;
}

export function getPaidListingRevenue(listings: Room[]): number {
  return listings.reduce((sum, listing) => {
    if (!listing.listing_fee_paid) return sum;
    return sum + getListingFee(listing);
  }, 0);
}

export function getPendingListingRevenue(listings: Room[]): number {
  return listings.reduce((sum, listing) => {
    if (listing.status !== "approved" || listing.is_free_listing || listing.listing_fee_paid) return sum;
    return sum + getListingFee(listing);
  }, 0);
}
