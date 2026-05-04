"use client";

import { useState, useMemo, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { MapPin, ChevronDown, SlidersHorizontal, X, Home, Heart, TrendingUp, Shield, Users, ArrowUpDown, Map, LayoutGrid } from "lucide-react";
import { useListings } from "@/components/providers/ListingsProvider";
import { GHANA_REGIONS, ROOM_TYPES, PRICE_RANGES } from "@/lib/ghana-locations";
import { isFeaturedListing } from "@/lib/monetization";
import { getBrowsableListings } from "@/lib/listing-workflow";
import ListingCard from "@/components/ListingCard";
import { SkeletonCard } from "@/components/ui/Skeleton";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { useFavoritesContext } from "@/components/providers/FavoritesProvider";
import type { Room } from "@/lib/types";

const POPULAR_REGIONS = ["Greater Accra", "Ashanti", "Western"];

type SortKey = "newest" | "price_asc" | "price_desc";
const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: "newest", label: "Newest first" },
  { key: "price_asc", label: "Price: Low to High" },
  { key: "price_desc", label: "Price: High to Low" },
];

function sortListings(list: Room[], sort: SortKey): Room[] {
  const copy = [...list];
  const featuredBoost = (a: Room, b: Room) => Number(isFeaturedListing(b)) - Number(isFeaturedListing(a));
  if (sort === "price_asc") return copy.sort((a, b) => featuredBoost(a, b) || a.price_per_month - b.price_per_month);
  if (sort === "price_desc") return copy.sort((a, b) => featuredBoost(a, b) || b.price_per_month - a.price_per_month);
  return copy.sort((a, b) => featuredBoost(a, b) || new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
}

function MapView({ listings }: { listings: Room[] }) {
  const [selected, setSelected] = useState<Room | null>(null);
  // Build a query from all locations to show a general Ghana map centered per filter
  const firstListing = listings[0];
  const mapQuery = firstListing
    ? `${firstListing.location}, ${firstListing.region}, Ghana`
    : "Ghana";

  return (
    <div className="space-y-3">
      {/* Embedded map showing the first listing's area */}
      <div className="relative rounded-2xl overflow-hidden border border-[#E2E8F0] shadow-sm" style={{ height: "420px" }}>
        <iframe
          src={`https://maps.google.com/maps?q=${encodeURIComponent(mapQuery)}&output=embed&z=12`}
          width="100%"
          height="100%"
          className="absolute inset-0 w-full h-full"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Browse listings map"
        />
        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm rounded-xl px-3 py-1.5 text-xs font-semibold text-[#0F172A] shadow">
          {listings.length} listing{listings.length !== 1 ? "s" : ""} in this area
        </div>
      </div>

      {/* Horizontal scroll list of listing cards below map */}
      <p className="text-xs text-[#94A3B8] font-medium px-1">Tap a listing to see it on the map</p>
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
        {listings.map((l) => (
          <button
            key={l.id}
            onClick={() => setSelected(selected?.id === l.id ? null : l)}
            className={`shrink-0 w-56 text-left rounded-2xl border-2 overflow-hidden transition-all ${
              selected?.id === l.id ? "border-brand shadow-md" : "border-[#E2E8F0] hover:border-brand/40"
            }`}
          >
            <div className="h-28 bg-gray-100 relative overflow-hidden">
              {l.photos[0] ? (
                <img src={l.photos[0]} alt="" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Home className="w-8 h-8 text-gray-300" />
                </div>
              )}
              <span className="absolute bottom-2 left-2 bg-brand text-white text-xs font-bold px-2 py-0.5 rounded-full">
                GHS {l.price_per_month.toLocaleString()}/mo
              </span>
            </div>
            <div className="p-2.5 bg-white">
              <p className="text-xs font-semibold text-[#0F172A] truncate">{l.title}</p>
              <p className="text-[10px] text-[#64748B] flex items-center gap-1 mt-0.5">
                <MapPin className="w-2.5 h-2.5 shrink-0" />
                {l.location}, {l.region}
              </p>
            </div>
          </button>
        ))}
      </div>

      {/* Selected listing detail strip */}
      {selected && (
        <div className="bg-brand-light border border-green-200 rounded-2xl p-4 flex items-center gap-4">
          {selected.photos[0] && (
            <img src={selected.photos[0]} alt="" className="w-14 h-14 rounded-xl object-cover shrink-0" />
          )}
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-[#0F172A] text-sm truncate">{selected.title}</p>
            <p className="text-xs text-[#64748B]">{selected.location}, {selected.region}</p>
            <p className="text-sm font-bold text-brand mt-0.5">GHS {selected.price_per_month.toLocaleString()}/mo</p>
          </div>
          <a
            href={`/listings/${selected.id}`}
            className="shrink-0 bg-brand text-white text-xs font-bold px-4 py-2.5 rounded-xl hover:bg-brand-hover transition-colors"
          >
            View details
          </a>
        </div>
      )}
    </div>
  );
}

function BrowseContent() {
  const { listings: rawListings } = useListings();
  const allListings = getBrowsableListings(rawListings);
  const searchParams = useSearchParams();
  const showSaved = searchParams.get("saved") === "1";
  const { isSaved, count: savedCount } = useFavoritesContext();

  const [searchQuery, setSearchQuery] = useState(() => searchParams.get("q") ?? "");
  const [selectedRegion, setSelectedRegion] = useState(() => searchParams.get("region") ?? "");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedRoomType, setSelectedRoomType] = useState("");
  const [selectedPriceRange, setSelectedPriceRange] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("newest");
  const [loading, setLoading] = useState(true);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "map">("grid");

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(t);
  }, []);

  const locationOptions = selectedRegion ? (GHANA_REGIONS[selectedRegion] ?? []) : [];

  const filtered = useMemo(() => {
    let list = allListings.filter((l) => {
      if (showSaved && !isSaved(l.id)) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        if (
          !l.title.toLowerCase().includes(q) &&
          !l.location.toLowerCase().includes(q) &&
          !l.region.toLowerCase().includes(q) &&
          !l.description.toLowerCase().includes(q)
        ) return false;
      }
      if (selectedRegion && l.region !== selectedRegion) return false;
      if (selectedLocation && l.location !== selectedLocation) return false;
      if (selectedRoomType && l.room_type !== selectedRoomType) return false;
      if (selectedPriceRange) {
        const range = PRICE_RANGES.find((r) => r.label === selectedPriceRange);
        if (range && (l.price_per_month < range.min || l.price_per_month > range.max)) return false;
      }
      return true;
    });
    return sortListings(list, sortKey);
  }, [allListings, searchQuery, selectedRegion, selectedLocation, selectedRoomType, selectedPriceRange, sortKey, showSaved, isSaved]);

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedRegion("");
    setSelectedLocation("");
    setSelectedRoomType("");
    setSelectedPriceRange("");
  };

  const activeFilterCount = [selectedRegion, selectedLocation, selectedRoomType, selectedPriceRange].filter(Boolean).length;
  const hasFilters = searchQuery || activeFilterCount > 0;

  const toggleDropdown = (name: string) => setOpenDropdown((prev) => (prev === name ? null : name));

  const regionLabel = selectedRegion || "All Regions";
  const priceLabel = selectedPriceRange || "Any Price";
  const typeLabel = selectedRoomType || "Room Type";
  const locationLabel = selectedLocation || (selectedRegion ? "All Areas" : "Location");
  const sortLabel = SORT_OPTIONS.find((o) => o.key === sortKey)?.label ?? "Sort";

  return (
    <div className="min-h-screen flex flex-col">
      <Nav />

      {/* Hero */}
      <section
        className="relative text-white text-center py-18 px-4 overflow-hidden rd-grain"
        style={{ background: "linear-gradient(135deg, #101A18 0%, #073B2D 48%, #0B6B4B 100%)" }}
      >
        <div
          className="absolute inset-0 opacity-10"
          style={{ backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)", backgroundSize: "24px 24px" }}
        />
        <div className="relative max-w-2xl mx-auto">
          <p className="text-[#F2B84B] text-xs font-black tracking-[0.24em] uppercase mb-3">Verified Ghana rooms - direct landlords</p>
          <h1 className="text-4xl sm:text-6xl font-black leading-[0.98] mb-3 tracking-tight">Find the room.<br />Skip the agent.</h1>
          <p className="text-base sm:text-xl font-medium text-green-100/75 mb-8">Search live rooms, compare advance rent, and contact landlords directly.</p>

          {/* Search bar */}
          <div className="bg-white/95 rounded-[1.35rem] shadow-2xl p-2 flex items-center gap-2 max-w-xl mx-auto border border-white/30">
            <MapPin className="w-5 h-5 text-[#94A3B8] ml-2 shrink-0" />
            <input
              type="text"
              placeholder="Search by area, region or room type..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 py-2 px-1 text-[#0F172A] text-sm placeholder-[#94A3B8] outline-none bg-transparent"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery("")} className="p-1 text-[#94A3B8] hover:text-[#0F172A]">
                <X className="w-4 h-4" />
              </button>
            )}
            <button className="rd-button-primary rounded-xl px-4 py-2 text-sm font-black transition-colors shrink-0">
              Search
            </button>
          </div>

          {/* Popular chips */}
          <div className="flex items-center justify-center gap-2 mt-4 flex-wrap">
            <span className="text-green-200 text-xs font-medium">Popular:</span>
            {POPULAR_REGIONS.map((r) => (
              <button
                key={r}
                onClick={() => { setSelectedRegion(r); setSelectedLocation(""); }}
                className={`text-xs px-3 py-1 rounded-full border transition-colors ${
                  selectedRegion === r
                    ? "bg-[#F2B84B] text-[#101A18] border-[#F2B84B] font-black"
                    : "border-white/30 text-white hover:bg-white/10"
                }`}
              >
                {r}
              </button>
            ))}
          </div>

          <p className="text-green-200 text-sm mt-4">
            {allListings.length} rooms available - no agent commission
          </p>
        </div>
      </section>

      {/* Trust strip */}
      <div className="bg-[#FFF8EA]/85 border-b border-black/5 backdrop-blur">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-center gap-4 sm:gap-8 flex-wrap">
          {[
            { icon: Shield, label: "Ghana Card Verified Landlords", color: "text-brand" },
            { icon: Users, label: "Talk Direct - No Agent", color: "text-blue-500" },
            { icon: TrendingUp, label: "Zero Commission", color: "text-amber-500" },
            { emoji: "LAW", label: "Rent Act Compliant", color: "text-[#64748B]" },
          ].map(({ icon: Icon, emoji, label, color }: { icon?: React.ComponentType<{className?: string}>; emoji?: string; label: string; color: string }) => (
            <div key={label} className="flex items-center gap-1.5">
              {Icon ? <Icon className={`w-4 h-4 ${color}`} /> : <span className="text-sm">{emoji}</span>}
              <span className="text-xs font-semibold text-[#64748B]">{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Saved shelf - shown when ?saved=1 */}
      {showSaved && (
        <div className="bg-red-50 border-b border-red-100 px-4 py-2.5">
          <div className="max-w-7xl mx-auto flex items-center gap-2">
            <Heart className="w-4 h-4 text-red-500 fill-red-500" />
            <span className="text-sm font-semibold text-red-700">
              Saved listings ({savedCount})
            </span>
            <a href="/" className="ml-auto text-xs text-red-500 font-medium hover:underline">
              Browse all
            </a>
          </div>
        </div>
      )}

      {/* Filter bar */}
      <div className="bg-white border-b border-[#E2E8F0] sticky top-14 z-40">
        <div className="max-w-7xl mx-auto px-4 py-2.5 overflow-x-auto">
          <div className="flex items-center gap-2 min-w-max">
            {/* Region pill */}
            <button
              onClick={() => toggleDropdown("region")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                selectedRegion ? "bg-brand text-white border-brand" : "bg-white text-[#64748B] border-[#E2E8F0] hover:border-brand"
              }`}
            >
              {regionLabel}
              <ChevronDown className="w-3.5 h-3.5" />
            </button>

            {/* Location pill */}
            {selectedRegion && (
              <button
                onClick={() => toggleDropdown("location")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                  selectedLocation ? "bg-brand text-white border-brand" : "bg-white text-[#64748B] border-[#E2E8F0] hover:border-brand"
                }`}
              >
                {locationLabel}
                <ChevronDown className="w-3.5 h-3.5" />
              </button>
            )}

            {/* Price pill */}
            <button
              onClick={() => toggleDropdown("price")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                selectedPriceRange ? "bg-brand text-white border-brand" : "bg-white text-[#64748B] border-[#E2E8F0] hover:border-brand"
              }`}
            >
              {priceLabel}
              <ChevronDown className="w-3.5 h-3.5" />
            </button>

            {/* Room type pill */}
            <button
              onClick={() => toggleDropdown("type")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                selectedRoomType ? "bg-brand text-white border-brand" : "bg-white text-[#64748B] border-[#E2E8F0] hover:border-brand"
              }`}
            >
              {typeLabel}
              <ChevronDown className="w-3.5 h-3.5" />
            </button>

            {/* Sort pill */}
            <button
              onClick={() => toggleDropdown("sort")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                sortKey !== "newest" ? "bg-brand text-white border-brand" : "bg-white text-[#64748B] border-[#E2E8F0] hover:border-brand"
              }`}
            >
              <ArrowUpDown className="w-3.5 h-3.5" />
              {sortLabel}
            </button>

            {/* Clear */}
            {hasFilters && (
              <button
                onClick={clearFilters}
                className="flex items-center gap-1 text-xs text-[#64748B] hover:text-[#0F172A] px-2 py-1.5 rounded-full border border-[#E2E8F0] hover:border-gray-400 transition-colors"
              >
                <X className="w-3 h-3" />
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Dropdown panels - outside overflow container */}
        {openDropdown === "region" && (
          <div className="absolute top-full left-4 mt-0 bg-white rounded-xl shadow-lg border border-[#E2E8F0] py-1 z-50 max-h-60 overflow-y-auto w-56">
            <button
              className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 text-[#64748B]"
              onClick={() => { setSelectedRegion(""); setSelectedLocation(""); setOpenDropdown(null); }}
            >All Regions</button>
            {Object.keys(GHANA_REGIONS).map((r) => (
              <button
                key={r}
                className={`w-full text-left px-4 py-2 text-sm hover:bg-brand-light ${selectedRegion === r ? "text-brand font-medium" : "text-[#0F172A]"}`}
                onClick={() => { setSelectedRegion(r); setSelectedLocation(""); setOpenDropdown(null); }}
              >{r}</button>
            ))}
          </div>
        )}

        {openDropdown === "location" && selectedRegion && (
          <div className="absolute top-full left-4 mt-0 bg-white rounded-xl shadow-lg border border-[#E2E8F0] py-1 z-50 max-h-60 overflow-y-auto w-56">
            <button
              className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 text-[#64748B]"
              onClick={() => { setSelectedLocation(""); setOpenDropdown(null); }}
            >All Areas in {selectedRegion}</button>
            {locationOptions.map((loc) => (
              <button
                key={loc}
                className={`w-full text-left px-4 py-2 text-sm hover:bg-brand-light ${selectedLocation === loc ? "text-brand font-medium" : "text-[#0F172A]"}`}
                onClick={() => { setSelectedLocation(loc); setOpenDropdown(null); }}
              >{loc}</button>
            ))}
          </div>
        )}

        {openDropdown === "price" && (
          <div className="absolute top-full left-4 mt-0 bg-white rounded-xl shadow-lg border border-[#E2E8F0] py-1 z-50 w-56">
            <button
              className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 text-[#64748B]"
              onClick={() => { setSelectedPriceRange(""); setOpenDropdown(null); }}
            >Any Price</button>
            {PRICE_RANGES.map((r) => (
              <button
                key={r.label}
                className={`w-full text-left px-4 py-2 text-sm hover:bg-brand-light ${selectedPriceRange === r.label ? "text-brand font-medium" : "text-[#0F172A]"}`}
                onClick={() => { setSelectedPriceRange(r.label); setOpenDropdown(null); }}
              >{r.label}</button>
            ))}
          </div>
        )}

        {openDropdown === "type" && (
          <div className="absolute top-full left-4 mt-0 bg-white rounded-xl shadow-lg border border-[#E2E8F0] py-1 z-50 w-56">
            <button
              className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 text-[#64748B]"
              onClick={() => { setSelectedRoomType(""); setOpenDropdown(null); }}
            >All Types</button>
            {ROOM_TYPES.map((t) => (
              <button
                key={t}
                className={`w-full text-left px-4 py-2 text-sm hover:bg-brand-light ${selectedRoomType === t ? "text-brand font-medium" : "text-[#0F172A]"}`}
                onClick={() => { setSelectedRoomType(t); setOpenDropdown(null); }}
              >{t}</button>
            ))}
          </div>
        )}

        {openDropdown === "sort" && (
          <div className="absolute top-full left-4 mt-0 bg-white rounded-xl shadow-lg border border-[#E2E8F0] py-1 z-50 w-52">
            {SORT_OPTIONS.map((o) => (
              <button
                key={o.key}
                className={`w-full text-left px-4 py-2 text-sm hover:bg-brand-light ${sortKey === o.key ? "text-brand font-semibold" : "text-[#0F172A]"}`}
                onClick={() => { setSortKey(o.key); setOpenDropdown(null); }}
              >{o.label}</button>
            ))}
          </div>
        )}
      </div>

      {/* Backdrop to close dropdown */}
      {openDropdown && (
        <div className="fixed inset-0 z-30" onClick={() => setOpenDropdown(null)} />
      )}

      {/* Main content */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-6">
        {/* Results header */}
        <div className="flex items-center justify-between mb-4 gap-2">
          <p className="text-sm text-[#64748B]">
            <span className="font-semibold text-[#0F172A]">{loading ? "..." : filtered.length}</span>{" "}
            {showSaved ? "saved rooms" : selectedRegion ? `rooms in ${selectedLocation || selectedRegion}` : "rooms in Ghana"}
          </p>
          <div className="flex items-center gap-2 shrink-0">
            {hasFilters && !loading && (
              <button onClick={clearFilters} className="text-sm text-brand font-medium hover:underline">
                Clear filters
              </button>
            )}
            {/* Grid / Map toggle */}
            <div className="flex items-center border border-[#E2E8F0] rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode("grid")}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold transition-colors ${viewMode === "grid" ? "bg-brand text-white" : "text-[#64748B] hover:bg-gray-50"}`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                List
              </button>
              <button
                onClick={() => setViewMode("map")}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold transition-colors ${viewMode === "map" ? "bg-brand text-white" : "text-[#64748B] hover:bg-gray-50"}`}
              >
                <Map className="w-3.5 h-3.5" />
                Map
              </button>
            </div>
          </div>
        </div>

        {/* Map view */}
        {viewMode === "map" && !loading && (
          <MapView listings={filtered} />
        )}

        {/* Grid */}
        {viewMode === "grid" && (loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              {showSaved ? <Heart className="w-8 h-8 text-gray-300" /> : <Home className="w-8 h-8 text-gray-300" />}
            </div>
            <p className="text-lg font-semibold text-[#64748B]">
              {showSaved ? "No saved listings yet" : "No rooms match your filters"}
            </p>
            <p className="text-sm text-[#94A3B8] mt-1">
              {showSaved ? "Tap the heart on any listing to save it" : "Try adjusting your search"}
            </p>
            {!showSaved && (
              <button
                onClick={clearFilters}
                className="mt-4 bg-brand text-white rounded-full px-5 py-2 text-sm font-medium hover:bg-brand-hover transition-colors"
              >
                Clear all filters
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {filtered.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        ))}
      </main>

      <Footer />

      {/* Mobile sticky bottom bar */}
      {hasFilters && !loading && (
        <div className="fixed bottom-0 left-0 right-0 md:hidden bg-white border-t border-[#E2E8F0] shadow-lg px-4 py-3 flex items-center justify-between z-40">
          <span className="text-sm font-semibold text-[#0F172A]">
            {filtered.length} result{filtered.length !== 1 ? "s" : ""}
          </span>
          <button
            onClick={clearFilters}
            className="flex items-center gap-2 bg-brand text-white rounded-full px-4 py-2 text-sm font-medium"
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filters
            {activeFilterCount > 0 && (
              <span className="bg-white text-brand rounded-full w-5 h-5 text-xs font-bold flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>
      )}
    </div>
  );
}

export default function BrowsePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex flex-col">
        <Nav />
        <div className="flex-1 max-w-7xl mx-auto w-full px-4 py-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        </div>
      </div>
    }>
      <BrowseContent />
    </Suspense>
  );
}




