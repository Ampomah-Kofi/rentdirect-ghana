import assert from "node:assert/strict";
import {
  getFeaturedUntil,
  getListingFee,
  getListingPlan,
  getPaidListingRevenue,
  getPendingListingRevenue,
  isFeaturedListing,
} from "../lib/monetization.ts";
import type { Room } from "../lib/types.ts";

export type TestCase = {
  name: string;
  run: () => void;
};

function makeRoom(overrides: Partial<Room> = {}): Room {
  return {
    id: "listing-test",
    landlord_id: "landlord-test",
    landlord_name: "Test Landlord",
    landlord_phone: "0244123456",
    title: "Test Room",
    description: "Clean room for testing",
    region: "Greater Accra",
    location: "East Legon",
    room_type: "Single Room",
    price_per_month: 1000,
    amenities: [],
    photos: [],
    status: "pending",
    is_free_listing: false,
    listing_plan: "standard",
    listing_fee_amount: 50,
    listing_fee_paid: false,
    is_hidden: false,
    created_at: "2026-01-01T00:00:00.000Z",
    updated_at: "2026-01-01T00:00:00.000Z",
    ...overrides,
  };
}

export const monetizationTests: TestCase[] = [
  {
    name: "listing plans expose the expected launch pricing",
    run: () => {
      assert.equal(getListingPlan("launch_free").price, 0);
      assert.equal(getListingPlan("standard").price, 50);
      assert.equal(getListingPlan("featured").price, 100);
    },
  },
  {
    name: "unknown or missing listing plans fall back to Standard",
    run: () => {
      assert.equal(getListingPlan().id, "standard");
      assert.equal(getListingPlan("unknown" as never).id, "standard");
    },
  },
  {
    name: "listing fee prefers the stored approved fee",
    run: () => {
      const discounted = makeRoom({ listing_plan: "featured", listing_fee_amount: 75 });
      const normalFeatured = makeRoom({ listing_plan: "featured", listing_fee_amount: undefined });

      assert.equal(getListingFee(discounted), 75);
      assert.equal(getListingFee(normalFeatured), 100);
    },
  },
  {
    name: "paid revenue only counts listings with completed payment",
    run: () => {
      const rooms = [
        makeRoom({ id: "paid-standard", listing_fee_paid: true, listing_fee_amount: 50 }),
        makeRoom({ id: "paid-featured", listing_plan: "featured", listing_fee_paid: true, listing_fee_amount: 100 }),
        makeRoom({ id: "approved-unpaid", status: "approved", listing_fee_paid: false, listing_fee_amount: 50 }),
        makeRoom({ id: "free-live", is_free_listing: true, listing_fee_paid: true, listing_fee_amount: 0 }),
      ];

      assert.equal(getPaidListingRevenue(rooms), 150);
    },
  },
  {
    name: "pending revenue only counts approved paid listings awaiting payment",
    run: () => {
      const rooms = [
        makeRoom({ id: "approved-standard", status: "approved", listing_fee_paid: false, listing_fee_amount: 50 }),
        makeRoom({ id: "approved-featured", status: "approved", listing_plan: "featured", listing_fee_paid: false, listing_fee_amount: 100 }),
        makeRoom({ id: "pending-review", status: "pending", listing_fee_paid: false, listing_fee_amount: 50 }),
        makeRoom({ id: "approved-free", status: "approved", is_free_listing: true, listing_fee_paid: false, listing_fee_amount: 0 }),
      ];

      assert.equal(getPendingListingRevenue(rooms), 150);
    },
  },
  {
    name: "featured listings expire after their featured_until date",
    run: () => {
      assert.equal(isFeaturedListing(makeRoom({ listing_plan: "featured", featured_until: "2099-01-01T00:00:00.000Z" })), true);
      assert.equal(isFeaturedListing(makeRoom({ listing_plan: "featured", featured_until: "2000-01-01T00:00:00.000Z" })), false);
      assert.equal(isFeaturedListing(makeRoom({ listing_plan: "standard", is_featured: false })), false);
    },
  },
  {
    name: "getFeaturedUntil returns a future ISO timestamp",
    run: () => {
      const timestamp = getFeaturedUntil(7);
      const delta = new Date(timestamp).getTime() - Date.now();

      assert.match(timestamp, /^\d{4}-\d{2}-\d{2}T/);
      assert.ok(delta > 6 * 24 * 60 * 60 * 1000);
      assert.ok(delta <= 8 * 24 * 60 * 60 * 1000);
    },
  },
];
