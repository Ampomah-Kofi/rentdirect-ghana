"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft, MapPin, CheckCircle, Phone, MessageCircle,
  AlertTriangle, X, ChevronLeft, ChevronRight,
  Heart, Share2, ExternalLink, User, Send, ShieldCheck,
} from "lucide-react";
import { getListingById } from "@/lib/mock-data";
import { useListings } from "@/components/providers/ListingsProvider";
import { useRecordView } from "@/lib/useViewTracker";
import { AmenityIcon } from "@/components/AmenityIcon";
import ListingCard from "@/components/ListingCard";
import TenantRightsCard from "@/components/TenantRightsCard";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { useFavoritesContext } from "@/components/providers/FavoritesProvider";
import { useReports } from "@/components/providers/ReportsProvider";
import { useToast } from "@/components/providers/ToastProvider";
import type { Room } from "@/lib/types";
import type { ReportReason } from "@/lib/types";

function TrustChecklist({ listing }: { listing: Room }) {
  const advance = listing.advance_months ?? 6;
  const checks = [
    {
      label: "Landlord identity",
      passed: Boolean(listing.landlord_ghana_card),
      detail: listing.landlord_ghana_card ? "Ghana Card provided for admin review" : "Ghana Card not provided",
    },
    {
      label: "Face verification",
      passed: Boolean(listing.landlord_photo_url),
      detail: listing.landlord_photo_url ? "Passport photo uploaded for review" : "No landlord photo uploaded",
    },
    {
      label: "Rent Act advance",
      passed: advance <= 6,
      detail: advance <= 6 ? `${advance} month advance listed` : `${advance} months advance exceeds legal limit`,
    },
    {
      label: "Location clarity",
      passed: Boolean(listing.ghana_post_gps || listing.address),
      detail: listing.ghana_post_gps || listing.address || `${listing.location}, ${listing.region}`,
    },
  ];
  const passed = checks.filter((check) => check.passed).length;

  return (
    <div className="rd-card rounded-[1.35rem] p-5 border-brand/15">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          <p className="text-[11px] font-black text-brand uppercase tracking-[0.18em]">Tenant Safety</p>
          <h2 className="text-base font-black text-[#0F172A] mt-1">Trust checklist</h2>
          <p className="text-xs text-[#64748B] mt-1">Use this before sending money or visiting the property.</p>
        </div>
        <div className="rounded-2xl bg-brand-light border border-green-100 px-3 py-2 text-center">
          <p className="text-lg font-black text-brand">{passed}/4</p>
          <p className="text-[10px] text-[#64748B] font-bold uppercase">Checks</p>
        </div>
      </div>
      <div className="space-y-2">
        {checks.map((check) => (
          <div key={check.label} className="flex items-start gap-3 rounded-xl bg-white border border-black/10 px-3 py-2.5">
            <span className={`mt-0.5 flex h-5 w-5 items-center justify-center rounded-full ${check.passed ? "bg-brand text-white" : "bg-amber-100 text-amber-700"}`}>
              {check.passed ? <CheckCircle className="h-3.5 w-3.5" /> : <AlertTriangle className="h-3.5 w-3.5" />}
            </span>
            <div>
              <p className="text-sm font-bold text-[#0F172A]">{check.label}</p>
              <p className="text-xs text-[#64748B] mt-0.5">{check.detail}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ContactSafetyNote() {
  return (
    <div className="rounded-2xl bg-amber-50 border border-amber-200 px-4 py-3">
      <p className="text-xs font-black text-amber-900 flex items-center gap-1.5">
        <ShieldCheck className="w-3.5 h-3.5" />
        Before you pay
      </p>
      <p className="text-xs text-amber-800 mt-1 leading-relaxed">
        Visit the room, confirm ownership, sign a written agreement, and get a receipt. Do not send inspection or reservation money to anyone you have not verified.
      </p>
    </div>
  );
}

export default function ListingDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { listings } = useListings();
  const listing = listings.find((l) => l.id === params.id) ?? getListingById(params.id as string);
  const { isSaved, toggle } = useFavoritesContext();
  const { submitReport } = useReports();
  const { addToast } = useToast();
  useRecordView(params.id as string);

  const [photoIndex, setPhotoIndex] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [showReportModal, setShowReportModal] = useState(false);
  const [contactUnlocked, setContactUnlocked] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [reportDetails, setReportDetails] = useState("");
  const [reportSubmitted, setReportSubmitted] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  const [showShareSheet, setShowShareSheet] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [messageDraft, setMessageDraft] = useState("");
  const [messageSent, setMessageSent] = useState(false);

  if (!listing) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-4">
        <p className="text-[#64748B] text-lg">Listing not found.</p>
        <Link href="/" className="text-brand font-medium underline">Back to browse</Link>
      </div>
    );
  }

  const saved = isSaved(listing.id);

  const handleReport = () => {
    if (!reportReason) return;
    submitReport({
      listing,
      reason: reportReason as ReportReason,
      details: reportDetails,
    });
    setReportSubmitted(true);
    addToast("Report submitted for admin review", "success");
  };
  const prevPhoto = () => setPhotoIndex((i) => Math.max(0, i - 1));
  const nextPhoto = () => setPhotoIndex((i) => Math.min(listing.photos.length - 1, i + 1));
  const handleTouchStart = (e: React.TouchEvent) => setTouchStart(e.touches[0].clientX);
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart === null) return;
    const diff = touchStart - e.changedTouches[0].clientX;
    if (diff > 50) nextPhoto();
    else if (diff < -50) prevPhoto();
    setTouchStart(null);
  };

  const pageUrl = typeof window !== "undefined" ? window.location.href : `https://rentdirect.gh/listings/${listing.id}`;
  const shareText = `${listing.title} - GHS ${listing.price_per_month.toLocaleString()}/mo in ${listing.location}, Ghana`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(pageUrl).then(() => { setLinkCopied(true); setTimeout(() => setLinkCopied(false), 2000); });
  };

  const whatsappUrl = `https://wa.me/233${listing.landlord_phone.replace(/^0/, "")}`;

  // Nearby: same region, different listing, live
  const nearby = listings
    .filter((l) => l.status === "live" && !l.is_hidden && l.region === listing.region && l.id !== listing.id)
    .slice(0, 4);

  // Annual + 2-year cost breakdown
  const annual = listing.price_per_month * 12;
  const biannual = listing.price_per_month * 6;

  return (
    <div className="min-h-screen flex flex-col bg-surface">
      <Nav />

      {/* Top bar */}
      <div className="bg-[#FFF8EA]/90 border-b border-black/5 sticky top-17 z-40 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 h-12 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-1.5 text-sm text-[#64748B] hover:text-[#0F172A] transition-colors shrink-0"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
            <span className="text-[#E2E8F0]">|</span>
            <nav className="flex items-center gap-1 text-xs text-[#94A3B8] overflow-hidden">
              <Link href="/" className="hover:text-[#0F172A] shrink-0">Home</Link>
              <span></span>
              <span className="shrink-0">{listing.region}</span>
              <span></span>
              <span className="text-[#0F172A] font-medium truncate">{listing.location}</span>
            </nav>
          </div>

          {/* Top-right actions */}
          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={() => setShowShareSheet(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-[#64748B] hover:bg-gray-100 transition-colors"
            >
              <Share2 className="w-3.5 h-3.5" />Share
            </button>
            <button
              onClick={() => toggle(listing.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                saved ? "text-red-500 bg-red-50" : "text-[#64748B] hover:bg-gray-100"
              }`}
            >
              <Heart className={`w-3.5 h-3.5 ${saved ? "fill-red-500" : ""}`} />
              {saved ? "Saved" : "Save"}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto w-full px-4 py-6 flex-1">
        {/* Photo gallery */}
        <div className="mb-6">
          {/* Mobile: full-width carousel */}
          <div
            className="md:hidden relative aspect-4/3 bg-gray-900 rounded-2xl overflow-hidden"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            {listing.photos.length > 0 ? (
              <img src={listing.photos[photoIndex]} alt={`Photo ${photoIndex + 1}`} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">No photos</div>
            )}
            {listing.photos.length > 1 && (
              <>
                <button onClick={prevPhoto} disabled={photoIndex === 0} className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/50 text-white rounded-full p-2 disabled:opacity-30">
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button onClick={nextPhoto} disabled={photoIndex === listing.photos.length - 1} className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/50 text-white rounded-full p-2 disabled:opacity-30">
                  <ChevronRight className="w-4 h-4" />
                </button>
                <div className="absolute bottom-3 right-3 bg-black/60 text-white text-xs px-2 py-1 rounded-full">
                  {photoIndex + 1} / {listing.photos.length}
                </div>
              </>
            )}
          </div>

          {/* Desktop: large + thumbnails */}
          <div className="hidden md:grid gap-2" style={{ gridTemplateColumns: listing.photos.length > 1 ? "3fr 2fr" : "1fr" }}>
            <div className="relative aspect-4/3 rounded-[1.6rem] overflow-hidden bg-[#EDE2CE] shadow-2xl">
              {listing.photos[photoIndex] && (
                <img src={listing.photos[photoIndex]} alt={`Photo ${photoIndex + 1}`} className="w-full h-full object-cover" />
              )}
            </div>
            {listing.photos.length > 1 && (
              <div className="grid grid-cols-2 gap-2">
                {listing.photos.slice(0, 4).map((photo, i) => (
                  <button
                    key={i}
                    onClick={() => setPhotoIndex(i)}
                    className={`relative aspect-square rounded-xl overflow-hidden bg-gray-100 border-2 transition-colors ${
                      i === photoIndex ? "border-brand" : "border-transparent hover:border-gray-300"
                    }`}
                  >
                    <img src={photo} alt={`Thumbnail ${i + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Content columns */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left column */}
          <div className="flex-1 min-w-0 space-y-6">
            {/* Title & price (mobile) */}
            <div>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h1 className="text-2xl font-bold text-[#0F172A] leading-tight">{listing.title}</h1>
                  <div className="flex items-center gap-1.5 mt-2">
                    <MapPin className="w-4 h-4 text-[#94A3B8] shrink-0" />
                    <span className="text-sm text-[#64748B]">
                      {listing.address || `${listing.location}, ${listing.region}`}
                    </span>
                  </div>
                </div>
                <div className="text-right shrink-0 lg:hidden">
                  <p className="text-2xl font-bold text-brand">GHS {listing.price_per_month.toLocaleString()}</p>
                  <p className="text-xs text-[#94A3B8]">per month</p>
                </div>
              </div>

              {/* Badges */}
              <div className="flex flex-wrap gap-2 mt-3">
                <span className="inline-flex items-center gap-1.5 bg-brand-light text-brand text-xs font-semibold px-2.5 py-1 rounded-full border border-green-200">
                  <CheckCircle className="w-3.5 h-3.5" />
                  Verified Direct Listing
                </span>
                <span className="inline-flex items-center bg-surface text-[#64748B] text-xs font-medium px-2.5 py-1 rounded-full border border-[#E2E8F0]">
                  {listing.room_type}
                </span>
                {listing.is_free_listing && (
                  <span className="inline-flex items-center bg-blue-50 text-blue-700 text-xs font-medium px-2.5 py-1 rounded-full border border-blue-200">
                    No listing fee
                  </span>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="rd-card rounded-[1.35rem] p-5">
              <h2 className="text-base font-semibold text-[#0F172A] mb-3">Overview</h2>
              <p className="text-sm text-[#64748B] leading-relaxed">{listing.description}</p>
            </div>

            <TrustChecklist listing={listing} />

            {/* Amenities */}
            {listing.amenities.length > 0 && (
              <div className="rd-card rounded-[1.35rem] p-5">
                <h2 className="text-base font-semibold text-[#0F172A] mb-4">Amenities</h2>
                <div className="grid grid-cols-2 gap-2">
                  {listing.amenities.map((amenity) => (
                    <div key={amenity} className="flex items-center gap-2.5 bg-surface rounded-xl px-3 py-2.5 border border-[#E2E8F0]">
                      <AmenityIcon amenity={amenity} size={16} />
                      <span className="text-sm text-[#0F172A] font-medium">{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Price breakdown */}
            <div className="rd-card rounded-[1.35rem] p-5">
              <h2 className="text-base font-semibold text-[#0F172A] mb-4">Cost Breakdown</h2>
              <div className="space-y-2">
                {[
                  { label: "Monthly rent", value: `GHS ${listing.price_per_month.toLocaleString()}` },
                  { label: "6-month advance", value: `GHS ${biannual.toLocaleString()}` },
                  { label: "Annual cost", value: `GHS ${annual.toLocaleString()}`, highlight: true },
                ].map((row) => (
                  <div key={row.label} className={`flex items-center justify-between px-4 py-2.5 rounded-xl ${row.highlight ? "bg-brand-light border border-green-200" : "bg-surface border border-[#E2E8F0]"}`}>
                    <span className="text-sm text-[#64748B]">{row.label}</span>
                    <span className={`text-sm font-bold ${row.highlight ? "text-brand" : "text-[#0F172A]"}`}>{row.value}</span>
                  </div>
                ))}
              </div>
              <p className="text-xs text-[#94A3B8] mt-3">* Ghana law limits advance rent to 6 months. Confirm the exact amount directly with the landlord before paying.</p>
            </div>

            {/* Location */}
            <div className="rd-card rounded-[1.35rem] p-5">
              <h2 className="text-base font-semibold text-[#0F172A] mb-3">Location</h2>
              <div className="flex items-center gap-2 mb-3">
                <MapPin className="w-4 h-4 text-brand" />
                <span className="text-sm text-[#64748B]">{listing.location}, {listing.region}</span>
                {listing.ghana_post_gps && (
                  <span className="ml-auto text-xs font-mono bg-surface border border-[#E2E8F0] text-[#64748B] px-2 py-0.5 rounded-lg">
                     {listing.ghana_post_gps}
                  </span>
                )}
              </div>
              <div className="aspect-16/7 rounded-xl overflow-hidden border border-[#E2E8F0] relative bg-gray-100">
                <iframe
                  src={`https://maps.google.com/maps?q=${encodeURIComponent(`${listing.location}, ${listing.region}, Ghana`)}&output=embed&z=15`}
                  width="100%"
                  height="100%"
                  className="absolute inset-0 w-full h-full"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title={`Map of ${listing.location}`}
                />
              </div>
              <a
                href={`https://www.google.com/maps/search/${encodeURIComponent(`${listing.location}, ${listing.region}, Ghana`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 flex items-center gap-1.5 text-xs text-brand hover:underline font-medium"
              >
                <MapPin className="w-3.5 h-3.5" />
                Open in Google Maps
              </a>
            </div>

            {/* Tenant Rights - Ghana Rent Act */}
            <TenantRightsCard
              pricePerMonth={listing.price_per_month}
              advanceMonths={listing.advance_months}
              tenancyDuration={listing.tenancy_duration}
            />

            {/* Report */}
            <div className="pb-2">
              <button
                onClick={() => setShowReportModal(true)}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border border-red-100 bg-red-50 text-red-600 hover:bg-red-100 transition-colors text-sm font-medium"
              >
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>Report a problem with this listing</span>
              </button>
            </div>
          </div>

          {/* Right sticky sidebar (desktop) */}
          <div className="lg:w-80 shrink-0">
            <div className="rd-card rounded-[1.35rem] p-5 shadow-sm lg:sticky lg:top-27 space-y-4">
              {/* Price */}
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-3xl font-black text-brand">GHS {listing.price_per_month.toLocaleString()}</p>
                  <p className="text-sm text-[#94A3B8]">per month</p>
                </div>
                <button
                  onClick={() => toggle(listing.id)}
                  className={`w-9 h-9 rounded-full border-2 flex items-center justify-center transition-all ${
                    saved ? "border-red-400 bg-red-50 text-red-500" : "border-[#E2E8F0] text-[#94A3B8] hover:border-red-300 hover:text-red-400"
                  }`}
                  aria-label={saved ? "Remove from saved" : "Save listing"}
                >
                  <Heart className={`w-4 h-4 ${saved ? "fill-red-500" : ""}`} />
                </button>
              </div>

              <hr className="border-[#E2E8F0]" />

              {/* Landlord info + link to profile */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-brand text-white flex items-center justify-center font-bold text-base shrink-0">
                  {listing.landlord_name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <p className="font-semibold text-[#0F172A] text-sm">{listing.landlord_name}</p>
                    <span className="text-[10px] font-bold text-brand border border-brand/40 bg-brand-light px-1.5 py-0.5 rounded tracking-wide">
                      [Property Owner]
                    </span>
                  </div>
                  {contactUnlocked ? (
                    <p className="text-xs text-[#64748B]">{listing.landlord_phone}</p>
                  ) : (
                    <p className="text-xs text-[#94A3B8] tracking-widest select-none"></p>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <p className="text-xs text-[#10B981] font-medium flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5" />
                  Direct landlord - no agent fee
                </p>
                <Link
                  href={`/landlord/${listing.landlord_id}`}
                  className="flex items-center gap-1 text-xs text-brand hover:underline font-medium"
                >
                  <User className="w-3 h-3" />
                  Profile
                  <ExternalLink className="w-3 h-3" />
                </Link>
              </div>

              <ContactSafetyNote />

              {/* CTA buttons */}
              {contactUnlocked ? (
                <>
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 bg-[#25D366] text-white font-semibold py-3 rounded-xl text-sm hover:opacity-90 transition-opacity"
                  >
                    <MessageCircle className="w-4 h-4" />
                    WhatsApp Landlord
                  </a>
                  <a
                    href={`tel:${listing.landlord_phone}`}
                    className="flex items-center justify-center gap-2 border-2 border-brand text-brand font-semibold py-3 rounded-xl text-sm hover:bg-brand-light transition-colors"
                  >
                    <Phone className="w-4 h-4" />
                    Call {listing.landlord_phone}
                  </a>
                </>
              ) : (
                <button
                  onClick={() => setContactUnlocked(true)}
                  className="w-full flex items-center justify-center gap-2 rd-button-primary font-black py-3 rounded-xl text-sm hover:bg-brand-hover transition-colors"
                >
                  <Phone className="w-4 h-4" />
                  Show Contact Details
                </button>
              )}

              {/* Message landlord */}
              <button
                onClick={() => setShowMessageModal(true)}
                className="w-full flex items-center justify-center gap-2 border-2 border-[#E2E8F0] text-[#0F172A] font-semibold py-3 rounded-xl text-sm hover:border-brand hover:text-brand transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                Message Landlord
              </button>

              {/* Share */}
              <button
                onClick={() => setShowShareSheet(true)}
                className="w-full flex items-center justify-center gap-2 border border-[#E2E8F0] text-[#64748B] py-2.5 rounded-xl text-xs font-medium hover:bg-surface transition-colors"
              >
                <Share2 className="w-3.5 h-3.5" />Share this listing
              </button>
            </div>
          </div>
        </div>

        {/* Nearby listings */}
        {nearby.length > 0 && (
          <section className="mt-12">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-[#0F172A]">
                More in {listing.region}
              </h2>
              <Link href={`/browse?region=${encodeURIComponent(listing.region)}`} className="text-sm text-brand font-medium hover:underline">
                See all
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {nearby.map((l) => <ListingCard key={l.id} listing={l} />)}
            </div>
          </section>
        )}
      </div>

      <Footer />

      {/* Mobile sticky bottom bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/92 backdrop-blur-xl border-t border-black/5 shadow-[0_-14px_40px_rgba(16,26,24,0.12)] px-4 py-3 flex items-center gap-3 z-40">
        <div className="flex-1">
          <p className="text-lg font-bold text-brand">GHS {listing.price_per_month.toLocaleString()}</p>
          <p className="text-xs text-[#94A3B8]">per month</p>
        </div>
        {contactUnlocked ? (
          <>
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1.5 bg-[#25D366] text-white font-semibold px-4 py-2.5 rounded-xl text-sm">
              <MessageCircle className="w-4 h-4" />
              WhatsApp
            </a>
            <a href={`tel:${listing.landlord_phone}`}
              className="flex items-center gap-1.5 rd-button-primary font-black px-4 py-2.5 rounded-xl text-sm">
              <Phone className="w-4 h-4" />
              Call
            </a>
          </>
        ) : (
          <button
            onClick={() => setContactUnlocked(true)}
            className="flex items-center gap-1.5 rd-button-primary font-black px-5 py-2.5 rounded-xl text-sm hover:bg-brand-hover transition-colors"
          >
            <Phone className="w-4 h-4" />
            Show Contact
          </button>
        )}
      </div>
      <div className="lg:hidden h-20" />

      {/* Message Landlord Modal */}
      {showMessageModal && (
        <div className="fixed inset-0 z-60 flex items-end sm:items-center justify-center">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => { if (!messageSent) setShowMessageModal(false); }} />
          <div className="relative bg-white w-full max-w-md rounded-t-2xl sm:rounded-2xl shadow-2xl overflow-hidden">
            {messageSent ? (
              <div className="text-center px-6 py-10 space-y-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#0F172A]">Message Sent!</h3>
                  <p className="text-sm text-[#64748B] mt-1">
                    {listing.landlord_name} will receive your message and reply shortly.
                  </p>
                </div>
                <div className="bg-surface border border-[#E2E8F0] rounded-xl px-4 py-3 text-sm text-left">
                  <p className="text-xs text-[#94A3B8] mb-1">Your message</p>
                  <p className="text-[#0F172A] italic">"{messageDraft}"</p>
                </div>
                <button
                  onClick={() => { setShowMessageModal(false); setMessageSent(false); setMessageDraft(""); }}
                  className="w-full bg-brand text-white font-bold py-3.5 rounded-xl text-sm hover:bg-brand-hover transition-colors"
                >
                  Done
                </button>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between px-5 pt-5 pb-3 border-b border-[#E2E8F0]">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-brand text-white flex items-center justify-center font-bold text-sm">
                      {listing.landlord_name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-[#0F172A] text-sm">{listing.landlord_name}</p>
                      <p className="text-[10px] font-bold text-brand border border-brand/40 bg-brand-light px-1.5 py-0.5 rounded tracking-wide">
                        [Property Owner]
                      </p>
                    </div>
                  </div>
                  <button onClick={() => setShowMessageModal(false)} className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center text-[#94A3B8]">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Listing context */}
                <div className="mx-5 mt-4 flex items-center gap-3 bg-surface border border-[#E2E8F0] rounded-xl px-3 py-2.5">
                  {listing.photos[0] && (
                    <img src={listing.photos[0]} alt="" className="w-10 h-10 rounded-lg object-cover shrink-0" />
                  )}
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-[#0F172A] truncate">{listing.title}</p>
                    <p className="text-xs text-brand font-bold">GHS {listing.price_per_month.toLocaleString()}/mo</p>
                  </div>
                </div>

                {/* Quick message chips */}
                <div className="px-5 mt-4">
                  <p className="text-xs font-bold text-[#94A3B8] uppercase tracking-wider mb-2">Quick messages</p>
                  <div className="flex flex-wrap gap-2">
                    {[
                      "Is this room still available?",
                      "Can I schedule a viewing?",
                      "Is the price negotiable?",
                      "What's included in the rent?",
                    ].map((q) => (
                      <button
                        key={q}
                        onClick={() => setMessageDraft(q)}
                        className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                          messageDraft === q
                            ? "border-brand bg-brand-light text-brand font-semibold"
                            : "border-[#E2E8F0] text-[#64748B] hover:border-brand hover:text-brand"
                        }`}
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Text area */}
                <div className="px-5 mt-3">
                  <textarea
                    rows={3}
                    value={messageDraft}
                    onChange={(e) => setMessageDraft(e.target.value)}
                    placeholder="Type your message to the landlord"
                    className="w-full border-2 border-[#E2E8F0] rounded-xl px-3 py-2.5 text-sm resize-none focus:outline-none focus:border-brand transition-colors placeholder-[#CBD5E1]"
                  />
                </div>

                <div className="px-5 py-4">
                  <button
                    onClick={() => { if (messageDraft.trim()) setMessageSent(true); }}
                    disabled={!messageDraft.trim()}
                    className="w-full flex items-center justify-center gap-2 bg-brand text-white font-bold py-3.5 rounded-xl text-sm disabled:opacity-40 hover:bg-brand-hover transition-colors"
                  >
                    <Send className="w-4 h-4" />
                    Send Message
                  </button>
                  <p className="text-center text-xs text-[#94A3B8] mt-2">
                    The landlord will see your message and reply directly.
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Report Modal */}
      {showReportModal && (
        <div className="fixed inset-0 z-60 flex items-end sm:items-center justify-center">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => { if (!reportSubmitted) setShowReportModal(false); }}
          />
          <div className="relative bg-white w-full max-w-md rounded-t-2xl sm:rounded-2xl overflow-hidden shadow-2xl">
            {reportSubmitted ? (
              <div className="text-center px-6 py-10 space-y-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#0F172A]">Report Submitted</h3>
                  <p className="text-sm text-[#64748B] mt-1">Our team will review this listing within 24 hours.</p>
                </div>
                <button
                  onClick={() => { setShowReportModal(false); setReportSubmitted(false); setReportReason(""); setReportDetails(""); }}
                  className="w-full rd-button-primary font-black py-3 rounded-xl text-sm"
                >Done</button>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between px-5 pt-5 pb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
                      <AlertTriangle className="w-4 h-4 text-red-500" />
                    </div>
                    <h3 className="font-bold text-[#0F172A] text-base">Report Listing</h3>
                  </div>
                  <button onClick={() => setShowReportModal(false)} className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center text-[#94A3B8]">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <p className="px-5 text-sm text-[#64748B]">What&apos;s wrong with this listing? Select a reason.</p>

                <div className="px-5 mt-3 space-y-2">
                  {[
                    { value: "agent_posing_as_landlord", label: "Agent posing as landlord",              icon: "AG" },
                    { value: "excess_advance",           label: "Demanding >6 months advance (illegal)", icon: "LAW" },
                    { value: "scam",                     label: "Suspected scam or fraud",              icon: "SCAM" },
                    { value: "wrong_price",              label: "Wrong price listed",                   icon: "GHS" },
                    { value: "wrong_location",           label: "Wrong location",                       icon: "MAP" },
                    { value: "already_rented",           label: "Already rented out",                   icon: "OUT" },
                    { value: "other",                    label: "Other reason",                         icon: "MORE" },
                  ].map((opt) => {
                    const selected = reportReason === opt.value;
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => setReportReason(opt.value)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border-2 text-left transition-all ${
                          selected ? "border-red-500 bg-red-50" : "border-[#E2E8F0] bg-white hover:border-gray-300"
                        }`}
                      >
                        <span className="text-lg leading-none">{opt.icon}</span>
                        <span className={`text-sm font-medium flex-1 ${selected ? "text-red-700" : "text-[#0F172A]"}`}>{opt.label}</span>
                        <span className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${selected ? "border-red-500 bg-red-500" : "border-gray-300"}`}>
                          {selected && <span className="w-2 h-2 rounded-full bg-white block" />}
                        </span>
                      </button>
                    );
                  })}
                </div>

                <div className="px-5 mt-3">
                  <textarea
                    placeholder="Add more details (optional)..."
                    value={reportDetails}
                    onChange={(e) => setReportDetails(e.target.value)}
                    rows={2}
                    className="w-full border border-[#E2E8F0] rounded-xl px-3 py-2.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-red-300 placeholder-[#94A3B8]"
                  />
                </div>

                <div className="px-5 py-4">
                  <button
                    onClick={handleReport}
                    disabled={!reportReason}
                    className="w-full bg-red-500 text-white font-bold py-3.5 rounded-xl text-sm disabled:opacity-40 hover:bg-red-600 transition-colors"
                  >Submit Report</button>
                  <p className="text-center text-xs text-[#94A3B8] mt-2">False reports may result in account suspension.</p>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Share Sheet Modal */}
      {showShareSheet && (
        <div className="fixed inset-0 z-60 flex items-end sm:items-center justify-center">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowShareSheet(false)} />
          <div className="relative bg-white w-full max-w-sm rounded-t-2xl sm:rounded-2xl shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-5 pt-5 pb-3 border-b border-[#E2E8F0]">
              <div className="flex items-center gap-2">
                <Share2 className="w-4 h-4 text-brand" />
                <h3 className="font-bold text-[#0F172A] text-base">Share Listing</h3>
              </div>
              <button onClick={() => setShowShareSheet(false)} className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center text-[#94A3B8]">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Listing preview */}
            <div className="px-5 py-3 flex items-center gap-3 bg-surface border-b border-[#E2E8F0]">
              {listing.photos[0] && (
                <img src={listing.photos[0]} alt="" className="w-12 h-12 rounded-xl object-cover shrink-0" />
              )}
              <div className="min-w-0">
                <p className="text-sm font-semibold text-[#0F172A] truncate">{listing.title}</p>
                <p className="text-xs text-brand font-bold">GHS {listing.price_per_month.toLocaleString()}/mo - {listing.location}</p>
              </div>
            </div>

            {/* Social share buttons */}
            <div className="px-5 py-4 space-y-2">
              {[
                {
                  label: "WhatsApp",
                  emoji: "WA",
                  bg: "bg-[#25D366]",
                  href: `https://wa.me/?text=${encodeURIComponent(`${shareText}\n${pageUrl}`)}`,
                },
                {
                  label: "Facebook",
                  emoji: "FB",
                  bg: "bg-[#1877F2]",
                  href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pageUrl)}`,
                },
                {
                  label: "X (Twitter)",
                  emoji: "X",
                  bg: "bg-[#0F172A]",
                  href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(pageUrl)}`,
                },
                {
                  label: "Telegram",
                  emoji: "TG",
                  bg: "bg-[#2AABEE]",
                  href: `https://t.me/share/url?url=${encodeURIComponent(pageUrl)}&text=${encodeURIComponent(shareText)}`,
                },
                {
                  label: "Email",
                  emoji: "@",
                  bg: "bg-[#64748B]",
                  href: `mailto:?subject=${encodeURIComponent(listing.title)}&body=${encodeURIComponent(`${shareText}\n\nView here: ${pageUrl}`)}`,
                },
              ].map((opt) => (
                <a
                  key={opt.label}
                  href={opt.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-white font-semibold text-sm transition-opacity hover:opacity-90 ${opt.bg}`}
                >
                  <span className="text-lg leading-none">{opt.emoji}</span>
                  Share on {opt.label}
                </a>
              ))}

              {/* Copy link */}
              <button
                onClick={handleCopyLink}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border-2 font-semibold text-sm transition-all ${
                  linkCopied ? "border-brand bg-brand-light text-brand" : "border-[#E2E8F0] text-[#0F172A] hover:border-brand"
                }`}
              >
                <span className="text-lg leading-none">{linkCopied ? "OK" : "URL"}</span>
                {linkCopied ? "Link Copied!" : "Copy Link"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}







