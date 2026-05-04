"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { Check, ChevronLeft, ChevronRight, Upload, X, Home, Bed, Building2, User } from "lucide-react";
import { GHANA_REGIONS, ROOM_TYPES } from "@/lib/ghana-locations";
import { LISTING_PLANS, getListingPlan } from "@/lib/monetization";
import { useListings } from "@/components/providers/ListingsProvider";
import type { Amenity, RoomType } from "@/lib/ghana-locations";
import type { ListingPlan, Room } from "@/lib/types";
import { AmenityIcon, AMENITY_CATEGORIES } from "@/components/AmenityIcon";
import Nav from "@/components/Nav";

const DEMO_LANDLORD_ID = "user-101";

interface FormData {
  title: string;
  description: string;
  region: string;
  location: string;
  address: string;
  room_type: string;
  price_per_month: string;
  advance_months: string;
  tenancy_duration: string;
  amenities: string[];
  landlord_name: string;
  landlord_phone: string;
  landlord_ghana_card: string;
  landlord_photo_url: string;  // object URL of passport photo, client-side only
  ghana_post_gps: string;
  latitude: string;
  longitude: string;
  listing_plan: ListingPlan;
  data_consent: boolean;
}

const INITIAL: FormData = {
  title: "",
  description: "",
  region: "",
  location: "",
  address: "",
  room_type: "",
  price_per_month: "",
  advance_months: "6",
  tenancy_duration: "1 year",
  amenities: [],
  landlord_name: "",
  landlord_phone: "",
  landlord_ghana_card: "",
  landlord_photo_url: "",
  ghana_post_gps: "",
  latitude: "",
  longitude: "",
  listing_plan: "standard",
  data_consent: false,
};

const STEPS = ["Details", "Location", "Photos & Amenities", "Review"];

type PhotoEntry = {
  name: string;
  url: string;
};

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

const ROOM_TYPE_ICONS: Record<string, { icon: React.ComponentType<{ className?: string }>; emoji: string }> = {
  "Single Room": { icon: Bed, emoji: "SR" },
  "Chamber and Hall": { icon: Home, emoji: "C+H" },
  "Self-Contained": { icon: Home, emoji: "SC" },
  "One Bedroom": { icon: Bed, emoji: "1B" },
  "Two Bedroom": { icon: Building2, emoji: "2B" },
  "Three Bedroom": { icon: Building2, emoji: "3B" },
  "Apartment": { icon: Building2, emoji: "APT" },
  "Studio": { icon: Bed, emoji: "ST" },
  "Boys Quarters": { icon: Home, emoji: "BQ" },
  "Compound House Room": { icon: Home, emoji: "CHR" },
};

