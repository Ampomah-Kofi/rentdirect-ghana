"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2, CreditCard, FileText, MousePointerClick, Play, RotateCcw, ShieldAlert, UserCog } from "lucide-react";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { useListings } from "@/components/providers/ListingsProvider";
import { usePayments } from "@/components/providers/PaymentsProvider";
import { useReports } from "@/components/providers/ReportsProvider";
import { getListingFee } from "@/lib/monetization";
import type { Room } from "@/lib/types";

const DEMO_ID = "autopilot-listing-001";
const DEMO_LANDLORD_ID = "user-101";

const demoListing: Room = {
  id: DEMO_ID,
  landlord_id: DEMO_LANDLORD_ID,
  landlord_name: "Ama Mensah",
  landlord_phone: "0244123456",
  landlord_ghana_card: "GHA-123456789-0",
  landlord_photo_url: "/favicon.svg",
  title: "Self-contained room near UPSA",
  description: "Clean self-contained room with tiled floor, water, prepaid meter, and direct landlord contact.",
  region: "Greater Accra",
  location: "East Legon",
  address: "Near UPSA gate",
  ghana_post_gps: "GA-123-4567",
  room_type: "Self-Contained",
  advance_months: 6,
  tenancy_duration: "1 year",
  price_per_month: 1200,
  amenities: ["Water Tank", "Prepaid Meter", "Bathroom"],
  photos: [],
  status: "pending",
  is_free_listing: false,
  listing_plan: "featured",
  listing_fee_amount: 100,
  listing_fee_paid: false,
  is_featured: false,
  is_hidden: false,
  created_at: "2026-05-04T15:00:00.000Z",
  updated_at: "2026-05-04T15:00:00.000Z",
};

const script = [
  {
    title: "Landlord starts listing",
    actor: "Landlord",
    icon: FileText,
    typing: "Self-contained room near UPSA",
    detail: "Typing room title, Ghana Card, phone number, price, and selecting Featured plan.",
  },
  {
    title: "Listing submitted",
    actor: "System",
    icon: CheckCircle2,
    typing: "Status: pending admin review",
    detail: "The listing is created as pending, so tenants cannot see it yet.",
  },
  {
    title: "Admin approves",
    actor: "Admin",
    icon: UserCog,
    typing: "Approve + require GHS 100 payment",
    detail: "Admin verifies the landlord and approves the listing for paid activation.",
  },
  {
    title: "Landlord pays with MoMo",
    actor: "Landlord",
    icon: CreditCard,
    typing: "MTN Mobile Money 0244123456",
    detail: "The system creates a receipt reference and moves the listing live.",
  },
  {
    title: "Tenant sees listing",
    actor: "Tenant",
    icon: MousePointerClick,
    typing: "Browse results: featured and visible",
    detail: "The listing is now live, featured, and visible in browse.",
  },
  {
    title: "Tenant submits report",
    actor: "Tenant",
    icon: ShieldAlert,
    typing: "Report: asking for extra inspection fee",
    detail: "A tenant safety report is saved for admin review.",
  },
];

function useTypewriter(text: string, active: boolean) {
  const [shown, setShown] = useState(active ? "" : text);

  useEffect(() => {
    if (!active) {
      setShown(text);
      return;
    }

    setShown("");
    let index = 0;
    const id = setInterval(() => {
      index += 1;
      setShown(text.slice(0, index));
      if (index >= text.length) clearInterval(id);
    }, 32);

    return () => clearInterval(id);
  }, [text, active]);

  return shown;
}

