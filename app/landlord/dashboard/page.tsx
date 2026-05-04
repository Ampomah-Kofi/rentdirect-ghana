"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, PlusCircle, Home, PauseCircle, PlayCircle, ExternalLink, X, CheckCircle, Copy, Smartphone } from "lucide-react";
import type { Payment, Room, ListingStatus } from "@/lib/types";
import { useListings } from "@/components/providers/ListingsProvider";
import { usePayments } from "@/components/providers/PaymentsProvider";
import { getTotalViews, getViewsForListings } from "@/lib/useViewTracker";
import { getListingFee, getListingPlan, getPaidListingRevenue, isFeaturedListing } from "@/lib/monetization";
import { getPaidPaymentTotal, getPaymentsForLandlord, PAYMENT_METHOD_LABELS, type MobileMoneyMethod } from "@/lib/payments";
import Switch from "@/components/ui/Switch";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

const LANDLORD_ID = "user-101";

type PayStep = "select" | "confirm" | "done";

function PaymentModal({
  listing,
  onClose,
  onSuccess,
}: {
  listing: Room;
  onClose: () => void;
  onSuccess: (input: { listing: Room; amount: number; method: MobileMoneyMethod; phone: string }) => string;
}) {
  const [step, setStep] = useState<PayStep>("select");
  const [method, setMethod] = useState<MobileMoneyMethod | "">("");
  const [phone, setPhone] = useState("");
  const [paying, setPaying] = useState(false);
  const [receiptReference, setReceiptReference] = useState("");
  const plan = getListingPlan(listing.listing_plan);
  const fee = getListingFee(listing);

  const METHODS = [
    { id: "momo_mtn",       label: "MTN Mobile Money",       emoji: "MTN", color: "border-yellow-400 bg-yellow-50 text-yellow-800" },
    { id: "momo_vodafone",  label: "Vodafone Cash",           emoji: "TC", color: "border-red-400 bg-red-50 text-red-800" },
    { id: "momo_airteltigo",label: "AirtelTigo Money",        emoji: "AT", color: "border-blue-400 bg-blue-50 text-blue-800" },
  ] as const;

  const handlePay = () => {
    if (!method || !phone || phone.length < 9) return;
    setPaying(true);
    setTimeout(() => {
      const reference = onSuccess({ listing, amount: fee, method, phone });
      setReceiptReference(reference);
      setPaying(false);
      setStep("done");
    }, 2200);
  };

  return (
    <div className="fixed inset-0 z-60 flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => step !== "done" && onClose()} />
      <div className="relative bg-white w-full max-w-sm rounded-t-2xl sm:rounded-2xl shadow-2xl overflow-hidden">
        {step === "done" ? (
          <div className="text-center px-6 py-10 space-y-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#0F172A]">Payment Received!</h3>
              <p className="text-sm text-[#64748B] mt-1">Your listing is now <span className="font-semibold text-[#10B981]">Live</span> and visible to tenants.</p>
            </div>
            <div className="bg-surface border border-black/10 rounded-xl px-4 py-3 text-sm text-left">
              <p className="font-semibold text-[#0F172A] truncate">{listing.title}</p>
              <p className="text-xs text-[#64748B] mt-0.5">{listing.location}, {listing.region}</p>
              {receiptReference && (
                <p className="text-xs text-brand font-black mt-1">Receipt: {receiptReference}</p>
              )}
            </div>
            <button
              onClick={onClose}
              className="w-full bg-brand text-white font-bold py-3.5 rounded-xl text-sm hover:bg-brand-hover transition-colors"
            >
              View My Listings
            </button>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="flex items-center justify-between px-5 pt-5 pb-3 border-b border-black/10">
              <div>
                <h3 className="font-bold text-[#0F172A] text-base">Activate Listing</h3>
                <p className="text-xs text-[#64748B] mt-0.5">One-time fee - Goes live instantly</p>
              </div>
              <button onClick={onClose} className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center text-[#94A3B8]">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Listing preview + fee */}
            <div className="px-5 py-4 bg-surface border-b border-black/10 flex items-center gap-3">
              {listing.photos[0] && (
                <img src={listing.photos[0]} alt="" className="w-12 h-12 rounded-xl object-cover shrink-0" />
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-[#0F172A] truncate">{listing.title}</p>
                <p className="text-xs text-[#64748B]">{listing.location}, {listing.region}</p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-xl font-bold text-brand">GHS {fee}</p>
                <p className="text-[10px] text-[#94A3B8]">{plan.name}</p>
              </div>
            </div>

            <div className="px-5 py-4 space-y-4">
              <div className="rounded-2xl border border-green-100 bg-brand-light px-4 py-3">
                <p className="text-xs font-black text-brand uppercase tracking-wider">What your fee covers</p>
                <p className="text-sm font-bold text-[#0F172A] mt-1">{plan.bestFor}</p>
                <p className="text-xs text-[#64748B] leading-relaxed mt-1">{plan.promise}</p>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {plan.benefits.map((benefit) => (
                    <span key={benefit} className="text-[10px] font-semibold bg-white border border-black/10 text-[#64748B] px-2 py-0.5 rounded-full">
                      {benefit}
                    </span>
                  ))}
                </div>
              </div>

              {/* Payment method */}
              <div>
                <p className="text-xs font-bold text-[#94A3B8] uppercase tracking-wider mb-2">Pay with Mobile Money</p>
                <div className="space-y-2">
                  {METHODS.map((m) => (
                    <button
                      key={m.id}
                      onClick={() => setMethod(m.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border-2 text-left transition-all ${
                        method === m.id ? m.color + " border-2" : "border-black/10 bg-white hover:border-gray-300"
                      }`}
                    >
                      <span className="text-xl leading-none">{m.emoji}</span>
                      <span className={`text-sm font-semibold flex-1 ${method === m.id ? "" : "text-[#0F172A]"}`}>{m.label}</span>
                      <span className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${method === m.id ? "border-brand bg-brand" : "border-gray-300"}`}>
                        {method === m.id && <span className="w-2 h-2 rounded-full bg-white block" />}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Phone number */}
              {method && (
                <div>
                  <label className="text-xs font-bold text-[#94A3B8] uppercase tracking-wider block mb-1.5">
                    Mobile Money Number
                  </label>
                  <div className="flex items-center gap-2 border-2 border-black/10 rounded-xl px-3 focus-within:border-brand transition-colors">
                    <Smartphone className="w-4 h-4 text-[#94A3B8] shrink-0" />
                    <span className="text-sm text-[#64748B] shrink-0">+233</span>
                    <input
                      type="tel"
                      placeholder="XX XXX XXXX"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                      className="flex-1 py-3 text-sm outline-none bg-transparent placeholder-[#CBD5E1]"
                    />
                  </div>
                </div>
              )}

              {/* Prompt + CTA */}
              {method && phone.length >= 9 && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 flex items-start gap-2">
                  <span className="text-sm shrink-0"></span>
                  <p className="text-xs text-amber-800">
                    You will receive a <strong>Mobile Money prompt</strong> to approve <strong>GHS {fee}</strong>. Confirm on your phone to activate.
                  </p>
                </div>
              )}

              <button
                onClick={handlePay}
                disabled={!method || phone.length < 9 || paying}
                className="w-full bg-brand text-white font-bold py-3.5 rounded-xl text-sm disabled:opacity-40 hover:bg-brand-hover transition-colors flex items-center justify-center gap-2"
              >
                {paying ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    Waiting for approval
                  </>
                ) : (
                  `Pay GHS ${fee} to Go Live`
                )}
              </button>

              <p className="text-center text-xs text-[#94A3B8]">Secure payment - Your listing goes live instantly after payment.</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

const STATUS_STYLES: Record<ListingStatus | "hidden" | "on_hold", string> = {
  pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
  approved: "bg-blue-100 text-blue-800 border-blue-200",
  live: "bg-green-100 text-green-800 border-green-200",
  rejected: "bg-red-100 text-red-700 border-red-200",
  hidden: "bg-gray-100 text-gray-600 border-gray-200",
  on_hold: "bg-amber-100 text-amber-800 border-amber-200",
};

const STATUS_LABELS: Record<ListingStatus, string> = {
  pending: "Pending Review",
  approved: "Approved - Awaiting Payment",
  live: "Live",
  rejected: "Rejected",
  on_hold: "On Hold",
};

function StatusBadge({ listing }: { listing: Room }) {
  if (listing.status === "on_hold") {
    return (
      <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full border ${STATUS_STYLES.on_hold}`}>
        <PauseCircle className="w-3 h-3" />
        On Hold
      </span>
    );
  }
  const key = listing.status === "live" && listing.is_hidden ? "hidden" : listing.status;
  const label = listing.status === "live" && listing.is_hidden ? "Hidden" : STATUS_LABELS[listing.status];
  return (
    <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full border ${STATUS_STYLES[key]}`}>
      {listing.status === "live" && !listing.is_hidden && (
        <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" />
      )}
      {label}
    </span>
  );
}

function PlanBadge({ listing }: { listing: Room }) {
  const plan = getListingPlan(listing.listing_plan);
  const featured = isFeaturedListing(listing);
  return (
    <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full border ${
      featured ? "bg-amber-100 text-amber-800 border-amber-200" : "bg-slate-100 text-slate-600 border-slate-200"
    }`}>
      {featured ? "Featured" : plan.name}
      {plan.price > 0 && !listing.listing_fee_paid ? ` - GHS ${getListingFee(listing)}` : ""}
    </span>
  );
}

function ListingRow({
  listing,
  views,
  onToggleHide,
  onToggleHold,
  onPay,
}: {
  listing: Room;
  views: number;
  onToggleHide: (id: string) => void;
  onToggleHold: (id: string) => void;
  onPay: (listing: Room) => void;
}) {
  return (
    <div className="rd-card rounded-[1.35rem] shadow-sm overflow-hidden hover:shadow-md transition-shadow">
      <div className="flex gap-4 p-4">
        {/* Thumbnail */}
        <div className="w-24 h-20 rounded-xl overflow-hidden bg-gray-100 shrink-0 relative">
          {listing.status === "on_hold" && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-10">
              <PauseCircle className="w-6 h-6 text-white" />
            </div>
          )}
          {listing.photos[0] ? (
            <img src={listing.photos[0]} alt="" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-300">
              <Home className="w-8 h-8" />
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-[#0F172A] text-sm truncate">{listing.title}</p>
          <p className="text-xs text-[#64748B] mt-0.5">
            {listing.location}, {listing.region}
          </p>
          <p className="text-xs text-[#94A3B8]">{listing.room_type}</p>
          <div className="flex items-center gap-2 mt-2 flex-wrap">
            <StatusBadge listing={listing} />
            <PlanBadge listing={listing} />
          </div>
        </div>

        {/* Price */}
        <div className="text-right shrink-0">
          <p className="text-base font-bold text-brand">
            GHS {listing.price_per_month.toLocaleString()}
          </p>
          <p className="text-xs text-[#94A3B8]">/mo</p>
        </div>
      </div>

      {/* Actions bar */}
      <div className="border-t border-black/10 px-4 py-2.5 flex items-center gap-3 flex-wrap bg-surface">
        <Link
          href={`/listings/${listing.id}`}
          className="flex items-center gap-1.5 text-xs text-brand font-medium hover:underline"
        >
          <Eye className="w-3.5 h-3.5" />
          View
        </Link>

        <span className="flex items-center gap-1 text-xs text-[#94A3B8]">
          <Eye className="w-3 h-3" />
          {views} view{views !== 1 ? "s" : ""}
        </span>

        {(listing.status === "live" || listing.status === "on_hold") && (
          <>
            <span className="text-[#E2E8F0]">|</span>
            {/* Hide/Show toggle - only when live and visible */}
            {listing.status === "live" && (
              <div className="flex items-center gap-2">
                <span className="text-xs text-[#64748B]">
                  {listing.is_hidden ? "Hidden" : "Visible"}
                </span>
                <Switch
                  checked={!listing.is_hidden}
                  onChange={() => onToggleHide(listing.id)}
                  label={listing.is_hidden ? "Show listing" : "Hide listing"}
                />
              </div>
            )}

            <span className="text-[#E2E8F0]">|</span>

            {/* On Hold toggle */}
            <button
              onClick={() => onToggleHold(listing.id)}
              className={`flex items-center gap-1.5 text-xs font-semibold transition-colors ${
                listing.status === "on_hold"
                  ? "text-brand hover:text-brand-hover"
                  : "text-amber-600 hover:text-amber-700"
              }`}
            >
              {listing.status === "on_hold" ? (
                <>
                  <PlayCircle className="w-3.5 h-3.5" />
                  Resume Listing
                </>
              ) : (
                <>
                  <PauseCircle className="w-3.5 h-3.5" />
                  Put On Hold
                </>
              )}
            </button>
          </>
        )}

        {listing.status === "approved" && !listing.is_free_listing && (
          <>
            <span className="text-[#E2E8F0]">|</span>
            <button
              onClick={() => onPay(listing)}
              className="text-xs font-semibold text-[#F97316] hover:underline flex items-center gap-1"
            >
              Pay GHS {getListingFee(listing)} to Go Live
            </button>
          </>
        )}

        <div className="ml-auto">
          <Link
            href={`/landlord/${LANDLORD_ID}`}
            className="flex items-center gap-1 text-xs text-[#94A3B8] hover:text-brand transition-colors"
          >
            <ExternalLink className="w-3 h-3" />
            My Profile
          </Link>
        </div>
      </div>
    </div>
  );
}

function PaymentHistory({
  payments,
  listings,
}: {
  payments: Payment[];
  listings: Room[];
}) {
  const [copied, setCopied] = useState("");
  const recent = payments.slice(0, 5);

  const copyReference = (reference: string) => {
    navigator.clipboard.writeText(reference).then(() => {
      setCopied(reference);
      setTimeout(() => setCopied(""), 1800);
    });
  };

  if (recent.length === 0) {
    return (
      <div className="mb-6 rd-card rounded-[1.5rem] p-5">
        <p className="text-sm font-black text-[#0F172A]">Payment Receipts</p>
        <p className="text-xs text-[#64748B] mt-1">
          Receipts will appear here after you activate a paid listing.
        </p>
      </div>
    );
  }

  return (
    <div className="mb-6 rd-card rounded-[1.5rem] p-5">
      <div className="flex items-center justify-between gap-3 mb-4">
        <div>
          <p className="text-sm font-black text-[#0F172A]">Payment Receipts</p>
          <p className="text-xs text-[#64748B] mt-1">Keep these references for your records.</p>
        </div>
        <span className="rounded-full bg-brand-light border border-green-100 text-brand text-xs font-black px-3 py-1">
          {recent.length} receipt{recent.length !== 1 ? "s" : ""}
        </span>
      </div>
      <div className="space-y-2">
        {recent.map((payment) => {
          const listing = listings.find((item) => item.id === payment.listing_id);
          const provider = payment.provider ? PAYMENT_METHOD_LABELS[payment.provider] : "Mobile Money";
          return (
            <div key={payment.id} className="rounded-2xl border border-black/10 bg-white px-4 py-3 flex items-center gap-3">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-[#0F172A] truncate">{listing?.title ?? payment.listing_id}</p>
                <p className="text-xs text-[#64748B] mt-0.5">
                  {provider} - {payment.paid_at ? new Date(payment.paid_at).toLocaleDateString() : "Paid"}
                </p>
                <p className="text-xs font-black text-brand mt-1">{payment.reference}</p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-sm font-black text-[#0F172A]">GHS {payment.amount}</p>
                <button
                  type="button"
                  onClick={() => copyReference(payment.reference)}
                  className="mt-1 inline-flex items-center gap-1 text-xs font-bold text-[#64748B] hover:text-brand"
                >
                  <Copy className="h-3 w-3" />
                  {copied === payment.reference ? "Copied" : "Copy"}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function LandlordDashboardPage() {
  const { listings: allListings, toggleHide, toggleHold, payToGoLive } = useListings();
  const { payments, recordPayment } = usePayments();
  const listings = allListings.filter((l) => l.landlord_id === LANDLORD_ID);
  const [payTarget, setPayTarget] = useState<Room | null>(null);

  const live = listings.filter((l) => l.status === "live");
  const onHold = listings.filter((l) => l.status === "on_hold");
  const pending = listings.filter((l) => l.status === "pending");
  const approved = listings.filter((l) => l.status === "approved");

  const listingIds = listings.map((l) => l.id);
  const totalViews = getTotalViews(listingIds);
  const viewsPerListing = getViewsForListings(listingIds);
  const landlordPayments = getPaymentsForLandlord(payments, LANDLORD_ID);
  const paidRevenue = getPaidPaymentTotal(landlordPayments) || getPaidListingRevenue(listings);

  const stats = [
    { label: "Live", value: live.filter((l) => !l.is_hidden).length, color: "text-[#10B981]", bg: "bg-green-50", border: "border-green-100" },
    { label: "On Hold", value: onHold.length, color: "text-amber-600", bg: "bg-amber-50", border: "border-amber-100" },
    { label: "Pending", value: pending.length, color: "text-[#F59E0B]", bg: "bg-yellow-50", border: "border-yellow-100" },
    { label: "Views", value: totalViews, color: "text-brand", bg: "bg-brand-light", border: "border-green-100" },
    { label: "Paid", value: `GHS ${paidRevenue}`, color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-100" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-surface">
      <Nav />

      {/* Hero header */}
      <div
        className="text-white py-8 px-4"
        style={{ background: "linear-gradient(135deg, #064030 0%, #0F6E56 100%)" }}
      >
        <div className="max-w-4xl mx-auto flex items-start justify-between gap-4">
          <div>
            <p className="text-green-300 text-xs font-medium mb-1">RentDirect - My Dashboard</p>
            <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-2xl font-bold">Welcome back, Kwame Asante</h1>
            <span className="text-[10px] font-bold text-green-300 border border-green-400/50 bg-white/10 px-2 py-0.5 rounded tracking-wide">
              [Property Owner]
            </span>
          </div>
            <p className="text-green-200 text-sm mt-1">Manage your listings and track performance</p>
          </div>
          <Link
            href={`/landlord/${LANDLORD_ID}`}
            className="shrink-0 flex items-center gap-1.5 bg-white/15 hover:bg-white/25 transition-colors border border-white/30 text-white text-xs font-semibold px-3 py-2 rounded-xl"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            My Public Profile
          </Link>
        </div>
      </div>

      <div className="max-w-4xl mx-auto w-full px-4 flex-1">
        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 -mt-5 mb-6">
          {stats.map((s) => (
            <div key={s.label} className={`${s.bg} border ${s.border} rounded-2xl p-4 text-center shadow-sm bg-white`}>
              <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
              <p className="text-xs text-[#64748B] mt-0.5 font-medium">{s.label}</p>
            </div>
          ))}
        </div>

        <PaymentHistory payments={landlordPayments} listings={listings} />

        {/* Tab nav */}
        <div className="flex gap-1 bg-white border border-black/10 rounded-xl p-1 mb-6 w-fit">
          <span className="px-4 py-2 text-sm font-medium rounded-lg bg-brand text-white shadow-sm">
            My Listings
          </span>
          <Link
            href="/landlord/upload"
            className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-lg text-[#64748B] hover:text-[#0F172A] transition-colors"
          >
            <PlusCircle className="w-4 h-4" />
            Upload New
          </Link>
        </div>

        {/* Ghana law compliance reminder */}
        <div className="mb-4 bg-white border border-black/10 rounded-xl px-4 py-3 space-y-1">
          <p className="text-xs font-bold text-[#0F172A] flex items-center gap-1.5"> Your Legal Obligations (Ghana Rent Act 220)</p>
          <div className="flex flex-wrap gap-x-6 gap-y-1">
            {[
              "Max 6 months advance from tenants",
              "Issue a rent receipt on every payment",
              "Provide a written tenancy agreement",
              "Give proper notice before eviction",
            ].map((item) => (
              <p key={item} className="text-xs text-[#64748B] flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-brand shrink-0" />
                {item}
              </p>
            ))}
          </div>
        </div>

        {/* On Hold info banner */}
        {onHold.length > 0 && (
          <div className="mb-4 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 flex items-center gap-3">
            <PauseCircle className="w-4 h-4 text-amber-600 shrink-0" />
            <p className="text-xs text-amber-800">
              <span className="font-semibold">{onHold.length} listing{onHold.length !== 1 ? "s" : ""} on hold</span>
              {" "}- hidden from tenants while you&apos;re in contact with someone.
            </p>
          </div>
        )}

        {/* Listings */}
        <div className="space-y-8 pb-10">
          {approved.length > 0 && (
            <section>
              <h2 className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-500" />
                Action Required - {approved.length}
              </h2>
              <div className="space-y-3">
                {approved.map((l) => <ListingRow key={l.id} listing={l} views={viewsPerListing[l.id] ?? 0} onToggleHide={toggleHide} onToggleHold={toggleHold} onPay={setPayTarget} />)}
              </div>
            </section>
          )}

          {pending.length > 0 && (
            <section>
              <h2 className="text-xs font-bold text-yellow-600 uppercase tracking-wider mb-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-yellow-500" />
                Pending Review - {pending.length}
              </h2>
              <div className="space-y-3">
                {pending.map((l) => <ListingRow key={l.id} listing={l} views={viewsPerListing[l.id] ?? 0} onToggleHide={toggleHide} onToggleHold={toggleHold} onPay={setPayTarget} />)}
              </div>
            </section>
          )}

          {onHold.length > 0 && (
            <section>
              <h2 className="text-xs font-bold text-amber-600 uppercase tracking-wider mb-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                On Hold - {onHold.length}
              </h2>
              <div className="space-y-3">
                {onHold.map((l) => <ListingRow key={l.id} listing={l} views={viewsPerListing[l.id] ?? 0} onToggleHide={toggleHide} onToggleHold={toggleHold} onPay={setPayTarget} />)}
              </div>
            </section>
          )}

          {live.length > 0 && (
            <section>
              <h2 className="text-xs font-bold text-green-600 uppercase tracking-wider mb-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500" />
                Live - {live.length}
              </h2>
              <div className="space-y-3">
                {live.map((l) => <ListingRow key={l.id} listing={l} views={viewsPerListing[l.id] ?? 0} onToggleHide={toggleHide} onToggleHold={toggleHold} onPay={setPayTarget} />)}
              </div>
            </section>
          )}

          {listings.length === 0 && (
            <div className="text-center py-20 space-y-4">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                <Home className="w-8 h-8 text-gray-300" />
              </div>
              <p className="text-[#64748B] font-medium">You haven&apos;t listed any rooms yet.</p>
              <Link
                href="/landlord/upload"
                className="inline-flex items-center gap-2 bg-brand text-white font-semibold px-6 py-3 rounded-xl text-sm hover:bg-brand-hover transition-colors"
              >
                <PlusCircle className="w-4 h-4" />
                List Your First Room
              </Link>
            </div>
          )}

          {listings.length > 0 && (
            <div className="text-center pt-4">
              <Link
                href="/landlord/upload"
                className="inline-flex items-center gap-2 border-2 border-brand text-brand font-semibold px-6 py-3 rounded-xl text-sm hover:bg-brand-light transition-colors"
              >
                <PlusCircle className="w-4 h-4" />
                Add Another Room
              </Link>
            </div>
          )}
        </div>
      </div>

      <Footer />

      {payTarget && (
        <PaymentModal
          listing={payTarget}
          onClose={() => setPayTarget(null)}
          onSuccess={(input) => {
            const payment = recordPayment(input);
            payToGoLive(input.listing.id);
            return payment.reference;
          }}
        />
      )}
    </div>
  );
}




