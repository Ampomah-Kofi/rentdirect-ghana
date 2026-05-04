"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight, Shield, Users, TrendingUp, MapPin, Star,
  CheckCircle, Building2, MessageCircle,
  Zap, Search, Heart, GitCompare, Send, Pencil, Phone, ChevronDown,
} from "lucide-react";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { useListings } from "@/components/providers/ListingsProvider";
import ListingCard from "@/components/ListingCard";
import { LogoMark } from "@/components/Logo";
import { GHANA_REGIONS } from "@/lib/ghana-locations";
import { LISTING_PLANS } from "@/lib/monetization";
import type { Room } from "@/lib/types";

//  Splash Loader 

function PageLoader({ onDone }: { onDone: () => void }) {
  const [progress, setProgress] = useState(0);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    const start = performance.now();
    const duration = 1800;
    let raf: number;
    const tick = (now: number) => {
      const p = Math.min(((now - start) / duration) * 100, 100);
      setProgress(p);
      if (p < 100) { raf = requestAnimationFrame(tick); }
      else {
        setTimeout(() => { setLeaving(true); setTimeout(onDone, 480); }, 180);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [onDone]);

  return (
    <div
      className="fixed inset-0 z-9999 flex flex-col items-center justify-center select-none"
      style={{
        background: "linear-gradient(145deg,#041c14 0%,#0F6E56 55%,#12816a 100%)",
        opacity: leaving ? 0 : 1,
        transform: leaving ? "scale(1.025)" : "scale(1)",
        transition: leaving ? "opacity 0.48s ease,transform 0.48s ease" : "none",
        pointerEvents: leaving ? "none" : "auto",
      }}
    >
      {/* Texture */}
      <div className="absolute inset-0 opacity-[0.05]"
        style={{ backgroundImage:"radial-gradient(circle,#fff 1px,transparent 1px)", backgroundSize:"28px 28px" }} />

      <div className="relative flex flex-col items-center gap-5" style={{ animation:"fadeUp .5s ease both" }}>
        {/* Logo box */}
        <div className="w-20 h-20 rounded-[20px] bg-white/10 border border-white/15 flex items-center justify-center shadow-2xl backdrop-blur-sm">
          <LogoMark size={48} />
        </div>
        {/* Wordmark */}
        <div className="text-center">
          <p className="text-white text-4xl font-black tracking-tight leading-none">
            Rent<span className="text-green-300">Direct</span>
          </p>
          <p className="text-green-200/70 text-[13px] font-medium mt-2 tracking-wide">
            Ghana&apos;s Direct Rental Platform
          </p>
        </div>
        {/* Dots */}
        <div className="flex gap-2 mt-1">
          {[0,1,2].map(i => (
            <span key={i} className="w-1.5 h-1.5 rounded-full bg-white/30"
              style={{ animation:`pulse-slow 1.2s ease-in-out ${i*0.2}s infinite` }} />
          ))}
        </div>
      </div>

      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 right-0 h-0.75 bg-white/10">
        <div className="h-full bg-white/50" style={{ width:`${progress}%`, transition:"width .05s linear" }} />
      </div>
      <p className="absolute bottom-5 text-green-300/50 text-[10px] font-semibold tracking-[0.2em] uppercase">
        No Agents - No Fees - Direct
      </p>
    </div>
  );
}

//  Animated Stat Counter 

function useCountUp(target: number, trigger: boolean, duration = 1400) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!trigger) return;
    let current = 0;
    const step = target / (duration / 16);
    const id = setInterval(() => {
      current = Math.min(current + step, target);
      setVal(Math.floor(current));
      if (current >= target) clearInterval(id);
    }, 16);
    return () => clearInterval(id);
  }, [target, trigger, duration]);
  return val;
}

function StatBlock({ value, suffix = "", label, sub, trigger }: {
  value: number; suffix?: string; label: string; sub?: string; trigger: boolean;
}) {
  const n = useCountUp(value, trigger);
  return (
    <div className="text-center px-5 py-5">
      <p className="text-4xl font-black text-[#0A0A0A] leading-none tabular-nums">
        {n}{suffix}
      </p>
      <p className="text-sm font-bold text-[#0F172A] mt-1.5">{label}</p>
      {sub && <p className="text-xs text-[#94A3B8] mt-0.5">{sub}</p>}
    </div>
  );
}

//  Hero Listing Preview Card 

