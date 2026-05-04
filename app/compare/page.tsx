"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, CheckCircle, XCircle, MapPin, Phone } from "lucide-react";
import { useListings } from "@/components/providers/ListingsProvider";
import { AmenityIcon } from "@/components/AmenityIcon";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import type { Room } from "@/lib/types";
import type { Amenity } from "@/lib/ghana-locations";

const ALL_AMENITIES = [
  "Air Conditioning", "Generator", "Borehole", "Water Tank", "Prepaid Meter",
  "Security Guard", "CCTV", "Gated Community", "Parking", "Indoor Toilet",
  "Bathroom", "Tiled Floor", "Ceiling Fan", "Internet/WiFi", "Furnished",
  "Kitchen", "Compound",
];

function ComparePage() {
  const searchParams = useSearchParams();
  const ids = (searchParams.get("ids") ?? "").split(",").filter(Boolean);
  const { listings } = useListings();
  const rooms = ids.map((id) => listings.find((l) => l.id === id)).filter((l): l is Room => !!l);

  if (rooms.length < 2) {
    return (
      <div className="min-h-screen flex flex-col">
        <Nav />
        <div className="flex-1 flex flex-col items-center justify-center gap-4 px-4 text-center">
          <p className="text-[#64748B]">Select at least 2 listings to compare.</p>
          <Link href="/" className="text-brand font-medium underline text-sm">Browse listings</Link>
        </div>
      </div>
    );
  }

  const colW = rooms.length === 2 ? "w-1/2" : "w-1/3";

  return (
    <div className="min-h-screen flex flex-col bg-surface">
      <Nav />

      {/* Back bar */}
      <div className="bg-white border-b border-[#E2E8F0] sticky top-14 z-40">
        <div className="max-w-5xl mx-auto px-4 h-11 flex items-center gap-3">
          <Link href="/" className="flex items-center gap-1.5 text-sm text-[#64748B] hover:text-[#0F172A]">
            <ArrowLeft className="w-4 h-4" />
            Back to browse
          </Link>
          <span className="text-[#E2E8F0]">|</span>
          <span className="text-xs text-[#94A3B8]">Comparing {rooms.length} listings</span>
        </div>
      </div>

      <div className="max-w-5xl mx-auto w-full px-4 py-6 flex-1">
        <h1 className="text-xl font-bold text-[#0F172A] mb-6">Side-by-Side Comparison</h1>

        {/* Photos + title row */}
        <div className="flex gap-3 mb-4">
          {rooms.map((room) => (
            <div key={room.id} className={`${colW} bg-white rounded-2xl border border-[#E2E8F0] overflow-hidden shadow-sm`}>
              <div className="aspect-4/3 bg-gray-100 overflow-hidden">
                {room.photos[0] ? (
                  <img src={room.photos[0]} alt="" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gray-100" />
                )}
              </div>
              <div className="p-3">
                <p className="text-sm font-bold text-[#0F172A] leading-snug line-clamp-2">{room.title}</p>
                <p className="text-xs text-[#64748B] flex items-center gap-1 mt-1">
                  <MapPin className="w-3 h-3 shrink-0" />
                  {room.location}, {room.region}
                </p>
                <Link
                  href={`/listings/${room.id}`}
                  className="mt-2 block text-center text-xs font-semibold text-brand border border-brand rounded-xl py-1.5 hover:bg-brand-light transition-colors"
                >
                  View Listing
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Key stats */}
        <div className="bg-white rounded-2xl border border-[#E2E8F0] overflow-hidden shadow-sm mb-4">
          {[
            {
              label: "Monthly Rent",
              render: (r: Room) => <span className="text-brand font-bold">GHS {r.price_per_month.toLocaleString()}</span>,
            },
            {
              label: "Advance Required",
              render: (r: Room) => (
                <span className={`font-semibold ${(r.advance_months ?? 6) > 6 ? "text-red-600" : "text-[#0F172A]"}`}>
                  {r.advance_months ?? 6} months
                  {(r.advance_months ?? 6) > 6 && " "}
                </span>
              ),
            },
            {
              label: "Advance Total",
              render: (r: Room) => (
                <span className="font-bold text-amber-700">
                  GHS {(r.price_per_month * (r.advance_months ?? 6)).toLocaleString()}
                </span>
              ),
            },
            {
              label: "Annual Cost",
              render: (r: Room) => <span className="font-semibold text-[#0F172A]">GHS {(r.price_per_month * 12).toLocaleString()}</span>,
            },
            {
              label: "Room Type",
              render: (r: Room) => <span className="text-xs bg-brand-light text-brand px-2 py-0.5 rounded-full font-medium">{r.room_type}</span>,
            },
            {
              label: "Tenancy",
              render: (r: Room) => <span className="text-sm text-[#0F172A]">{r.tenancy_duration ?? "Flexible"}</span>,
            },
            {
              label: "Landlord",
              render: (r: Room) => (
                <span className="text-sm text-[#0F172A] flex items-center gap-1">
                  {r.landlord_name}
                  <span className="text-[9px] font-bold text-brand border border-brand/40 bg-brand-light px-1 rounded">[Owner]</span>
                </span>
              ),
            },
            {
              label: "Contact",
              render: (r: Room) => (
                <a href={`tel:${r.landlord_phone}`} className="text-xs text-brand font-semibold flex items-center gap-1 hover:underline">
                  <Phone className="w-3 h-3" />{r.landlord_phone}
                </a>
              ),
            },
          ].map(({ label, render }) => (
            <div key={label} className="flex border-b border-[#E2E8F0] last:border-0">
              <div className="w-28 shrink-0 px-4 py-3 bg-surface flex items-center">
                <span className="text-xs font-semibold text-[#64748B]">{label}</span>
              </div>
              <div className="flex flex-1">
                {rooms.map((room) => (
                  <div key={room.id} className={`${colW} px-4 py-3 flex items-center border-l border-[#E2E8F0]`}>
                    {render(room)}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Amenities comparison */}
        <div className="bg-white rounded-2xl border border-[#E2E8F0] overflow-hidden shadow-sm mb-6">
          <div className="px-4 py-3 border-b border-[#E2E8F0] bg-surface">
            <p className="text-sm font-bold text-[#0F172A]">Amenities</p>
          </div>
          {ALL_AMENITIES.filter((a) => rooms.some((r) => r.amenities.includes(a as Amenity))).map((amenity) => (
            <div key={amenity} className="flex border-b border-[#F1F5F9] last:border-0">
              <div className="w-28 shrink-0 px-4 py-2.5 bg-surface flex items-center gap-1.5">
                <AmenityIcon amenity={amenity} size={13} />
                <span className="text-xs text-[#64748B] truncate">{amenity}</span>
              </div>
              <div className="flex flex-1">
                {rooms.map((room) => (
                  <div key={room.id} className={`${colW} px-4 py-2.5 flex items-center border-l border-[#E2E8F0]`}>
                    {room.amenities.includes(amenity as Amenity) ? (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    ) : (
                      <XCircle className="w-4 h-4 text-gray-200" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="flex gap-3">
          {rooms.map((room) => (
            <Link
              key={room.id}
              href={`/listings/${room.id}`}
              className={`${colW} flex items-center justify-center gap-2 bg-brand text-white font-bold py-3.5 rounded-2xl text-sm hover:bg-brand-hover transition-colors`}
            >
              Choose: {room.location}
            </Link>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default function ComparePageWrapper() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><p className="text-[#64748B]">Loading...</p></div>}>
      <ComparePage />
    </Suspense>
  );
}