function StepIndicator({ currentStep }: { currentStep: number }) {
  return (
    <div className="flex items-center gap-0 px-4 py-5 max-w-lg mx-auto w-full">
      {STEPS.map((label, i) => {
        const done = i < currentStep;
        const active = i === currentStep;
        return (
          <div key={i} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center gap-1">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                  done
                    ? "rd-button-primary"
                    : active
                    ? "rd-button-primary ring-4 ring-[#ECFDF5]"
                    : "bg-gray-200 text-[#94A3B8]"
                }`}
              >
                {done ? <Check className="w-4 h-4" /> : i + 1}
              </div>
              <span className={`text-xs font-medium hidden sm:block ${active ? "text-brand" : done ? "text-[#64748B]" : "text-[#94A3B8]"}`}>
                {label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={`flex-1 h-0.5 mx-2 mb-4 ${done ? "bg-[#0F6E56]" : "bg-gray-200"}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

function PricingTrustPanel() {
  return (
    <div className="rd-card rounded-[1.35rem] p-4 space-y-3 border-brand/15">
      <div>
        <p className="text-sm font-black text-[#0F172A]">Why landlords pay RentDirect</p>
        <p className="text-xs text-[#64748B] mt-0.5">
          The fee pays for verification, review, hosting, and tenant reach. Tenants still browse free.
        </p>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {[
          { label: "Verified", copy: "Ghana Card checked" },
          { label: "Direct", copy: "No agent commission" },
          { label: "MoMo", copy: "Simple activation" },
        ].map((item) => (
          <div key={item.label} className="rounded-xl bg-brand-light border border-green-100 px-3 py-2">
            <p className="text-xs font-black text-brand">{item.label}</p>
            <p className="text-[10px] text-[#64748B] mt-0.5 leading-snug">{item.copy}</p>
          </div>
        ))}
      </div>
      <p className="text-[11px] text-[#94A3B8] leading-relaxed">
        Launch idea: keep the first few listings free in each town, then charge GHS 50 standard and GHS 100 featured once demand is proven.
      </p>
    </div>
  );
}

export default function UploadPage() {
  const { createListing } = useListings();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormData>(INITIAL);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [submitted, setSubmitted] = useState(false);
  const [photoFiles, setPhotoFiles] = useState<PhotoEntry[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const profilePhotoRef = useRef<HTMLInputElement>(null);

  const locationOptions = form.region ? (GHANA_REGIONS[form.region] ?? []) : [];

  const selectedPlan = getListingPlan(form.listing_plan);

  const set = (key: keyof FormData, value: string | boolean) => {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const toggleAmenity = (a: string) => {
    setForm((f) => ({
      ...f,
      amenities: f.amenities.includes(a)
        ? f.amenities.filter((x) => x !== a)
        : [...f.amenities, a],
    }));
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    const newEntries = await Promise.all(
      files.map(async (file) => ({ name: file.name, url: await fileToDataUrl(file) }))
    );
    setPhotoFiles((prev) => [...prev, ...newEntries]);
  };

  const removePhoto = (idx: number) => {
    setPhotoFiles((prev) => prev.filter((_, i) => i !== idx));
  };

  const validateStep = (s: number): boolean => {
    const errs: Partial<Record<keyof FormData, string>> = {};
    if (s === 0) {
      if (!form.title.trim()) errs.title = "Title is required";
      if (!form.description.trim()) errs.description = "Description is required";
      if (!form.room_type) errs.room_type = "Select a room type";
      if (!form.price_per_month || isNaN(Number(form.price_per_month)) || Number(form.price_per_month) <= 0)
        errs.price_per_month = "Enter a valid price";
      if (!form.landlord_name.trim()) errs.landlord_name = "Your name is required";
      if (!form.landlord_phone.trim() || !/^0\d{9}$/.test(form.landlord_phone.replace(/\s/g, "")))
        errs.landlord_phone = "Enter a valid Ghana phone number (e.g. 0244123456)";
      if (!form.landlord_ghana_card.trim() || !/^GHA-\d{9}-\d$/.test(form.landlord_ghana_card.trim()))
        errs.landlord_ghana_card = "Enter a valid Ghana Card number (e.g. GHA-123456789-0)";
      if (!form.landlord_photo_url)
        errs.landlord_photo_url = "Please upload a passport-size photo of yourself";
    }
    if (s === 1) {
      if (!form.region) errs.region = "Select a region";
      if (!form.location) errs.location = "Select a location";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const next = () => {
    if (validateStep(step)) setStep((s) => Math.min(STEPS.length - 1, s + 1));
  };
  const back = () => setStep((s) => Math.max(0, s - 1));

  const handleSubmit = () => {
    const plan = getListingPlan(form.listing_plan);
    const timestamp = new Date().toISOString();
    const newListing: Room = {
      id: `listing-${Date.now()}`,
      landlord_id: DEMO_LANDLORD_ID,
      landlord_name: form.landlord_name.trim(),
      landlord_phone: form.landlord_phone.replace(/\s/g, ""),
      landlord_ghana_card: form.landlord_ghana_card.trim(),
      landlord_photo_url: form.landlord_photo_url,
      title: form.title.trim(),
      description: form.description.trim(),
      region: form.region,
      location: form.location,
      address: form.address.trim() || undefined,
      ghana_post_gps: form.ghana_post_gps.trim() || undefined,
      latitude: form.latitude ? Number(form.latitude) : undefined,
      longitude: form.longitude ? Number(form.longitude) : undefined,
      room_type: form.room_type as RoomType,
      price_per_month: Number(form.price_per_month),
      advance_months: Number(form.advance_months),
      tenancy_duration: form.tenancy_duration,
      amenities: form.amenities as Amenity[],
      photos: photoFiles.map((p) => p.url),
      status: "pending",
      is_free_listing: plan.id === "launch_free",
      listing_plan: plan.id,
      listing_fee_amount: plan.price,
      listing_fee_paid: false,
      is_featured: false,
      is_hidden: false,
      created_at: timestamp,
      updated_at: timestamp,
    };
    createListing(newListing);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex flex-col">
        <Nav />
        <div className="flex-1 flex flex-col items-center justify-center px-4 text-center py-20 space-y-5">
          <div className="w-20 h-20 bg-brand-light rounded-full flex items-center justify-center mx-auto">
            <Check className="w-10 h-10 text-brand" />
          </div>
          <h2 className="text-2xl font-bold text-[#0F172A]">Listing Submitted!</h2>
          <p className="text-sm text-[#64748B] max-w-xs leading-relaxed">
            Your <strong>{selectedPlan.name}</strong> listing is now <strong>pending review</strong>.
            If approved, {selectedPlan.price === 0 ? "it can go live free during launch." : `you'll pay GHS ${selectedPlan.price} by Mobile Money before it goes live.`}
          </p>
          <p className="text-sm text-[#94A3B8]">
            We'll contact you on <strong className="text-[#0F172A]">{form.landlord_phone}</strong>.
          </p>
          <div className="flex flex-col gap-3 w-full max-w-xs pt-2">
            <Link
              href="/landlord/dashboard"
              className="rd-button-primary font-semibold py-3 rounded-xl text-sm text-center  transition-colors"
            >
              View My Listings
            </Link>
            <button
              onClick={() => { setForm(INITIAL); setPhotoFiles([]); setSubmitted(false); setStep(0); }}
              className="text-brand font-medium text-sm py-2 hover:underline"
            >
              List Another Room
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-surface">
      <Nav />

      {/* Progress */}
      <div className="bg-[#FFF8EA]/88 border-b border-black/5 backdrop-blur-xl">
        <StepIndicator currentStep={step} />
      </div>

      <div className="flex-1 max-w-lg mx-auto w-full px-4 py-6 space-y-6">

        {/* Step 0: Details */}
        {step === 0 && (
          <div className="space-y-5">
            <h2 className="text-xl font-bold text-[#0F172A]">Room Details</h2>

            {/* Room type visual selector */}
            <div>
              <label className="block text-sm font-semibold text-[#0F172A] mb-2">
                Room Type <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-3 gap-2">
                {ROOM_TYPES.map((t) => {
                  const meta = ROOM_TYPE_ICONS[t] ?? { emoji: "ROOM" };
                  const selected = form.room_type === t;
                  return (
                    <button
                      key={t}
                      type="button"
                      onClick={() => set("room_type", t)}
                      className={`flex flex-col items-center gap-2 p-3 rounded-xl border-2 text-xs font-medium transition-all ${
                        selected
                          ? "border-brand bg-brand-light text-brand"
                          : "border-black/10 bg-white text-[#64748B] hover:border-gray-300"
                      }`}
                    >
                      <span className="text-2xl">{meta.emoji}</span>
                      <span className="text-center leading-tight">{t}</span>
                    </button>
                  );
                })}
              </div>
              {errors.room_type && <p className="text-xs text-red-500 mt-1">{errors.room_type}</p>}
            </div>

            {/* Title */}
            <div>
              <label className="block text-sm font-semibold text-[#0F172A] mb-1.5">
                Listing Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => set("title", e.target.value)}
                placeholder="e.g. Self-Contained at East Legon"
                className={`w-full bg-white border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand ${errors.title ? "border-red-400" : "border-black/10"}`}
              />
              {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title}</p>}
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold text-[#0F172A] mb-1.5">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                value={form.description}
                onChange={(e) => set("description", e.target.value)}
                placeholder="Describe the room: size, condition, water, power, surroundings..."
                rows={4}
                className={`w-full bg-white border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand resize-none ${errors.description ? "border-red-400" : "border-black/10"}`}
              />
              {errors.description && <p className="text-xs text-red-500 mt-1">{errors.description}</p>}
            </div>

            {/* Price */}
            <div>
              <label className="block text-sm font-semibold text-[#0F172A] mb-1.5">
                Monthly Rent <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-[#64748B] font-semibold">GHS</span>
                <input
                  type="number"
                  value={form.price_per_month}
                  onChange={(e) => set("price_per_month", e.target.value)}
                  placeholder="0"
                  min="1"
                  className={`w-full bg-white border rounded-xl pl-14 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand ${errors.price_per_month ? "border-red-400" : "border-black/10"}`}
                />
              </div>
              {errors.price_per_month && <p className="text-xs text-red-500 mt-1">{errors.price_per_month}</p>}
            </div>

            {/* Advance rent + tenancy duration - Ghana Rent Act 220 */}
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 space-y-4">
              <div className="flex items-start gap-2">
                <span className="text-lg shrink-0"></span>
                <div>
                  <h3 className="text-sm font-semibold text-amber-900">Ghana Rent Act 1963 (Act 220)</h3>
                  <p className="text-xs text-amber-700 mt-0.5">
                    The law limits advance rent to <strong>6 months maximum</strong>. Demanding more is an offence under Section 25.
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-amber-800 mb-1.5">
                    Advance Required (months)
                  </label>
                  <select
                    value={form.advance_months}
                    onChange={(e) => set("advance_months", e.target.value)}
                    className={`w-full bg-white border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand ${Number(form.advance_months) > 6 ? "border-red-400" : "border-amber-200"}`}
                  >
                    {[1,2,3,4,5,6,7,8,9,10,11,12,18,24].map((n) => (
                      <option key={n} value={n}>{n} month{n !== 1 ? "s" : ""}</option>
                    ))}
                  </select>
                  {Number(form.advance_months) > 6 && (
                    <p className="text-xs text-red-600 font-semibold mt-1"> Exceeds legal limit of 6 months</p>
                  )}
                </div>
                <div>
                  <label className="block text-xs font-semibold text-amber-800 mb-1.5">
                    Tenancy Duration
                  </label>
                  <select
                    value={form.tenancy_duration}
                    onChange={(e) => set("tenancy_duration", e.target.value)}
                    className="w-full bg-white border border-amber-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
                  >
                    {["6 months", "1 year", "2 years", "Flexible"].map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
              </div>
              {form.price_per_month && Number(form.advance_months) > 0 && (
                <div className="bg-white/80 rounded-xl px-3 py-2 border border-amber-200 flex items-center justify-between">
                  <span className="text-xs text-amber-800">Total advance due from tenant</span>
                  <span className="text-sm font-bold text-amber-900">
                    GHS {(Number(form.price_per_month) * Number(form.advance_months)).toLocaleString()}
                  </span>
                </div>
              )}
            </div>

            {/* Landlord info */}
            <div className="rd-card rounded-[1.35rem] p-4 space-y-4">
              <h3 className="text-sm font-semibold text-[#0F172A]">Your Contact Details</h3>
              <div>
                <label className="block text-sm font-medium text-[#64748B] mb-1.5">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={form.landlord_name}
                  onChange={(e) => set("landlord_name", e.target.value)}
                  placeholder="e.g. Kwame Asante"
                  className={`w-full bg-white border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand ${errors.landlord_name ? "border-red-400" : "border-black/10"}`}
                />
                {errors.landlord_name && <p className="text-xs text-red-500 mt-1">{errors.landlord_name}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-[#64748B] mb-1.5">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  value={form.landlord_phone}
                  onChange={(e) => set("landlord_phone", e.target.value)}
                  placeholder="e.g. 0244123456"
                  className={`w-full bg-white border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand ${errors.landlord_phone ? "border-red-400" : "border-black/10"}`}
                />
                {errors.landlord_phone && <p className="text-xs text-red-500 mt-1">{errors.landlord_phone}</p>}
                <p className="text-xs text-[#94A3B8] mt-1">Tenants will contact you directly on this number.</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#64748B] mb-1.5">
                  Ghana Card Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={form.landlord_ghana_card}
                  onChange={(e) => set("landlord_ghana_card", e.target.value.toUpperCase())}
                  placeholder="GHA-XXXXXXXXX-X"
                  maxLength={17}
                  className={`w-full bg-white border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand font-mono tracking-wide ${errors.landlord_ghana_card ? "border-red-400" : "border-black/10"}`}
                />
                {errors.landlord_ghana_card && <p className="text-xs text-red-500 mt-1">{errors.landlord_ghana_card}</p>}
                <p className="text-xs text-[#94A3B8] mt-1">
                   For identity verification only - never shown to tenants.
                </p>
              </div>

              {/* Passport photo upload */}
              <div>
                <label className="block text-sm font-medium text-[#64748B] mb-1.5">
                  Your Passport Photo <span className="text-red-500">*</span>
                </label>
                <input
                  ref={profilePhotoRef}
                  type="file"
                  accept="image/*"
                  className="sr-only"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    const url = await fileToDataUrl(file);
                    set("landlord_photo_url", url);
                  }}
                />
                {form.landlord_photo_url ? (
                  <div className="flex items-center gap-4">
                    <img
                      src={form.landlord_photo_url}
                      alt="Passport photo preview"
                      className="w-20 h-20 rounded-xl object-cover border-2 border-brand"
                    />
                    <div className="flex flex-col gap-2">
                      <span className="text-xs text-[#10B981] font-medium flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" /> Photo uploaded
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          set("landlord_photo_url", "");
                          if (profilePhotoRef.current) profilePhotoRef.current.value = "";
                        }}
                        className="text-xs text-red-500 hover:underline flex items-center gap-1"
                      >
                        <X className="w-3 h-3" /> Remove
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => profilePhotoRef.current?.click()}
                    className={`w-full border-2 border-dashed rounded-xl py-6 flex flex-col items-center gap-2 transition-colors ${
                      errors.landlord_photo_url
                        ? "border-red-400 bg-red-50"
                        : "border-black/10 hover:border-brand hover:bg-brand-light"
                    }`}
                  >
                    <User className="w-8 h-8 text-[#94A3B8]" />
                    <span className="text-sm font-medium text-[#64748B]">Tap to upload passport photo</span>
                    <span className="text-xs text-[#94A3B8]">Clear face photo, well-lit, plain background</span>
                  </button>
                )}
                {errors.landlord_photo_url && (
                  <p className="text-xs text-red-500 mt-1">{errors.landlord_photo_url}</p>
                )}
                <p className="text-xs text-[#94A3B8] mt-1">
                   Used for identity verification only - never shown to tenants.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Step 1: Location */}
        {step === 1 && (
          <div className="space-y-5">
            <h2 className="text-xl font-bold text-[#0F172A]">Location</h2>

            <div>
              <label className="block text-sm font-semibold text-[#0F172A] mb-1.5">
                Region <span className="text-red-500">*</span>
              </label>
              <select
                value={form.region}
                onChange={(e) => { set("region", e.target.value); set("location", ""); }}
                className={`w-full bg-white border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand ${errors.region ? "border-red-400" : "border-black/10"}`}
              >
                <option value="">Select region</option>
                {Object.keys(GHANA_REGIONS).map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
              {errors.region && <p className="text-xs text-red-500 mt-1">{errors.region}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#0F172A] mb-1.5">
                Area / Neighbourhood <span className="text-red-500">*</span>
              </label>
              <select
                value={form.location}
                onChange={(e) => set("location", e.target.value)}
                disabled={!form.region}
                className={`w-full bg-white border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand disabled:opacity-50 disabled:cursor-not-allowed ${errors.location ? "border-red-400" : "border-black/10"}`}
              >
                <option value="">{form.region ? "Select area" : "Select region first"}</option>
                {locationOptions.map((loc) => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>
              {errors.location && <p className="text-xs text-red-500 mt-1">{errors.location}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#0F172A] mb-1.5">
                Street Address / Landmark <span className="text-[#94A3B8] font-normal">(optional)</span>
              </label>
              <input
                type="text"
                value={form.address}
                onChange={(e) => set("address", e.target.value)}
                placeholder="e.g. Near Spintex Shell Station"
                className="w-full bg-white border border-black/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
              />
            </div>

            {/* Ghana Post GPS */}
            <div className="rd-card rounded-[1.35rem] p-4 space-y-4">
              <div className="flex items-start gap-2">
                <span className="text-lg"></span>
                <div>
                  <h3 className="text-sm font-semibold text-[#0F172A]">Precise Location</h3>
                  <p className="text-xs text-[#64748B] mt-0.5">Help tenants find your property exactly.</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#64748B] mb-1.5">
                  Ghana Post GPS Address <span className="text-[#94A3B8] font-normal">(optional)</span>
                </label>
                <input
                  type="text"
                  value={form.ghana_post_gps}
                  onChange={(e) => set("ghana_post_gps", e.target.value.toUpperCase())}
                  placeholder="e.g. GA-123-4567"
                  maxLength={12}
                  className="w-full bg-white border border-black/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand font-mono tracking-wide"
                />
                <p className="text-xs text-[#94A3B8] mt-1">
                  Find your code at <span className="font-medium">ghanapostgps.com</span> or via the GhanaPostGPS app.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-[#64748B] mb-1.5">
                    Latitude <span className="text-[#94A3B8] font-normal">(optional)</span>
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={form.latitude}
                    onChange={(e) => set("latitude", e.target.value)}
                    placeholder="e.g. 5.6037"
                    className="w-full bg-white border border-black/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#64748B] mb-1.5">
                    Longitude <span className="text-[#94A3B8] font-normal">(optional)</span>
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={form.longitude}
                    onChange={(e) => set("longitude", e.target.value)}
                    placeholder="e.g. -0.1870"
                    className="w-full bg-white border border-black/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
                  />
                </div>
              </div>
              <p className="text-xs text-[#94A3B8]">
                 Open Google Maps, long-press your property, and copy the coordinates shown.
              </p>
            </div>
          </div>
        )}

        {/* Step 2: Photos & Amenities */}
        {step === 2 && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-[#0F172A]">Photos & Amenities</h2>

            {/* Photo upload */}
            <div>
              <label className="block text-sm font-semibold text-[#0F172A] mb-2">Photos</label>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full border-2 border-dashed border-black/10 hover:border-brand rounded-2xl p-8 text-center transition-colors group"
              >
                <Upload className="w-8 h-8 mx-auto mb-2 text-[#94A3B8] group-hover:text-brand transition-colors" />
                <p className="text-sm font-medium text-[#64748B] group-hover:text-brand">Tap to add photos</p>
                <p className="text-xs text-[#94A3B8] mt-1">or drag & drop here</p>
              </button>

              {photoFiles.length > 0 && (
                <div className="grid grid-cols-3 gap-2 mt-3">
                  {photoFiles.map((pf, idx) => (
                    <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border border-black/10">
                      <img src={pf.url} alt="" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => removePhoto(idx)}
                        className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-0.5 hover:bg-black/80"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Amenities by category */}
            <div className="space-y-4">
              <label className="block text-sm font-semibold text-[#0F172A]">Amenities</label>
              {AMENITY_CATEGORIES.map((cat) => (
                <div key={cat.label}>
                  <p className="text-xs font-bold text-[#94A3B8] uppercase tracking-wider mb-2">{cat.label}</p>
                  <div className="grid grid-cols-2 gap-2">
                    {cat.amenities.map((a) => {
                      const checked = form.amenities.includes(a);
                      return (
                        <label
                          key={a}
                          className={`flex items-center gap-2.5 p-2.5 rounded-xl border cursor-pointer transition-all text-sm ${
                            checked
                              ? "border-brand bg-brand-light text-brand"
                              : "border-black/10 bg-white text-[#64748B] hover:border-gray-300"
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => toggleAmenity(a)}
                            className="sr-only"
                          />
                          <AmenityIcon amenity={a} size={15} />
                          <span className="font-medium leading-tight">{a}</span>
                          {checked && <Check className="w-3.5 h-3.5 ml-auto shrink-0" />}
                        </label>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Review */}
        {step === 3 && (
          <div className="space-y-5">
            <h2 className="text-xl font-bold text-[#0F172A]">Review & Submit</h2>

            {/* Mini preview card */}
            <div className="rd-card rounded-[1.35rem] overflow-hidden shadow-sm">
              <div className="aspect-[16/9] bg-gray-100 relative overflow-hidden">
                {photoFiles[0] ? (
                  <img src={photoFiles[0].url} alt="" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Home className="w-10 h-10 text-gray-300" />
                  </div>
                )}
              </div>
              <div className="p-4 space-y-1">
                <p className="font-bold text-brand text-lg">
                  GHS {form.price_per_month ? Number(form.price_per_month).toLocaleString() : "-"}/mo
                </p>
                <p className="font-semibold text-[#0F172A] text-sm">{form.title || "-"}</p>
                <p className="text-xs text-[#64748B]">{form.location && form.region ? `${form.location}, ${form.region}` : "-"}</p>
                {form.room_type && (
                  <span className="inline-block text-xs bg-brand-light text-brand px-2 py-0.5 rounded-full font-medium">
                    {form.room_type}
                  </span>
                )}
              </div>
            </div>

            {/* Summary */}
            <div className="rd-card rounded-[1.35rem] divide-y divide-[#E2E8F0]">
              {[
                { label: "Landlord", value: form.landlord_name, step: 0 },
                { label: "Phone", value: form.landlord_phone, step: 0 },
                { label: "Ghana Card", value: form.landlord_ghana_card, step: 0 },
                { label: "Passport Photo", value: form.landlord_photo_url ? "Uploaded" : "Not uploaded", step: 0 },
                { label: "Region", value: form.region, step: 1 },
                { label: "Location", value: form.location, step: 1 },
                { label: "Address", value: form.address || "-", step: 1 },
                { label: "Amenities", value: form.amenities.length > 0 ? `${form.amenities.length} selected` : "None", step: 2 },
                { label: "Photos", value: `${photoFiles.length} photo${photoFiles.length !== 1 ? "s" : ""}`, step: 2 },
                { label: "Plan", value: `${selectedPlan.name} - GHS ${selectedPlan.price}`, step: 3 },
              ].map((row) => (
                <div key={row.label} className="flex items-center justify-between px-4 py-3">
                  <span className="text-sm text-[#64748B]">{row.label}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-[#0F172A] text-right">{row.value || "-"}</span>
                    <button
                      type="button"
                      onClick={() => setStep(row.step)}
                      className="text-xs text-brand font-medium hover:underline"
                    >
                      Edit
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Advance rent summary */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-amber-800">Advance Required</p>
                <p className="text-xs text-amber-700">{form.advance_months} months - {form.tenancy_duration} lease</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-amber-900">
                  GHS {(Number(form.price_per_month || 0) * Number(form.advance_months)).toLocaleString()}
                </p>
                {Number(form.advance_months) > 6 && (
                  <p className="text-[10px] text-red-600 font-bold"> Exceeds legal limit</p>
                )}
              </div>
            </div>

            {/* Listing plan */}
            <div className="rd-card rounded-[1.35rem] p-4 space-y-3">
              <div>
                <p className="text-sm font-bold text-[#0F172A]">Choose how this listing makes money</p>
                <p className="text-xs text-[#64748B] mt-0.5">Tenants browse free. Landlords pay only for publishing or extra visibility.</p>
              </div>
              <div className="space-y-2">
                {LISTING_PLANS.map((plan) => {
                  const selected = form.listing_plan === plan.id;
                  return (
                    <button
                      key={plan.id}
                      type="button"
                      onClick={() => set("listing_plan", plan.id)}
                      className={`w-full text-left rounded-xl border-2 p-3 transition-all ${
                        selected ? "border-brand bg-brand-light" : "border-black/10 hover:border-brand/50"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-sm font-black text-[#0F172A]">{plan.name}</p>
                          <p className="text-xs text-[#64748B] mt-0.5">{plan.tagline}</p>
                          <p className="text-[11px] text-brand font-bold mt-1">{plan.bestFor}</p>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-base font-black text-brand">GHS {plan.price}</p>
                          <p className="text-[10px] text-[#94A3B8]">{plan.durationDays} days</p>
                        </div>
                      </div>
                      {selected && (
                        <p className="text-xs text-[#0F172A] bg-white/80 border border-black/5 rounded-xl px-3 py-2 mt-2">
                          {plan.promise}
                        </p>
                      )}
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {plan.benefits.map((benefit) => (
                          <span key={benefit} className="text-[10px] font-semibold bg-white border border-black/10 text-[#64748B] px-2 py-0.5 rounded-full">
                            {benefit}
                          </span>
                        ))}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <PricingTrustPanel />

            {/* Data consent */}
            <label className="flex items-start gap-3 cursor-pointer bg-white border border-black/10 rounded-xl p-4">
              <input
                type="checkbox"
                checked={form.data_consent}
                onChange={(e) => set("data_consent", e.target.checked)}
                className="mt-0.5 w-4 h-4 accent-brand shrink-0"
              />
              <p className="text-xs text-[#64748B] leading-relaxed">
                I confirm that I am the legitimate owner or authorised agent for this property. I consent to RentDirect storing my details per the{" "}
                <strong className="text-[#0F172A]">Ghana Data Protection Act 2012</strong>, and I agree to comply with the{" "}
                <strong className="text-[#0F172A]">Rent Act 1963 (Act 220)</strong> including the 6-month advance rent limit.
              </p>
            </label>

            {/* Notice */}
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-sm text-blue-800">
              <p className="font-semibold mb-1">What happens next?</p>
              <p className="text-xs leading-relaxed text-blue-700">
                After submitting, our admin team reviews your listing. They may approve it for free,
                or request a small listing fee. We'll contact you via your phone number.
              </p>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex gap-3 pt-2 pb-10">
          {step > 0 && (
            <button
              type="button"
              onClick={back}
              className="flex items-center gap-2 px-5 py-3 border-2 border-black/10 rounded-xl text-sm font-semibold text-[#64748B] hover:border-gray-300 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              Back
            </button>
          )}
          {step < STEPS.length - 1 ? (
            <button
              type="button"
              onClick={next}
              className="flex-1 flex items-center justify-center gap-2 rd-button-primary font-semibold py-3 rounded-xl text-sm  transition-colors"
            >
              Continue
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!form.data_consent}
              className="flex-1 flex items-center justify-center gap-2 rd-button-primary font-bold py-3 rounded-xl text-base  transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Submit for Review
            </button>
          )}
        </div>
      </div>
    </div>
  );
}






