import assert from "node:assert/strict";
import {
  createListingReport,
  getOpenReports,
  REPORT_REASON_LABELS,
  resolveReport,
} from "../lib/reports.ts";
import type { Room } from "../lib/types.ts";
import type { TestCase } from "./monetization.test.ts";

const STAMP = "2026-05-04T13:00:00.000Z";

function makeRoom(overrides: Partial<Room> = {}): Room {
  return {
    id: "listing-report",
    landlord_id: "landlord-report",
    landlord_name: "Kofi Owusu",
    landlord_phone: "0244123456",
    title: "Room with wrong advance",
    description: "Test listing for reports",
    region: "Ashanti",
    location: "Kumasi",
    room_type: "Single Room",
    price_per_month: 800,
    amenities: [],
    photos: [],
    status: "live",
    is_free_listing: false,
    listing_plan: "standard",
    listing_fee_amount: 50,
    listing_fee_paid: true,
    is_hidden: false,
    created_at: STAMP,
    updated_at: STAMP,
    ...overrides,
  };
}

export const reportTests: TestCase[] = [
  {
    name: "tenant report captures listing, reason, details, and open status",
    run: () => {
      const report = createListingReport({
        listing: makeRoom(),
        reason: "excess_advance",
        details: "Landlord asked for 12 months upfront.",
        timestamp: STAMP,
      });

      assert.equal(report.listing_id, "listing-report");
      assert.equal(report.reason, "excess_advance");
      assert.equal(report.details, "Landlord asked for 12 months upfront.");
      assert.equal(report.resolved, false);
      assert.equal(report.created_at, STAMP);
    },
  },
  {
    name: "open reports exclude resolved reports",
    run: () => {
      const first = createListingReport({ listing: makeRoom({ id: "one" }), reason: "scam", timestamp: STAMP });
      const second = createListingReport({ listing: makeRoom({ id: "two" }), reason: "wrong_price", timestamp: STAMP });
      const resolved = resolveReport([first, second], first.id);

      assert.equal(getOpenReports(resolved).length, 1);
      assert.equal(getOpenReports(resolved)[0].listing_id, "two");
    },
  },
  {
    name: "all report reasons have admin labels",
    run: () => {
      assert.equal(REPORT_REASON_LABELS.agent_posing_as_landlord, "Agent posing as landlord");
      assert.equal(REPORT_REASON_LABELS.excess_advance, "Demanding more than 6 months advance");
      assert.equal(REPORT_REASON_LABELS.scam, "Suspected scam or fraud");
      assert.equal(REPORT_REASON_LABELS.wrong_price, "Wrong price listed");
      assert.equal(REPORT_REASON_LABELS.wrong_location, "Wrong location");
      assert.equal(REPORT_REASON_LABELS.already_rented, "Already rented out");
      assert.equal(REPORT_REASON_LABELS.other, "Other reason");
    },
  },
];
