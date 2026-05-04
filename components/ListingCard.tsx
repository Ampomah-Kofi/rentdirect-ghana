"use client";

import Link from "next/link";
import { MapPin, Camera, Heart, GitCompare, Sparkles } from "lucide-react";
import { AmenityIcon } from "./AmenityIcon";
import type { Room } from "@/lib/types";
import { isFeaturedListing } from "@/lib/monetization";
import { useFavoritesContext } from "@/components/providers/FavoritesProvider";
import { useCompare } from "@/components/providers/CompareProvider";

function isNew(createdAt: string): boolean {
  const days = (Date.now() - new Date(createdAt).getTime()) / (1000 * 60 * 60 * 24);
  return days <= 30;
}

export default function ListingCard({ listing }: { listing: Room }) {
  const { isSaved, toggle } = useFavoritesContext();
  const { inCompare, addToCompare, removeFromCompare, compareIds } = useCompare();
  const saved = isSaved(listing.id);
  const comparing = inCompare(listing.id);
  const compareFull = compareIds.length >= 3 && !comparing;
  const fresh = isNew(listing.created_at);
  const featured = isFeaturedListing(listing);
  const topAmenities = listing.amenities.slice(0, 4);

  return (
    <div className="group relative animate-reveal-scale">
      <Link href={`/listings/${listing.id}`} className="block">
        <div className={`rd-card rounded-[1.35rem] overflow-hidden transition-all duration-300 group-hover:shadow-[0_24px_70px_rgba(16,26,24,0.14)] group-hover:scale-[1.018] group-hover:-translate-y-1 ${
          featured ? "border-amber-300 ring-2 ring-amber-100" : ""
        }`}>
          <div className="relative aspect-4/3 bg-[#EDE2CE] overflow-hidden">
            {listing.photos[0] ? (
              <img
                src={listing.photos[0]}
                alt={listing.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-300">
                <Camera className="w-10 h-10" />
              </div>
            )}

            <div className="absolute top-2 left-2 flex flex-col gap-1">
              {featured && (
                <span className="inline-flex items-center gap-1 bg-[#F2B84B] text-[#101A18] text-[10px] font-black px-2 py-0.5 rounded-full shadow-sm tracking-wide uppercase">
                  <Sparkles className="w-3 h-3" />
                  Featured
                </span>
              )}
              {fresh && (
                <span className="bg-[#B85B34] text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm tracking-wide uppercase">
                  New
                </span>
              )}
              {listing.status === "live" && !listing.is_hidden && (
                <span className="bg-brand text-white text-[10px] font-semibold px-2 py-0.5 rounded-full shadow-sm">
                  Live
                </span>
              )}
            </div>

            {listing.photos.length > 1 && (
              <div className="absolute bottom-2 left-2 flex items-center gap-1 bg-black/60 text-white text-xs px-2 py-0.5 rounded-full">
                <Camera className="w-3 h-3" />
                <span>{listing.photos.length}</span>
              </div>
            )}
          </div>

          <div className="p-3.5">
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-black text-brand">
                GHS {listing.price_per_month.toLocaleString()}
              </span>
              <span className="text-xs text-[#94A3B8]">/mo</span>
            </div>

            <p className="text-sm font-black text-[#101A18] mt-0.5 truncate leading-snug">
              {listing.title}
            </p>

            <div className="flex items-center gap-1 mt-1">
              <MapPin className="w-3 h-3 text-[#94A3B8] shrink-0" />
              <span className="text-xs text-[#64748B] truncate">
                {listing.location} - {listing.region}
              </span>
            </div>

            <div className="mt-1.5">
              <span className="inline-block text-xs font-bold bg-brand-light text-brand px-2.5 py-1 rounded-full border border-brand/10">
                {listing.room_type}
              </span>
            </div>

            {topAmenities.length > 0 && (
              <div className="flex items-center gap-2 mt-2 pt-2 border-t border-black/5">
                {topAmenities.map((amenity) => (
                  <div key={amenity} title={amenity}>
                    <AmenityIcon amenity={amenity} size={14} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </Link>

      <button
        onClick={(e) => { e.preventDefault(); toggle(listing.id); }}
        aria-label={saved ? "Remove from saved" : "Save listing"}
        className={`absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center shadow-md transition-all duration-200 ${
          saved
            ? "bg-red-500 text-white scale-110"
            : "bg-white/92 text-gray-500 hover:text-red-400 hover:scale-110"
        }`}
      >
        <Heart className={`w-4 h-4 ${saved ? "fill-white" : ""}`} />
      </button>

      <button
        onClick={(e) => {
          e.preventDefault();
          comparing ? removeFromCompare(listing.id) : addToCompare(listing.id);
        }}
        disabled={compareFull}
        title={compareFull ? "Max 3 listings" : comparing ? "Remove from compare" : "Compare this listing"}
        aria-label="Compare"
        className={`absolute top-2 right-11 w-8 h-8 rounded-full flex items-center justify-center shadow-md transition-all duration-200 ${
          comparing
            ? "bg-brand text-white scale-110"
            : compareFull
            ? "bg-white/60 text-gray-300 cursor-not-allowed"
            : "bg-white/92 text-gray-500 hover:text-brand hover:scale-110"
        }`}
      >
        <GitCompare className="w-4 h-4" />
      </button>
    </div>
  );
}
