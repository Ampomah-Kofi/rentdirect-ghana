import type { Payment, Room } from "./types.ts";

export type MobileMoneyMethod = "momo_mtn" | "momo_vodafone" | "momo_airteltigo";

export const PAYMENT_METHOD_LABELS: Record<MobileMoneyMethod, string> = {
  momo_mtn: "MTN Mobile Money",
  momo_vodafone: "Vodafone Cash",
  momo_airteltigo: "AirtelTigo Money",
};

export function createPayment(input: {
  listing: Room;
  amount: number;
  method: MobileMoneyMethod;
  phone: string;
  timestamp?: string;
}): Payment {
  const timestamp = input.timestamp ?? new Date().toISOString();
  const randomPart = globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`;

  return {
    id: `payment-${randomPart}`,
    listing_id: input.listing.id,
    landlord_id: input.listing.landlord_id,
    amount: input.amount,
    currency: "GHS",
    status: "paid",
    method: "momo",
    provider: input.method,
    payer_phone: input.phone,
    reference: `RD-${randomPart.toString().slice(0, 8).toUpperCase()}`,
    paid_at: timestamp,
    created_at: timestamp,
  };
}

export function getPaymentsForLandlord(payments: Payment[], landlordId: string): Payment[] {
  return payments.filter((payment) => payment.landlord_id === landlordId);
}

export function getPaymentsForListing(payments: Payment[], listingId: string): Payment[] {
  return payments.filter((payment) => payment.listing_id === listingId);
}

export function getPaidPaymentTotal(payments: Payment[]): number {
  return payments.reduce((sum, payment) => (
    payment.status === "paid" ? sum + payment.amount : sum
  ), 0);
}
