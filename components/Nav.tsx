"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, LayoutDashboard, PlusCircle, Clock, Heart, MessageCircle, ShieldCheck, Sparkles, UserCog, Megaphone } from "lucide-react";
import { LogoMark } from "@/components/Logo";
import { useFavoritesContext } from "@/components/providers/FavoritesProvider";
import { MOCK_CONVERSATIONS } from "@/lib/mock-data";

const LANDLORD_ID = "user-101";
const unreadMessages = MOCK_CONVERSATIONS
  .filter((c) => c.landlord_id === LANDLORD_ID)
  .reduce((sum, c) => sum + c.unread_count, 0);

function LiveClock() {
  const [time, setTime] = useState<string | null>(null);
  const [date, setDate] = useState<string | null>(null);

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString("en-GH", { hour: "2-digit", minute: "2-digit", hour12: true }));
      setDate(now.toLocaleDateString("en-GH", { weekday: "short", day: "numeric", month: "short" }));
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  if (!time) return null;

  return (
    <div className="hidden lg:flex items-center gap-1.5 border border-black/5 rounded-full px-3 py-1.5 bg-white/75 shadow-sm">
      <Clock className="w-3.5 h-3.5 text-brand" />
      <span className="text-xs font-medium text-[#0F172A]">{time}</span>
      <span className="text-[#CBD5E1] text-xs">-</span>
      <span className="text-xs text-[#64748B]">{date}</span>
    </div>
  );
}

