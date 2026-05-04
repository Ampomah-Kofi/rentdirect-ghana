import assert from "node:assert/strict";
import {
  addListing,
  approveListingForPayment,
  approveListingFree,
  getBrowsableListings,
  payListingToGoLive,
  rejectListing,
  toggleListingHidden,
  toggleListingHold,
  updateListingById,
} from "../lib/listing-workflow.ts";
import { getPendingListingRevenue } from "../lib/monetization.ts";
import type { Room } from "../lib/types.ts";
import type { TestCase } from "./monetization.test.ts";

const STAMP = "2026-05-04T12:00:00.000Z";

function makeRoom(overrides: Partial<Room> = {}): Room {
  return {
    id: "listing-flow",
    landlord_id: "landlord-flow",
    landlord_name: "Ama Mensah",
    landlord_phone: "0244123456",
    landlord_ghana_card: "GHA-123456789-0",
    landlord_photo_url: "/test-passport.jpg",
    title: "Self-contained room near campus",
    description: "Clean self-contained room with water and meter.",
    region: "Greater Accra",
    location: "East Legon",
    room_type: "Self-Contained",
    advance_months: 6,
    tenancy_duration: "1 year",
    price_per_month: 1200,
    amenities: [],
    photos: ["/test-room.jpg"],
    status: "pending",
    is_free_listing: false,
    listing_plan: "standard",
    listing_fee_amount: 50,
    listing_fee_paid: false,
    is_featured: false,
    is_hidden: false,
    created_at: STAMP,
    updated_at: STAMP,
    ...overrides,
  };
}

export const listingWorkflowTests: TestCase[] = [
  {
    name: "full paid listing flow goes from pending to browsable live",
    run: () => {
      const submitted = makeRoom();
      let listings = addListing([], submitted);

      assert.equal(listings[0].status, "pending");
      assert.deepEqual(getBrowsableListings(listings), []);

      listings = updateListingById(listings, submitted.id, (listing) => approveListingForPayment(listing, STAMP));
      assert.equal(listings[0].status, "approved");
      assert.equal(listings[0].listing_fee_paid, false);
      assert.equal(getPendingListingRevenue(listings), 50);
      assert.deepEqual(getBrowsableListings(listings), []);

      listings = updateListingById(listings, submitted.id, (listing) => payListingToGoLive(listing, STAMP));
      assert.equal(listings[0].status, "live");
      assert.equal(listings[0].listing_fee_paid, true);
      assert.equal(getPendingListingRevenue(listings), 0);
      assert.equal(getBrowsableListings(listings).length, 1);
    },
  },
  {
    name: "featured paid listing becomes featured after payment",
    run: () => {
      const submitted = makeRoom({ listing_plan: "featured", listing_fee_amount: 100 });
      const approved = approveListingForPayment(submitted, STAMP);
      const live = payListingToGoLive(approved, STAMP);

      assert.equal(approved.listing_fee_amount, 100);
      assert.equal(live.status, "live");
      assert.equal(live.is_featured, true);
      assert.ok(live.featured_until);
    },
  },
  {
    name: "free approval skips payment and goes live immediately",
    run: () => {
      const live = approveListingFree(makeRoom({ listing_plan: "standard" }), STAMP);

      assert.equal(live.status, "live");
      assert.equal(live.listing_plan, "launch_free");
      assert.equal(live.listing_fee_amount, 0);
      assert.equal(live.listing_fee_paid, true);
      assert.equal(live.live_at, STAMP);
    },
  },
  {
    name: "rejected listings never appear in browse",
    run: () => {
      const rejected = rejectListing(makeRoom());

      assert.equal(rejected.status, "rejected");
      assert.equal(getBrowsableListings([rejected]).length, 0);
    },
  },
  {
    name: "hidden live listings are removed from browse results",
    run: () => {
      const live = payListingToGoLive(approveListingForPayment(makeRoom(), STAMP), STAMP);
      const hidden = toggleListingHidden(live);

      assert.equal(live.is_hidden, false);
      assert.equal(hidden.is_hidden, true);
      assert.equal(getBrowsableListings([live]).length, 1);
      assert.equal(getBrowsableListings([hidden]).length, 0);
    },
  },
  {
    name: "on hold toggle pauses and resumes a live listing",
    run: () => {
      const live = payListingToGoLive(approveListingForPayment(makeRoom(), STAMP), STAMP);
      const onHold = toggleListingHold(live);
      const resumed = toggleListingHold(onHold);

      assert.equal(onHold.status, "on_hold");
      assert.equal(resumed.status, "live");
    },
  },
];
