import type { Amenity, RoomType } from "./ghana-locations";

export type UserRole = "tenant" | "landlord" | "admin";

export interface User {
  id: string;
  name: string;
  phone: string;
  email?: string;
  role: UserRole;
  created_at: string;
}

export type ListingStatus = "pending" | "approved" | "live" | "rejected" | "on_hold";
export type ListingPlan = "launch_free" | "standard" | "featured";

export interface Room {
  id: string;
  landlord_id: string;
  landlord_name: string;
  landlord_phone: string;
  landlord_ghana_card?: string;    // GHA-XXXXXXXXX-X - for fraud tracking, never shown to tenants
  landlord_photo_url?: string;     // passport-size profile photo - for identity verification, never shown to tenants
  title: string;
  description: string;
  region: string;
  location: string;
  address?: string;
  ghana_post_gps?: string;       // e.g. GA-123-4567 - Ghana Post digital address
  latitude?: number;
  longitude?: number;
  room_type: RoomType;
  advance_months?: number;       // how many months advance the landlord requires (Ghana Rent Act max = 6)
  tenancy_duration?: string;     // e.g. "1 year", "6 months"
  price_per_month: number;
  amenities: Amenity[];
  photos: string[];
  status: ListingStatus;
  is_free_listing: boolean;
  listing_plan?: ListingPlan;
  listing_fee_amount?: number;
  listing_fee_paid?: boolean;
  is_featured?: boolean;
  featured_until?: string;
  is_hidden: boolean;
  created_at: string;
  updated_at: string;
  approved_at?: string;
  live_at?: string;
}

export interface Document {
  id: string;
  user_id: string;
  listing_id?: string;
  type: "national_id" | "lease_agreement" | "property_deed" | "utility_bill";
  url: string;
  verified: boolean;
  uploaded_at: string;
}

export type PaymentStatus = "pending" | "paid" | "failed" | "refunded";

export interface Payment {
  id: string;
  listing_id: string;
  landlord_id: string;
  amount: number;
  currency: "GHS";
  status: PaymentStatus;
  method: "momo" | "card" | "bank";
  provider?: "momo_mtn" | "momo_vodafone" | "momo_airteltigo";
  payer_phone?: string;
  reference: string;
  paid_at?: string;
  created_at: string;
}

export type ReportReason =
  | "agent_posing_as_landlord"
  | "excess_advance"
  | "scam"
  | "wrong_price"
  | "wrong_location"
  | "already_rented"
  | "other";

export interface Report {
  id: string;
  listing_id: string;
  reporter_id?: string;
  reporter_phone?: string;
  reason: ReportReason;
  details?: string;
  resolved: boolean;
  created_at: string;
}

export interface ChatMessage {
  id: string;
  conversation_id: string;
  sender: "tenant" | "landlord";
  text: string;
  sent_at: string;
  read: boolean;
}

export interface Conversation {
  id: string;
  listing_id: string;
  tenant_name: string;
  tenant_phone: string;
  landlord_id: string;
  last_message: string;
  last_message_at: string;
  unread_count: number;
}
