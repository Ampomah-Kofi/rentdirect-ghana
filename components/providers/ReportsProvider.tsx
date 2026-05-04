"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { createListingReport, resolveReport } from "@/lib/reports";
import type { Report, ReportReason, Room } from "@/lib/types";

const STORAGE_KEY = "rentdirect_reports";

interface ReportsContextValue {
  reports: Report[];
  submitReport: (input: { listing: Room; reason: ReportReason; details?: string; reporterPhone?: string }) => Report;
  resolveReportById: (id: string) => void;
  resetReports: () => void;
}

const ReportsContext = createContext<ReportsContextValue | null>(null);

export function ReportsProvider({ children }: { children: ReactNode }) {
  const [reports, setReports] = useState<Report[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setReports(JSON.parse(saved) as Report[]);
    } catch {
      setReports([]);
    } finally {
      setLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (!loaded) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(reports));
  }, [reports, loaded]);

  const submitReport: ReportsContextValue["submitReport"] = (input) => {
    const report = createListingReport(input);
    setReports((prev) => [report, ...prev]);
    return report;
  };

  const resolveReportById = (id: string) =>
    setReports((prev) => resolveReport(prev, id));

  const resetReports = () => {
    localStorage.removeItem(STORAGE_KEY);
    setReports([]);
  };

  return (
    <ReportsContext.Provider value={{ reports, submitReport, resolveReportById, resetReports }}>
      {children}
    </ReportsContext.Provider>
  );
}

export function useReports() {
  const ctx = useContext(ReportsContext);
  if (!ctx) throw new Error("useReports must be used inside ReportsProvider");
  return ctx;
}