function AutopilotScreen({ step }: { step: number }) {
  const current = script[step];
  const Icon = current.icon;
  const typed = useTypewriter(current.typing, true);

  return (
    <div className="relative min-h-[32rem] overflow-hidden rounded-[2rem] border border-white/10 bg-[#101A18] p-5 text-white shadow-2xl rd-grain">
      <div className="absolute right-8 top-8 h-40 w-40 rounded-full bg-brand/30 blur-3xl" />
      <div className="relative flex items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10">
            <Icon className="h-5 w-5 text-[#F2B84B]" />
          </div>
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[#F2B84B]">{current.actor}</p>
            <h1 className="text-xl font-black">{current.title}</h1>
          </div>
        </div>
        <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-black">
          Step {step + 1}/{script.length}
        </span>
      </div>

      <div className="relative mt-8 grid gap-4 lg:grid-cols-[1fr_0.8fr]">
        <div className="rounded-[1.5rem] border border-white/10 bg-white p-5 text-[#0F172A]">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-brand">Live interaction</p>
          <div className="mt-4 rounded-2xl border border-black/10 bg-surface p-4">
            <p className="text-xs font-bold text-[#64748B]">Typing / clicking now</p>
            <p className="mt-2 min-h-8 font-mono text-sm font-black text-[#0F172A]">
              {typed}
              <span className="animate-pulse text-brand">|</span>
            </p>
          </div>
          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            {["Create listing", "Admin review", "MoMo receipt", "Browse visible"].map((item, index) => (
              <div key={item} className={`rounded-xl border px-3 py-2 text-xs font-bold ${index <= step ? "border-green-200 bg-green-50 text-green-700" : "border-black/10 bg-white text-[#94A3B8]"}`}>
                {index <= step ? "Done: " : "Waiting: "}{item}
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[1.5rem] border border-white/10 bg-white/8 p-5">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-[#F2B84B]">What this proves</p>
          <p className="mt-3 text-sm leading-relaxed text-white/70">{current.detail}</p>
          <div className="mt-5 rounded-2xl border border-white/10 bg-black/15 p-4">
            <p className="text-xs font-black text-white/45">Current generated listing</p>
            <p className="mt-1 text-lg font-black">{demoListing.title}</p>
            <p className="mt-1 text-sm text-white/55">GHS {demoListing.price_per_month.toLocaleString()}/mo - {demoListing.location}</p>
          </div>
        </div>
      </div>

      <div className="pointer-events-none absolute bottom-12 left-[55%] flex h-10 w-10 items-center justify-center rounded-full bg-[#F2B84B] text-[#101A18] shadow-2xl transition-all duration-500" style={{ transform: `translate(${step * 18}px, ${step % 2 === 0 ? -8 : 18}px)` }}>
        <MousePointerClick className="h-5 w-5" />
      </div>
    </div>
  );
}

export default function AutopilotDemoPage() {
  const { listings, createListing, adminApprovePaid, payToGoLive, resetDemoListings } = useListings();
  const { recordPayment, resetPayments } = usePayments();
  const { submitReport, resetReports } = useReports();
  const [step, setStep] = useState(0);
  const [running, setRunning] = useState(false);
  const [events, setEvents] = useState<string[]>([]);

  const listing = useMemo(() => listings.find((item) => item.id === DEMO_ID), [listings]);

  const log = (message: string) => setEvents((prev) => [message, ...prev].slice(0, 8));

  const reset = () => {
    resetDemoListings();
    resetPayments();
    resetReports();
    setStep(0);
    setRunning(false);
    setEvents(["Demo reset. Ready to run autopilot."]);
  };

  useEffect(() => {
    if (!running) return;

    const id = setTimeout(() => {
      if (step === 0) {
        resetDemoListings();
        resetPayments();
        resetReports();
        createListing({ ...demoListing, created_at: new Date().toISOString(), updated_at: new Date().toISOString() });
        log("Typed landlord form and submitted listing.");
      }

      if (step === 1) {
        log("Listing is pending and hidden from browse.");
      }

      if (step === 2) {
        adminApprovePaid(DEMO_ID);
        log("Admin approved listing and requested payment.");
      }

      if (step === 3) {
        const activeListing = listings.find((item) => item.id === DEMO_ID) ?? demoListing;
        const payment = recordPayment({
          listing: activeListing,
          amount: getListingFee(activeListing),
          method: "momo_mtn",
          phone: "0244123456",
        });
        payToGoLive(DEMO_ID);
        log(`MoMo payment recorded: ${payment.reference}.`);
      }

      if (step === 4) {
        log("Tenant can now find the featured listing in browse.");
      }

      if (step === 5) {
        const activeListing = listings.find((item) => item.id === DEMO_ID) ?? demoListing;
        submitReport({
          listing: activeListing,
          reason: "scam",
          details: "Autopilot test report: landlord asked for an extra inspection fee.",
        });
        log("Tenant report submitted to admin queue.");
        setRunning(false);
      }

      setStep((current) => Math.min(script.length - 1, current + 1));
    }, step === 0 ? 500 : 2600);

    return () => clearTimeout(id);
  }, [
    step,
    running,
    listings,
    adminApprovePaid,
    createListing,
    payToGoLive,
    recordPayment,
    resetDemoListings,
    resetPayments,
    resetReports,
    submitReport,
  ]);

  return (
    <div className="min-h-screen bg-surface">
      <Nav />

      <main className="mx-auto max-w-7xl px-4 py-8">
        <div className="mb-6 flex flex-col gap-4 rounded-[1.5rem] border border-black/10 bg-white p-5 shadow-sm lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-brand">Watch me test it</p>
            <h1 className="mt-1 text-3xl font-black text-[#0F172A]">Autopilot product walkthrough</h1>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[#64748B]">
              This page visibly types and clicks through the main flow while also changing real demo state: listing submission, admin approval, payment, browse visibility, and tenant report.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => { setStep(0); setRunning(true); setEvents(["Autopilot started. Watch the screen."]); }}
              className="inline-flex items-center gap-2 rounded-2xl bg-brand px-5 py-3 text-sm font-black text-white hover:bg-brand-hover"
            >
              <Play className="h-4 w-4" />
              Start Autopilot
            </button>
            <button
              onClick={reset}
              className="inline-flex items-center gap-2 rounded-2xl border border-black/10 bg-white px-5 py-3 text-sm font-black text-[#0F172A] hover:border-brand hover:text-brand"
            >
              <RotateCcw className="h-4 w-4" />
              Reset Demo
            </button>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_22rem]">
          <AutopilotScreen step={step} />

          <aside className="space-y-4">
            <div className="rd-card rounded-[1.5rem] p-5">
              <p className="text-sm font-black text-[#0F172A]">Live state</p>
              <div className="mt-4 space-y-2">
                {[
                  { label: "Listing", value: listing ? listing.status : "not created" },
                  { label: "Paid", value: listing?.listing_fee_paid ? "yes" : "no" },
                  { label: "Featured", value: listing?.is_featured ? "yes" : "no" },
                  { label: "Visible", value: listing?.status === "live" && !listing.is_hidden ? "yes" : "no" },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between rounded-xl border border-black/10 bg-white px-3 py-2">
                    <span className="text-xs font-bold text-[#64748B]">{item.label}</span>
                    <span className="text-xs font-black text-[#0F172A]">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rd-card rounded-[1.5rem] p-5">
              <p className="text-sm font-black text-[#0F172A]">Event log</p>
              <div className="mt-4 space-y-2">
                {events.length === 0 ? (
                  <p className="text-xs text-[#94A3B8]">Press Start Autopilot to begin.</p>
                ) : (
                  events.map((event) => (
                    <div key={event} className="rounded-xl bg-surface px-3 py-2 text-xs font-semibold text-[#64748B]">
                      {event}
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="grid gap-2">
              <Link href="/browse" className="inline-flex items-center justify-between rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm font-black text-[#0F172A] hover:text-brand">
                Open Browse <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/admin" className="inline-flex items-center justify-between rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm font-black text-[#0F172A] hover:text-brand">
                Open Admin <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/landlord/dashboard" className="inline-flex items-center justify-between rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm font-black text-[#0F172A] hover:text-brand">
                Open Landlord Dashboard <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </aside>
        </div>
      </main>

      <Footer />
    </div>
  );
}