function HeroCard({ room, style }: { room: Room; style?: React.CSSProperties }) {
  return (
    <div
      className="bg-white rounded-2xl shadow-2xl overflow-hidden w-64 border border-white/60"
      style={style}
    >
      <div className="h-36 bg-gray-100 overflow-hidden relative">
        {room.photos[0]
          ? <img src={room.photos[0]} alt="" className="w-full h-full object-cover" />
          : <div className="w-full h-full bg-linear-to-br from-brand/20 to-brand/5 flex items-center justify-center">
              <Building2 className="w-8 h-8 text-brand/30" />
            </div>
        }
        <span className="absolute bottom-2 left-2 bg-brand text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full">
          GHS {room.price_per_month.toLocaleString()}/mo
        </span>
        {room.status === "live" && (
          <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-green-400 ring-2 ring-white" />
        )}
      </div>
      <div className="p-3">
        <p className="text-[13px] font-bold text-[#0F172A] truncate leading-snug">{room.title}</p>
        <p className="text-[11px] text-[#64748B] flex items-center gap-1 mt-0.5">
          <MapPin className="w-2.5 h-2.5 shrink-0" />
          {room.location}, {room.region}
        </p>
        <div className="flex items-center justify-between mt-2.5">
          <span className="text-[11px] bg-brand-light text-brand px-2 py-0.5 rounded-full font-medium">
            {room.room_type}
          </span>
          <span className="text-[10px] text-[#94A3B8]">{room.advance_months ?? 6} mo advance</span>
        </div>
      </div>
    </div>
  );
}

//  Star Picker 

function StarPicker({ value, onChange }: { value: number; onChange: (n: number) => void }) {
  const [hovered, setHovered] = useState(0);
  const LABELS = ["", "Poor", "Fair", "Good", "Great", "Excellent"];
  return (
    <div className="flex items-center gap-1">
      {[1,2,3,4,5].map(n => (
        <button
          key={n} type="button"
          onClick={() => onChange(n)}
          onMouseEnter={() => setHovered(n)}
          onMouseLeave={() => setHovered(0)}
          aria-label={`${n} star${n>1?"s":""}`}
          className="p-0.5 transition-transform hover:scale-125 focus:outline-none rounded"
        >
          <Star className={`w-7 h-7 transition-colors ${
            n <= (hovered || value) ? "text-amber-400 fill-amber-400" : "text-[#E2E8F0] fill-[#E2E8F0]"
          }`} />
        </button>
      ))}
      {(hovered || value) > 0 && (
        <span className="ml-2 text-sm font-bold text-amber-500">{LABELS[hovered || value]}</span>
      )}
    </div>
  );
}

//  Review types 

interface Review {
  id: string; name: string; loc: string; quote: string; stars: number; date: string;
}

const SEED_REVIEWS: Review[] = [
  { id:"s1", name:"Akosua M.", loc:"Kumasi, Ashanti", quote:"Found a self-contained in Ahodwo within 2 days. The landlord called me directly - no agent at all!", stars:5, date:"Mar 2026" },
  { id:"s2", name:"Kofi A.", loc:"Accra, Greater Accra", quote:"Listed my two rooms and had 3 serious enquiries in a week. GHS 50 is nothing compared to what agents charge.", stars:5, date:"Feb 2026" },
  { id:"s3", name:"Abena T.", loc:"Takoradi, Western", quote:"The compare tool showed me advance totals side by side. I picked the one that saved me GHS 1,200.", stars:5, date:"Jan 2026" },
];

//  Benefits data 

const BENEFITS = [
  { icon:Shield,      title:"Ghana Card Verified",   body:"Every landlord identity-verified before going live.",       color:"#0F6E56" },
  { icon:TrendingUp,  title:"Zero Commission",        body:"No 10% agent cuts. You pay exactly what's listed.",         color:"#F59E0B" },
  { icon:Users,       title:"Direct Contact",         body:"Call or message the landlord straight. No middlemen.",      color:"#3B82F6" },
  { icon:CheckCircle, title:"Rent Act Protected",     body:"Listings demanding >6 months advance are flagged.",         color:"#10B981" },
  { icon:MessageCircle,title:"In-App Messaging",     body:"Enquire, agree terms and confirm move-in - one place.",     color:"#8B5CF6" },
  { icon:MapPin,      title:"All 16 Regions",         body:"From Accra to Tamale, Takoradi to Ho. Growing daily.",      color:"#EF4444" },
];

//  How it works data 

const HOW: Record<"tenant"|"landlord", { n:string; icon:React.ComponentType<{className?:string}>; title:string; body:string }[]> = {
  tenant: [
    { n:"01", icon:Search,    title:"Search & Filter",   body:"Browse rooms by region, price, type and amenities - no account needed." },
    { n:"02", icon:GitCompare,title:"Compare & Save",    body:"Save favourites and compare up to 3 listings side-by-side." },
    { n:"03", icon:Phone,     title:"Contact Directly",  body:"Call or message the landlord. Zero agent. Zero commission. Move in." },
  ],
  landlord: [
    { n:"01", icon:Building2, title:"List Your Room",    body:"Upload photos, set price and amenities in under 5 minutes." },
    { n:"02", icon:Zap,       title:"Go Live",           body:"Pay a one-time GHS 50 via MoMo. No subscriptions, ever." },
    { n:"03", icon:Users,     title:"Get Tenants",       body:"Tenants contact you directly. You choose who moves in." },
  ],
};

//  Main Landing Page 

