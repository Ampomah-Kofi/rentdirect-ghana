import type { Report, ReportReason, Room } from "./types.ts";

export const REPORT_REASON_LABELS: Record<ReportReason, string> = {
  agent_posing_as_landlord: "Agent posing as landlord",
  excess_advance: "Demanding more than 6 months advance",
  scam: "Suspected scam or fraud",
  wrong_price: "Wrong price listed",
  wrong_location: "Wrong location",
  already_rented: "Already rented out",
  other: "Other reason",
};

export function createListingReport(input: {
  listing: Room;
  reason: ReportReason;
  details?: string;
  reporterPhone?: string;
  timestamp?: string;
}): Report {
  const timestamp = input.timestamp ?? new Date().toISOString();
  const randomPart = globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`;

  return {
    id: `report-${randomPart}`,
    listing_id: input.listing.id,
    reporter_phone: input.reporterPhone,
    reason: input.reason,
    details: input.details?.trim() || undefined,
    resolved: false,
    created_at: timestamp,
  };
}

export function resolveReport(reports: Report[], id: string): Report[] {
  return reports.map((report) => (
    report.id === id ? { ...report, resolved: true } : report
  ));
}

export function getOpenReports(reports: Report[]): Report[] {
  return reports.filter((report) => !report.resolved);
}
