import assert from "node:assert/strict";
import {
  createPayment,
  getPaidPaymentTotal,
  getPaymentsForLandlord,
  getPaymentsForListing,
  PAYMENT_METHOD_LABELS,
} from "../lib/payments.ts";
import type { Room } from "../lib/types.ts";
import type { TestCase } from "./monetization.test.ts";

const STAMP = "2026-05-04T14:00:00.000Z";

function makeRoom(overrides: Partial<Room> = {}): Room {
  return {
    id: "listing-payment",
    landlord_id: "landlord-payment",
    landlord_name: "Yaw Boateng",
    landlord_phone: "0244123456",
    title: "Paid listing",
    description: "Payment test listing",
    region: "Greater Accra",
    location: "Madina",
    room_type: "Single Room",
    price_per_month: 900,
    amenities: [],
    photos: [],
    status: "approved",
    is_free_listing: false,
    listing_plan: "standard",
    listing_fee_amount: 50,
    listing_fee_paid: false,
    is_hidden: false,
    created_at: STAMP,
    updated_at: STAMP,
    ...overrides,
  };
}

export const paymentTests: TestCase[] = [
  {
    name: "payment captures listing, landlord, amount, method, and reference",
    run: () => {
      const payment = createPayment({
        listing: makeRoom(),
        amount: 50,
        method: "momo_mtn",
        phone: "0244123456",
        timestamp: STAMP,
      });

      assert.equal(payment.listing_id, "listing-payment");
      assert.equal(payment.landlord_id, "landlord-payment");
      assert.equal(payment.amount, 50);
      assert.equal(payment.currency, "GHS");
      assert.equal(payment.status, "paid");
      assert.equal(payment.method, "momo");
      assert.equal(payment.provider, "momo_mtn");
      assert.equal(payment.payer_phone, "0244123456");
      assert.match(payment.reference, /^RD-/);
      assert.equal(payment.paid_at, STAMP);
    },
  },
  {
    name: "paid payment total ignores failed and pending payments",
    run: () => {
      const paid = createPayment({ listing: makeRoom({ id: "paid" }), amount: 50, method: "momo_mtn", phone: "0244123456", timestamp: STAMP });
      const failed = { ...paid, id: "failed", listing_id: "failed", status: "failed" as const, amount: 100 };
      const pending = { ...paid, id: "pending", listing_id: "pending", status: "pending" as const, amount: 100 };

      assert.equal(getPaidPaymentTotal([paid, failed, pending]), 50);
    },
  },
  {
    name: "payments can be filtered by landlord and listing",
    run: () => {
      const first = createPayment({ listing: makeRoom({ id: "one", landlord_id: "landlord-a" }), amount: 50, method: "momo_mtn", phone: "0244123456", timestamp: STAMP });
      const second = createPayment({ listing: makeRoom({ id: "two", landlord_id: "landlord-b" }), amount: 100, method: "momo_vodafone", phone: "0200000000", timestamp: STAMP });

      assert.equal(getPaymentsForLandlord([first, second], "landlord-a").length, 1);
      assert.equal(getPaymentsForListing([first, second], "two").length, 1);
    },
  },
  {
    name: "mobile money methods have user-facing labels",
    run: () => {
      assert.equal(PAYMENT_METHOD_LABELS.momo_mtn, "MTN Mobile Money");
      assert.equal(PAYMENT_METHOD_LABELS.momo_vodafone, "Vodafone Cash");
      assert.equal(PAYMENT_METHOD_LABELS.momo_airteltigo, "AirtelTigo Money");
    },
  },
];