export default function Nav() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { count: savedCount } = useFavoritesContext();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const navLinks = [
    { href: "/browse", label: "Browse", icon: null },
    { href: "/launch", label: "Launch", icon: Megaphone },
    { href: "/demo", label: "Demo", icon: Sparkles },
    { href: "/landlord/dashboard", label: "Landlord", icon: LayoutDashboard },
    { href: "/messages", label: "Messages", icon: MessageCircle },
  ];

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/");

  return (
    <>
      <nav
        className={`sticky top-0 z-50 border-b transition-all duration-300 ${
          scrolled
            ? "bg-white/88 border-black/10 shadow-[0_12px_40px_rgba(16,26,24,0.10)] backdrop-blur-xl"
            : "bg-[#FFF8EA]/82 border-black/5 backdrop-blur-xl"
        }`}
      >
        <div className="rd-kente-strip h-1" />
        <div className="hidden lg:block border-b border-black/5 bg-[#101A18] text-white">
          <div className="max-w-7xl mx-auto px-4 h-9 flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-3.5 w-3.5 text-[#F2B84B]" />
              <span className="text-xs font-bold text-white/80">
                Ghana-first rental infrastructure: verified landlords, MoMo receipts, tenant reports, and Rent Act-aware listings.
              </span>
            </div>
            <div className="flex items-center gap-4 text-[11px] font-bold text-white/55">
              <span>Tenants browse free</span>
              <span>Landlords pay to publish</span>
              <span>Built for Accra to Tamale</span>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <LogoMark size={30} />
            <span className="text-brand font-black text-lg tracking-tight">
              Rent<span className="text-brand-dark">Direct</span>
            </span>
            <span className="hidden xl:inline-flex rounded-full bg-[#101A18] px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-[#F2B84B]">
              Ghana
            </span>
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-2 rounded-full bg-white/70 border border-black/5 p-1 shadow-sm">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`relative rounded-full px-4 py-2 text-sm font-bold transition-all ${
                  isActive(link.href) ? "bg-brand text-white shadow-md" : "text-[#64748B] hover:bg-[#FFF8EA] hover:text-[#101A18]"
                }`}
              >
                {link.label}
                {link.href === "/messages" && unreadMessages > 0 && (
                  <span className="absolute -top-1.5 -right-3 bg-red-500 text-white text-[9px] font-bold rounded-full w-3.5 h-3.5 flex items-center justify-center">
                    {unreadMessages}
                  </span>
                )}
              </Link>
            ))}
          </div>

          {/* Desktop right */}
          <div className="hidden md:flex items-center gap-3">
            <LiveClock />

            {/* Saved counter */}
            {savedCount > 0 && (
              <Link
                href="/browse?saved=1"
                className="relative flex items-center gap-1.5 text-sm font-medium text-[#64748B] hover:text-red-500 transition-colors px-2 py-1.5"
                title="Saved listings"
              >
                <Heart className="w-4 h-4" />
                <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                  {savedCount}
                </span>
              </Link>
            )}

            <Link
              href="/landlord/upload"
              className="flex items-center gap-1.5 rd-button-primary rounded-full px-5 py-2.5 text-sm font-black transition-all hover:-translate-y-0.5"
            >
              <PlusCircle className="w-4 h-4" />
              List a Room
            </Link>
            <Link
              href="/admin"
              className="flex items-center gap-1.5 rounded-full border border-black/10 bg-white px-4 py-2.5 text-sm font-black text-[#101A18] transition-all hover:border-brand hover:text-brand"
            >
              <UserCog className="w-4 h-4" />
              Ops
            </Link>
          </div>

          {/* Mobile right side */}
          <div className="flex md:hidden items-center gap-2">
            {savedCount > 0 && (
              <div className="relative">
                <Heart className="w-5 h-5 text-red-400" />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] font-bold rounded-full w-3.5 h-3.5 flex items-center justify-center">
                  {savedCount}
                </span>
              </div>
            )}
            <Link
              href="/landlord/upload"
              className="rd-button-primary rounded-full px-3 py-1.5 text-xs font-black"
            >
              List Room
            </Link>
            <button
              onClick={() => setMenuOpen(true)}
              className="p-2 rounded-lg hover:bg-gray-100 text-[#64748B]"
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile drawer */}
      {menuOpen && (
        <div className="fixed inset-0 z-60 flex">
          <div className="flex-1 bg-black/40" onClick={() => setMenuOpen(false)} />
          <div className="w-72 bg-white h-full shadow-xl flex flex-col">
            <div className="flex items-center justify-between px-4 py-4 border-b border-[#E2E8F0]">
              <div className="flex items-center gap-2">
                <LogoMark size={26} />
                <span className="text-brand font-bold text-base">RentDirect</span>
              </div>
              <button onClick={() => setMenuOpen(false)} className="p-2 rounded-lg hover:bg-gray-100 text-[#64748B]">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Mobile clock */}
            <div className="px-4 py-3 border-b border-[#E2E8F0] bg-surface">
              <MobileClockDisplay />
            </div>

            <div className="flex flex-col p-4 gap-1">
              {navLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className={`flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-colors ${
                      isActive(link.href)
                        ? "bg-brand-light text-brand"
                        : "text-[#64748B] hover:bg-gray-50"
                    }`}
                  >
                    {Icon && <Icon className="w-5 h-5" />}
                    <span className="flex-1">{link.label}</span>
                    {link.href === "/messages" && unreadMessages > 0 && (
                      <span className="bg-red-500 text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                        {unreadMessages}
                      </span>
                    )}
                  </Link>
                );
              })}

              {savedCount > 0 && (
                <Link
                  href="/browse?saved=1"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-colors"
                >
                  <Heart className="w-5 h-5" />
                  Saved ({savedCount})
                </Link>
              )}

              <Link
                href="/landlord/upload"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium bg-brand text-white mt-2"
              >
                <PlusCircle className="w-5 h-5" />
                List a Room
              </Link>
              <Link
                href="/admin"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium border border-black/10 text-[#0F172A] mt-1"
              >
                <UserCog className="w-5 h-5" />
                Admin Ops
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function MobileClockDisplay() {
  const [time, setTime] = useState<string | null>(null);
  const [date, setDate] = useState<string | null>(null);

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString("en-GH", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: true }));
      setDate(now.toLocaleDateString("en-GH", { weekday: "long", day: "numeric", month: "long", year: "numeric" }));
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  if (!time) return null;

  return (
    <div className="flex items-center gap-2">
      <Clock className="w-4 h-4 text-brand shrink-0" />
      <div>
        <p className="text-sm font-bold text-[#0F172A]">{time}</p>
        <p className="text-xs text-[#64748B]">{date}</p>
      </div>
    </div>
  );
}