export default function LandingPage() {
  const router = useRouter();
  const { listings } = useListings();
  const live = listings.filter(l => l.status === "live" && !l.is_hidden);
  const featured = live.slice(0, 6);
  const heroCards = live.slice(0, 2);

  // Splash loader
  const [loaded, setLoaded] = useState(false);

  // Hero search
  const [heroQuery, setHeroQuery] = useState("");
  const [heroRegion, setHeroRegion] = useState("");
  const [regionOpen, setRegionOpen] = useState(false);
  const regionRef = useRef<HTMLDivElement>(null);

  // How-it-works tab
  const [tab, setTab] = useState<"tenant"|"landlord">("tenant");

  // Stats in-view trigger
  const statsRef = useRef<HTMLDivElement>(null);
  const [statsVisible, setStatsVisible] = useState(false);
  useEffect(() => {
    const el = statsRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setStatsVisible(true); }, { threshold:0.3 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // Close region dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (regionRef.current && !regionRef.current.contains(e.target as Node)) setRegionOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Reviews
  const [reviews, setReviews] = useState<Review[]>(() => {
    if (typeof window === "undefined") return SEED_REVIEWS;
    try {
      const saved = localStorage.getItem("rd_reviews");
      return saved ? [...SEED_REVIEWS, ...JSON.parse(saved)] : SEED_REVIEWS;
    } catch { return SEED_REVIEWS; }
  });
  const [form, setForm] = useState({ name:"", loc:"", quote:"", stars:0 });
  const [submitted, setSubmitted] = useState(false);

  const handleHeroSearch = useCallback((e: { preventDefault(): void }) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (heroQuery.trim()) params.set("q", heroQuery.trim());
    if (heroRegion) params.set("region", heroRegion);
    router.push(`/browse?${params.toString()}`);
  }, [heroQuery, heroRegion, router]);

  return (
    <>
      {!loaded && <PageLoader onDone={() => setLoaded(true)} />}

      <div style={{ opacity:loaded?1:0, transition:"opacity .4s ease .1s" }} className="min-h-screen flex flex-col">
        <Nav />

        {/* 
            HERO - Split layout: pitch + search | listing cards
         */}
        <section
          className="relative overflow-hidden"
          style={{ background:"linear-gradient(155deg,#07100e 0%,#0c2d22 45%,#0F6E56 100%)" }}
        >
          {/* Fine grid overlay */}
          <div className="absolute inset-0 opacity-[0.035]"
            style={{ backgroundImage:"linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)", backgroundSize:"48px 48px" }} />
          {/* Radial glow top-right */}
          <div className="absolute -top-32 -right-32 w-125 h-125 rounded-full opacity-20 pointer-events-none"
            style={{ background:"radial-gradient(circle,#14916E,transparent 65%)" }} />

          <div className="relative max-w-6xl mx-auto px-4 pt-20 pb-28 sm:pt-28 sm:pb-36">
            <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-8">

              {/*  Left: Pitch + Search  */}
              <div className="flex-1 text-center lg:text-left">
                {/* Live badge */}
                <div
                  className="inline-flex items-center gap-2 border border-green-500/25 bg-green-500/10 text-green-300 text-[11px] font-bold tracking-widest uppercase px-4 py-2 rounded-full mb-7"
                  style={{ animation:"fadeUp .5s ease .1s both" }}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                  {live.length} rooms live across Ghana
                </div>

                {/* Headline */}
                <h1
                  className="text-5xl sm:text-6xl lg:text-7xl font-black text-white leading-[1.01] tracking-tight mb-5"
                  style={{ animation:"fadeUp .55s ease .2s both" }}
                >
                  Find your room.<br />
                  <span style={{
                    background:"linear-gradient(90deg,#4ade80,#34d399)",
                    WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text",
                  }}>
                    No agent.
                  </span>
                </h1>

                {/* Sub */}
                <p
                  className="text-base sm:text-lg text-green-100/65 max-w-lg mx-auto lg:mx-0 leading-relaxed mb-8"
                  style={{ animation:"fadeUp .55s ease .3s both" }}
                >
                  Connect directly with verified landlords across all 16 regions of Ghana.
                  No 10% fees. No delays. Just you and your next home.
                </p>

                {/*  Search bar  */}
                <form
                  onSubmit={handleHeroSearch}
                  className="bg-white rounded-2xl shadow-2xl p-2 flex items-center gap-2 max-w-xl mx-auto lg:mx-0 mb-5"
                  style={{ animation:"fadeUp .55s ease .35s both" }}
                >
                  {/* Region dropdown */}
                  <div ref={regionRef} className="relative shrink-0">
                    <button
                      type="button"
                      onClick={() => setRegionOpen(o => !o)}
                      className="flex items-center gap-1.5 h-10 px-3 rounded-xl text-sm font-semibold text-[#0F172A] hover:bg-gray-50 transition-colors border border-[#E2E8F0] whitespace-nowrap"
                    >
                      {heroRegion || "All Regions"}
                      <ChevronDown className={`w-3.5 h-3.5 text-[#94A3B8] transition-transform ${regionOpen?"rotate-180":""}`} />
                    </button>
                    {regionOpen && (
                      <div className="absolute top-full left-0 mt-1 bg-white border border-[#E2E8F0] rounded-xl shadow-xl py-1 z-50 max-h-56 overflow-y-auto w-52">
                        <button
                          type="button"
                          className="w-full text-left px-4 py-2 text-sm text-[#64748B] hover:bg-gray-50"
                          onClick={() => { setHeroRegion(""); setRegionOpen(false); }}
                        >All Regions</button>
                        {Object.keys(GHANA_REGIONS).map(r => (
                          <button
                            key={r} type="button"
                            className={`w-full text-left px-4 py-2 text-sm hover:bg-brand-light ${heroRegion===r?"text-brand font-semibold":"text-[#0F172A]"}`}
                            onClick={() => { setHeroRegion(r); setRegionOpen(false); }}
                          >{r}</button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Divider */}
                  <div className="w-px h-6 bg-[#E2E8F0] shrink-0" />

                  {/* Text input */}
                  <input
                    type="text"
                    placeholder="Area, room type, or keyword..."
                    value={heroQuery}
                    onChange={e => setHeroQuery(e.target.value)}
                    className="flex-1 text-sm text-[#0F172A] placeholder-[#94A3B8] outline-none bg-transparent py-2 px-1 min-w-0"
                  />

                  {/* Submit */}
                  <button
                    type="submit"
                    className="flex items-center gap-2 bg-brand text-white font-bold px-5 py-2.5 rounded-xl text-sm hover:bg-brand-hover transition-colors shrink-0 shadow-lg shadow-brand/30"
                  >
                    <Search className="w-4 h-4" />
                    <span className="hidden sm:inline">Search</span>
                  </button>
                </form>

                {/* Quick region chips */}
                <div
                  className="flex items-center gap-2 flex-wrap justify-center lg:justify-start"
                  style={{ animation:"fadeUp .55s ease .4s both" }}
                >
                  <span className="text-green-300/60 text-xs font-semibold">Popular:</span>
                  {["Greater Accra","Ashanti","Western","Central"].map(r => (
                    <button
                      key={r}
                      onClick={() => router.push(`/browse?region=${encodeURIComponent(r)}`)}
                      className="text-[11px] px-3 py-1.5 rounded-full border border-white/20 text-green-200 hover:bg-white/10 transition-colors font-medium"
                    >
                      {r}
                    </button>
                  ))}
                </div>

                {/* Mini trust row */}
                <div
                  className="flex items-center gap-5 mt-8 flex-wrap justify-center lg:justify-start"
                  style={{ animation:"fadeUp .55s ease .45s both" }}
                >
                  {[
                    { icon:Shield,       text:"Verified landlords" },
                    { icon:CheckCircle,  text:"Rent Act compliant" },
                    { icon:TrendingUp,   text:"Zero commission" },
                  ].map(({ icon:Icon, text }) => (
                    <div key={text} className="flex items-center gap-1.5">
                      <Icon className="w-3.5 h-3.5 text-green-400" />
                      <span className="text-xs text-green-200/70 font-medium">{text}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/*  Right: Floating listing cards (desktop)  */}
              {heroCards.length >= 2 && (
                <div
                  className="hidden lg:block relative w-72 h-80 shrink-0"
                  style={{ animation:"fadeIn .6s ease .6s both" }}
                >
                  {/* Card 1 - back, slightly rotated */}
                  <div
                    className="absolute top-8 left-8 opacity-80"
                    style={{ transform:"rotate(4deg)", animation:"floatY 4s ease-in-out 0.8s infinite" }}
                  >
                    <HeroCard room={heroCards[1]} />
                  </div>
                  {/* Card 2 - front */}
                  <div
                    className="absolute top-0 left-0 z-10"
                    style={{ transform:"rotate(-2deg)", animation:"floatY 4s ease-in-out infinite" }}
                  >
                    <HeroCard room={heroCards[0]} />
                  </div>
                  {/* "Live" floating badge */}
                  <div
                    className="absolute -bottom-4 right-0 z-20 bg-white rounded-2xl shadow-xl px-4 py-2.5 flex items-center gap-2 border border-[#E2E8F0]"
                    style={{ animation:"floatY 3s ease-in-out 1.2s infinite" }}
                  >
                    <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                    <span className="text-xs font-black text-[#0F172A]">{live.length} rooms live</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Wave divider */}
          <div className="absolute bottom-0 left-0 right-0">
            <svg viewBox="0 0 1440 72" className="w-full block" preserveAspectRatio="none" fill="white">
              <path d="M0,52 C360,80 720,20 1080,56 C1260,72 1380,28 1440,44 L1440,72 L0,72 Z" />
            </svg>
          </div>
        </section>

        {/* 
            STATS - Animated counters (trigger on scroll)
         */}
        <section className="bg-white border-b border-[#F1F5F9]" ref={statsRef}>
          <div className="max-w-4xl mx-auto px-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-[#F1F5F9]">
              <StatBlock value={live.length}  suffix="+" label="Live Listings"      sub="Across Ghana"            trigger={statsVisible} />
              <StatBlock value={16}            label="Regions Covered"    sub="Nationwide"              trigger={statsVisible} />
              <StatBlock value={0}             label="Agent Commission"   sub="Always free for tenants" trigger={statsVisible} />
              <StatBlock value={6}             suffix=" mo" label="Max Legal Advance" sub="Rent Act protected"    trigger={statsVisible} />
            </div>
          </div>
        </section>

        {/* 
            TRUST STRIP
         */}
        <div className="bg-surface border-b border-[#E2E8F0]">
          <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-center gap-6 sm:gap-10 flex-wrap">
            {[
              { icon:Shield,      label:"Ghana Card Verified Landlords", color:"text-brand" },
              { icon:Users,       label:"Talk Direct - No Agent",         color:"text-blue-500" },
              { icon:TrendingUp,  label:"Zero Commission",                color:"text-amber-500" },
              { emoji:"",       label:"Rent Act Compliant" },
            ].map(({ icon:Icon, emoji, label, color }:{ icon?:React.ComponentType<{className?:string}>; emoji?:string; label:string; color?:string }) => (
              <div key={label} className="flex items-center gap-2">
                {Icon ? <Icon className={`w-4 h-4 ${color} shrink-0`} /> : <span className="text-sm">{emoji}</span>}
                <span className="text-xs font-semibold text-[#64748B]">{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 
            HOW IT WORKS - Tab: Tenant / Landlord
         */}
        <section className="bg-white py-20 px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <p className="text-[11px] font-black text-brand uppercase tracking-[0.22em] mb-3">Simple Process</p>
              <h2 className="text-3xl sm:text-4xl font-black text-[#0A0A0A]">How RentDirect works</h2>
            </div>

            {/* Tab switcher */}
            <div className="flex items-center justify-center mb-12">
              <div className="bg-[#F1F5F9] rounded-2xl p-1 flex gap-1">
                {(["tenant","landlord"] as const).map(t => (
                  <button
                    key={t} onClick={() => setTab(t)}
                    className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
                      tab===t ? "bg-white text-brand shadow-sm" : "text-[#64748B] hover:text-[#0F172A]"
                    }`}
                  >
                    {t==="tenant" ? "I'm a Tenant" : "I'm a Landlord"}
                  </button>
                ))}
              </div>
            </div>

            {/* Steps */}
            <div className="grid sm:grid-cols-3 gap-5 relative">
              {/* Connector line */}
              <div className="hidden sm:block absolute top-[2.4rem] left-[22%] right-[22%] h-px bg-[#E2E8F0]" />
              {HOW[tab].map(({ n, icon:Icon, title, body }, i) => (
                <div key={n}
                  className="relative bg-surface border border-[#E2E8F0] rounded-2xl p-6 hover:border-brand/30 hover:shadow-md transition-all"
                  style={{ animationDelay:`${i*0.1}s` }}
                >
                  {/* Number badge */}
                  <div className="w-12 h-12 rounded-2xl bg-brand text-white font-black text-xs flex items-center justify-center mb-5 shadow-lg shadow-brand/20 relative z-10">
                    {n}
                  </div>
                  {/* Ghost icon */}
                  <div className="absolute top-5 right-5 opacity-[0.04]">
                    <Icon className="w-14 h-14 text-brand" />
                  </div>
                  <h3 className="text-base font-black text-[#0A0A0A] mb-2">{title}</h3>
                  <p className="text-sm text-[#64748B] leading-relaxed">{body}</p>
                </div>
              ))}
            </div>

            <div className="text-center mt-10">
              <Link
                href={tab==="tenant" ? "/browse" : "/landlord/upload"}
                className="inline-flex items-center gap-2 bg-brand text-white font-bold px-7 py-3.5 rounded-2xl text-sm hover:bg-brand-hover transition-all shadow-lg shadow-brand/20 hover:-translate-y-0.5"
              >
                {tab==="tenant" ? "Browse All Rooms" : "List a Room Now"}
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* 
            FEATURED LISTINGS - Live rooms from the provider
         */}
        {featured.length > 0 && (
          <section className="bg-surface py-20 px-4">
            <div className="max-w-6xl mx-auto">
              <div className="flex items-end justify-between mb-8">
                <div>
                  <p className="text-[11px] font-black text-brand uppercase tracking-[0.22em] mb-1">Fresh On The Market</p>
                  <h2 className="text-3xl sm:text-4xl font-black text-[#0A0A0A]">Latest listings</h2>
                </div>
                <Link href="/browse" className="hidden sm:flex items-center gap-1 text-sm font-bold text-brand hover:underline">
                  View all <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {featured.map(l => <ListingCard key={l.id} listing={l} />)}
              </div>
              <div className="text-center mt-8 sm:hidden">
                <Link href="/browse" className="inline-flex items-center gap-2 text-sm font-bold text-brand hover:underline">
                  View all rooms <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* 
            BENEFITS - Why RentDirect
         */}
        <section className="bg-white py-20 px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <p className="text-[11px] font-black text-brand uppercase tracking-[0.22em] mb-3">Why Choose Us</p>
              <h2 className="text-3xl sm:text-4xl font-black text-[#0A0A0A]">Built for Ghana renters</h2>
              <p className="text-sm text-[#64748B] mt-3 max-w-md mx-auto">
                Every feature designed around how renting actually works in Ghana.
              </p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {BENEFITS.map(({ icon:Icon, title, body, color }) => (
                <div key={title}
                  className="border border-[#E2E8F0] rounded-2xl p-6 hover:border-transparent hover:shadow-xl hover:-translate-y-0.5 transition-all bg-white group"
                >
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4" style={{ background:`${color}12` }}>
                    <Icon className="w-5 h-5" style={{ color }} />
                  </div>
                  <h3 className="text-sm font-black text-[#0A0A0A] mb-2">{title}</h3>
                  <p className="text-sm text-[#64748B] leading-relaxed">{body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/*
            PRICING - Clear monetization for landlords
         */}
        <section className="bg-surface py-20 px-4 border-y border-black/5">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-5 mb-10">
              <div>
                <p className="text-[11px] font-black text-brand uppercase tracking-[0.22em] mb-3">Simple Landlord Pricing</p>
                <h2 className="text-3xl sm:text-4xl font-black text-[#0A0A0A]">Charge fairly. Grow trust.</h2>
                <p className="text-sm text-[#64748B] mt-3 max-w-xl leading-relaxed">
                  Tenants browse free. Landlords pay a small one-time fee only when a listing is approved and ready to go live.
                </p>
              </div>
              <Link
                href="/landlord/upload"
                className="inline-flex items-center justify-center gap-2 rd-button-primary px-6 py-3.5 rounded-2xl text-sm font-black shadow-lg shadow-brand/20"
              >
                Start Listing <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              {LISTING_PLANS.map((plan) => (
                <div
                  key={plan.id}
                  className={`rd-card rounded-[1.6rem] p-6 relative overflow-hidden ${
                    plan.id === "standard" ? "ring-2 ring-brand/20" : ""
                  }`}
                >
                  {plan.id === "standard" && (
                    <span className="absolute top-4 right-4 rounded-full bg-brand text-white text-[10px] font-black px-2.5 py-1">
                      Recommended
                    </span>
                  )}
                  <p className="text-sm font-black text-[#0F172A]">{plan.name}</p>
                  <p className="mt-3 flex items-end gap-1">
                    <span className="text-4xl font-black text-brand">GHS {plan.price}</span>
                    <span className="text-xs text-[#94A3B8] mb-1">/ {plan.durationDays} days</span>
                  </p>
                  <p className="text-sm text-[#64748B] mt-3 leading-relaxed">{plan.tagline}</p>
                  <p className="text-xs font-bold text-[#0F172A] mt-3">{plan.bestFor}</p>
                  <div className="space-y-2 mt-5">
                    {plan.benefits.map((benefit) => (
                      <div key={benefit} className="flex items-center gap-2 text-sm text-[#64748B]">
                        <CheckCircle className="w-4 h-4 text-brand shrink-0" />
                        {benefit}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4">
              <p className="text-sm font-black text-amber-900">Launch strategy for Ghana</p>
              <p className="text-xs text-amber-800 mt-1 leading-relaxed">
                Start with free listings in target towns to build supply, then convert serious landlords to GHS 50 standard and GHS 100 featured once tenant traffic is visible.
              </p>
            </div>
          </div>
        </section>

        {/* 
            LANDLORD CTA - Dark green full-bleed
         */}
        <section
          className="py-20 px-4 relative overflow-hidden"
          style={{ background:"linear-gradient(135deg,#07100e 0%,#0c2d22 50%,#0F6E56 100%)" }}
        >
          <div className="absolute inset-0 opacity-[0.045]"
            style={{ backgroundImage:"radial-gradient(circle,#fff 1px,transparent 1px)", backgroundSize:"32px 32px" }} />
          <div className="relative max-w-5xl mx-auto flex flex-col lg:flex-row items-center gap-12">
            <div className="flex-1 text-center lg:text-left">
              <p className="text-[11px] font-black text-green-400 uppercase tracking-[0.22em] mb-4">For Landlords</p>
              <h2 className="text-3xl sm:text-4xl font-black text-white leading-tight mb-4">
                Your room.<br />Your tenant.<br />
                <span className="text-green-300">Your terms.</span>
              </h2>
              <p className="text-green-200/65 text-base max-w-md leading-relaxed mb-8">
                One-time GHS 50 listing fee via Mobile Money. No monthly charges.
                Qualified tenants contact you directly. Full control, always.
              </p>
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3">
                <Link
                  href="/landlord/upload"
                  className="group flex items-center gap-2 bg-white text-brand font-black px-7 py-4 rounded-2xl text-base hover:bg-green-50 transition-all shadow-xl hover:-translate-y-0.5"
                >
                  List a Room <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                </Link>
                <Link
                  href="/landlord/dashboard"
                  className="flex items-center gap-2 border border-white/20 text-white font-bold px-7 py-4 rounded-2xl text-base hover:bg-white/10 transition-all"
                >
                  My Dashboard
                </Link>
              </div>
            </div>
            <div className="flex-1 space-y-2.5 w-full max-w-sm">
              {[
                "Ghana Card verification included",
                "Mobile Money - MTN, Vodafone, AirtelTigo",
                "Real-time view analytics dashboard",
                "Direct in-app messaging with tenants",
                "Hide or hold listings anytime",
                "Rent Act compliance tools built in",
              ].map(item => (
                <div key={item} className="flex items-center gap-3 bg-white/6 border border-white/8 rounded-xl px-4 py-3">
                  <CheckCircle className="w-4 h-4 text-green-400 shrink-0" />
                  <span className="text-sm text-green-100 font-medium">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 
            RENT ACT CALLOUT - Legal protection banner
         */}
        <section className="bg-amber-50 border-y border-amber-100 py-10 px-4">
          <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center gap-6">
            <div className="text-5xl shrink-0" style={{ animation:"floatY 3s ease-in-out infinite" }}></div>
            <div className="flex-1 text-center sm:text-left">
              <h3 className="text-base font-black text-[#0A0A0A] mb-1.5">
                Protected by Ghana&apos;s Rent Act (Act 220, 1963)
              </h3>
              <p className="text-sm text-[#64748B] leading-relaxed">
                A landlord <strong className="text-[#0F172A]">cannot legally demand more than 6 months&apos; advance rent</strong>.
                RentDirect flags any listing that exceeds this - and lets tenants report violations instantly.
              </p>
            </div>
            <Link
              href="/browse"
              className="shrink-0 text-sm font-black text-amber-800 bg-amber-100 border border-amber-200 px-6 py-3 rounded-2xl hover:bg-amber-200 transition-colors whitespace-nowrap shadow-sm"
            >
              Browse Safely
            </Link>
          </div>
        </section>

        {/* 
            REVIEWS - Interactive: star picker + form + live cards
         */}
        <section className="bg-white py-20 px-4">
          <div className="max-w-5xl mx-auto">

            <div className="text-center mb-12">
              <p className="text-[11px] font-black text-brand uppercase tracking-[0.22em] mb-3">Real Stories</p>
              <h2 className="text-3xl sm:text-4xl font-black text-[#0A0A0A]">People love RentDirect</h2>
              <p className="text-sm text-[#64748B] mt-2">Share your experience - it helps others find a home.</p>
            </div>

            {/* Review cards grid */}
            <div className="grid sm:grid-cols-3 gap-5 mb-14">
              {reviews.map(({ id, name, loc, quote, stars, date }) => (
                <div key={id} className="border border-[#E2E8F0] rounded-2xl p-6 hover:shadow-lg hover:-translate-y-0.5 transition-all flex flex-col">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex gap-0.5">
                      {[1,2,3,4,5].map(n => (
                        <Star key={n} className={`w-4 h-4 ${n<=stars?"text-amber-400 fill-amber-400":"text-[#E2E8F0] fill-[#E2E8F0]"}`} />
                      ))}
                    </div>
                    <span className="text-[11px] text-[#94A3B8]">{date}</span>
                  </div>
                  <p className="text-sm text-[#0F172A] leading-relaxed mb-5 font-medium flex-1">
                    &ldquo;{quote}&rdquo;
                  </p>
                  <div className="flex items-center gap-3 pt-4 border-t border-[#F1F5F9]">
                    <div className="w-9 h-9 rounded-full bg-brand-light flex items-center justify-center text-brand font-black text-sm shrink-0">
                      {name[0].toUpperCase()}
                    </div>
                    <div>
                      <p className="text-xs font-black text-[#0A0A0A]">{name}</p>
                      <p className="text-[11px] text-[#94A3B8] flex items-center gap-1">
                        <MapPin className="w-3 h-3" />{loc}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Write a review divider */}
            <div className="flex items-center gap-4 mb-10">
              <div className="flex-1 h-px bg-[#E2E8F0]" />
              <div className="flex items-center gap-2 text-sm font-black text-[#0F172A] shrink-0">
                <Pencil className="w-4 h-4 text-brand" />
                Write a Review
              </div>
              <div className="flex-1 h-px bg-[#E2E8F0]" />
            </div>

            {/* Review form or success state */}
            {submitted ? (
              <div className="max-w-lg mx-auto bg-brand-light border border-green-200 rounded-2xl p-10 text-center">
                <div className="w-14 h-14 bg-brand rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-lg font-black text-[#0A0A0A] mb-2">Thank you!</h3>
                <p className="text-sm text-[#64748B] mb-6">Your review has been posted above.</p>
                <button
                  onClick={() => { setSubmitted(false); setForm({ name:"", loc:"", quote:"", stars:0 }); }}
                  className="text-sm font-bold text-brand hover:underline"
                >Write another review</button>
              </div>
            ) : (
              <form
                className="max-w-lg mx-auto bg-surface border border-[#E2E8F0] rounded-2xl p-6 sm:p-8 space-y-5"
                onSubmit={e => {
                  e.preventDefault();
                  if (!form.name.trim() || !form.quote.trim() || form.stars === 0) return;
                  const r: Review = {
                    id:`u-${Date.now()}`,
                    name:form.name.trim(),
                    loc:form.loc.trim() || "Ghana",
                    quote:form.quote.trim(),
                    stars:form.stars,
                    date:new Date().toLocaleDateString("en-GH",{ month:"short", year:"numeric" }),
                  };
                  const updated = [...reviews, r];
                  setReviews(updated);
                  localStorage.setItem("rd_reviews", JSON.stringify(updated.filter(x => x.id.startsWith("u-"))));
                  setSubmitted(true);
                }}
              >
                {/* Star rating */}
                <div>
                  <label className="block text-xs font-black text-[#0F172A] uppercase tracking-wider mb-3">
                    Your Rating <span className="text-red-500">*</span>
                  </label>
                  <StarPicker value={form.stars} onChange={n => setForm(f => ({ ...f, stars:n }))} />
                  {form.stars === 0 && (
                    <p className="text-[11px] text-[#94A3B8] mt-1.5">Click a star to rate</p>
                  )}
                </div>

                {/* Name + Location */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-black text-[#0F172A] uppercase tracking-wider mb-1.5">
                      Your Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text" placeholder="e.g. Akosua M."
                      value={form.name} maxLength={40}
                      onChange={e => setForm(f => ({ ...f, name:e.target.value }))}
                      className="w-full border border-[#E2E8F0] rounded-xl px-4 py-2.5 text-sm text-[#0F172A] placeholder-[#94A3B8] bg-white outline-none focus:border-brand focus:ring-2 focus:ring-brand/10 transition"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-black text-[#0F172A] uppercase tracking-wider mb-1.5">
                      Location
                    </label>
                    <input
                      type="text" placeholder="e.g. Kumasi, Ashanti"
                      value={form.loc} maxLength={50}
                      onChange={e => setForm(f => ({ ...f, loc:e.target.value }))}
                      className="w-full border border-[#E2E8F0] rounded-xl px-4 py-2.5 text-sm text-[#0F172A] placeholder-[#94A3B8] bg-white outline-none focus:border-brand focus:ring-2 focus:ring-brand/10 transition"
                    />
                  </div>
                </div>

                {/* Review text */}
                <div>
                  <label className="block text-xs font-black text-[#0F172A] uppercase tracking-wider mb-1.5">
                    Your Review <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    placeholder="Tell others about your experience with RentDirect..."
                    value={form.quote} rows={4} maxLength={300}
                    onChange={e => setForm(f => ({ ...f, quote:e.target.value }))}
                    className="w-full border border-[#E2E8F0] rounded-xl px-4 py-3 text-sm text-[#0F172A] placeholder-[#94A3B8] bg-white outline-none focus:border-brand focus:ring-2 focus:ring-brand/10 transition resize-none"
                  />
                  <p className="text-[11px] text-[#94A3B8] mt-1 text-right">{form.quote.length}/300</p>
                </div>

                <button
                  type="submit"
                  disabled={!form.name.trim() || !form.quote.trim() || form.stars === 0}
                  className="w-full flex items-center justify-center gap-2 bg-brand text-white font-black py-3.5 rounded-2xl text-sm hover:bg-brand-hover transition-all shadow-lg shadow-brand/20 disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none"
                >
                  <Send className="w-4 h-4" />
                  Post Review
                </button>
              </form>
            )}
          </div>
        </section>

        {/* 
            FINAL CTA - Simple, direct, confident
         */}
        <section className="bg-surface border-t border-[#E2E8F0] py-20 px-4">
          <div className="max-w-2xl mx-auto text-center">
            <p className="text-[11px] font-black text-brand uppercase tracking-[0.22em] mb-4">Ready?</p>
            <h2 className="text-3xl sm:text-4xl font-black text-[#0A0A0A] leading-tight mb-4">
              Your next home is<br />one search away.
            </h2>
            <p className="text-sm text-[#64748B] mb-10 max-w-sm mx-auto leading-relaxed">
              Browse live rooms right now - no sign up required. Direct. Fast. Free.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/browse"
                className="group w-full sm:w-auto flex items-center justify-center gap-2 bg-brand text-white font-black px-8 py-4 rounded-2xl text-base hover:bg-brand-hover transition-all shadow-xl shadow-brand/20 hover:-translate-y-0.5"
              >
                Find a Room <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/landlord/upload"
                className="w-full sm:w-auto flex items-center justify-center gap-2 border-2 border-brand text-brand font-black px-8 py-4 rounded-2xl text-base hover:bg-brand-light transition-all"
              >
                <Heart className="w-4 h-4" />
                List a Room
              </Link>
            </div>
            <div className="flex items-center justify-center gap-4 mt-10 flex-wrap">
              {["No sign-up required","No agent fees","Rent Act protected"].map((t,i) => (
                <div key={t} className="flex items-center gap-1.5">
                  {i>0 && <span className="w-1 h-1 rounded-full bg-[#CBD5E1]" />}
                  <CheckCircle className="w-3.5 h-3.5 text-brand" />
                  <span className="text-xs text-[#64748B] font-medium">{t}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
}



