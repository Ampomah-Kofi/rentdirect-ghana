"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2, MapPin, Megaphone, Plane, ShieldCheck, Users } from "lucide-react";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

const STORAGE_KEY = "rentdirect_launch_interest";

const PILOT_CITIES = [
  {
    city: "Accra",
    region: "Greater Accra",
    focus: "Students, young professionals, diaspora-supported families",
    target: "100 verified rooms",
  },
  {
    city: "Kumasi",
    region: "Ashanti",
    focus: "Compound rooms, self-contained units, university-area rentals",
    target: "75 verified rooms",
  },
  {
    city: "Takoradi",
    region: "Western",
    focus: "Workers, families, coastal rental supply",
    target: "50 verified rooms",
  },
];

const LAUNCH_STEPS = [
  {
    title: "Seed supply",
    body: "Recruit trusted landlords first, verify identity, and publish enough rooms to make browsing useful.",
    icon: Users,
  },
  {
    title: "Build trust",
    body: "Show Ghana Card review, Rent Act guidance, report tools, direct contact and receipt references everywhere.",
    icon: ShieldCheck,
  },
  {
    title: "Create demand",
    body: "Use TikTok, WhatsApp groups, campus reps and diaspora family networks to bring tenants into city pages.",
    icon: Megaphone,
  },
  {
    title: "Monetize carefully",
    body: "Keep tenants free. Convert serious landlords to GHS 50 standard and GHS 100 featured after demand is visible.",
    icon: Plane,
  },
];

type Interest = {
  name: string;
  phone: string;
  role: string;
  city: string;
};

export default function LaunchPage() {
  const [form, setForm] = useState<Interest>({ name: "", phone: "", role: "Landlord", city: "Accra" });
  const [saved, setSaved] = useState<Interest[]>([]);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setSaved(JSON.parse(raw) as Interest[]);
    } catch {
      setSaved([]);
    }
  }, []);

  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!form.name.trim() || !form.phone.trim()) return;
    const next = [{ ...form, name: form.name.trim(), phone: form.phone.trim() }, ...saved].slice(0, 25);
    setSaved(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    setSubmitted(true);
    setForm({ name: "", phone: "", role: form.role, city: form.city });
  };

  return (
    <div className="min-h-screen bg-surface">
      <Nav />

      <section className="relative overflow-hidden bg-[#101A18] px-4 py-20 text-white rd-grain">
        <div className="absolute -right-20 top-0 h-96 w-96 rounded-full bg-brand/25 blur-3xl" />
        <div className="absolute -left-20 bottom-0 h-80 w-80 rounded-full bg-[#F2B84B]/15 blur-3xl" />
        <div className="relative mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <p className="mb-4 inline-flex rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-[#F2B84B]">
              Ghana launch plan
            </p>
            <h1 className="text-5xl font-black leading-[0.98] tracking-tight sm:text-7xl">
              Win city by city. Trust first.
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-white/65 sm:text-lg">
              RentDirect should not launch everywhere at once. We build density in a few Ghana cities, prove tenant demand, then expand with landlords, diaspora helpers and local operators.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/demo/autopilot" className="inline-flex items-center gap-2 rounded-2xl bg-white px-6 py-3.5 text-sm font-black text-[#101A18] hover:bg-[#F2B84B]">
                Watch Product Flow <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/landlord/upload" className="inline-flex items-center gap-2 rounded-2xl border border-white/20 px-6 py-3.5 text-sm font-black text-white hover:bg-white/10">
                Seed a Listing
              </Link>
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/8 p-5 backdrop-blur">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[#F2B84B]">Pilot scorecard</p>
            <div className="mt-4 grid grid-cols-2 gap-3">
              {[
                { value: "225", label: "target rooms" },
                { value: "3", label: "pilot cities" },
                { value: "0%", label: "tenant fees" },
                { value: "2", label: "paid plans" },
              ].map((item) => (
                <div key={item.label} className="rounded-2xl border border-white/10 bg-black/15 px-4 py-4">
                  <p className="text-3xl font-black text-[#F2B84B]">{item.value}</p>
                  <p className="mt-1 text-[10px] font-black uppercase tracking-[0.16em] text-white/45">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-6xl px-4 py-14">
        <section className="grid gap-4 md:grid-cols-3">
          {PILOT_CITIES.map((city) => (
            <div key={city.city} className="rd-card rounded-[1.6rem] p-6">
              <div className="flex items-center gap-2 text-brand">
                <MapPin className="h-4 w-4" />
                <p className="text-xs font-black uppercase tracking-[0.18em]">{city.region}</p>
              </div>
              <h2 className="mt-3 text-2xl font-black text-[#0F172A]">{city.city}</h2>
              <p className="mt-2 text-sm leading-relaxed text-[#64748B]">{city.focus}</p>
              <p className="mt-5 rounded-2xl bg-brand-light px-4 py-3 text-sm font-black text-brand">{city.target}</p>
            </div>
          ))}
        </section>

        <section className="mt-14 grid gap-8 lg:grid-cols-[1fr_0.85fr]">
          <div>
            <p className="text-[11px] font-black text-brand uppercase tracking-[0.22em] mb-3">Launch Motion</p>
            <h2 className="text-3xl font-black text-[#0F172A] sm:text-4xl">The first 90 days should feel focused.</h2>
            <div className="mt-6 grid gap-3">
              {LAUNCH_STEPS.map(({ icon: Icon, title, body }, index) => (
                <div key={title} className="rd-card rounded-[1.35rem] p-5">
                  <div className="flex gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-brand text-white">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-xs font-black text-brand">Phase {index + 1}</p>
                      <h3 className="mt-1 text-base font-black text-[#0F172A]">{title}</h3>
                      <p className="mt-1 text-sm leading-relaxed text-[#64748B]">{body}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rd-card rounded-[1.6rem] p-6">
            <p className="text-[11px] font-black text-brand uppercase tracking-[0.22em]">Join the pilot</p>
            <h2 className="mt-2 text-2xl font-black text-[#0F172A]">Capture early interest</h2>
            <p className="mt-2 text-sm leading-relaxed text-[#64748B]">
              This is a prototype form for now. It stores demo interest in your browser so we can test the conversion flow before adding a real backend.
            </p>

            <form onSubmit={submit} className="mt-5 space-y-3">
              <input
                value={form.name}
                onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
                placeholder="Name"
                className="w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-sm outline-none focus:border-brand"
              />
              <input
                value={form.phone}
                onChange={(event) => setForm((current) => ({ ...current, phone: event.target.value }))}
                placeholder="Phone or WhatsApp"
                className="w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-sm outline-none focus:border-brand"
              />
              <div className="grid grid-cols-2 gap-3">
                <select
                  value={form.role}
                  onChange={(event) => setForm((current) => ({ ...current, role: event.target.value }))}
                  className="rounded-xl border border-black/10 bg-white px-4 py-3 text-sm outline-none focus:border-brand"
                >
                  {["Landlord", "Tenant", "Diaspora helper", "Operator"].map((role) => (
                    <option key={role}>{role}</option>
                  ))}
                </select>
                <select
                  value={form.city}
                  onChange={(event) => setForm((current) => ({ ...current, city: event.target.value }))}
                  className="rounded-xl border border-black/10 bg-white px-4 py-3 text-sm outline-none focus:border-brand"
                >
                  {PILOT_CITIES.map((city) => (
                    <option key={city.city}>{city.city}</option>
                  ))}
                </select>
              </div>
              <button className="w-full rounded-2xl bg-brand px-5 py-3.5 text-sm font-black text-white hover:bg-brand-hover">
                Join Pilot List
              </button>
            </form>

            {submitted && (
              <div className="mt-4 flex items-start gap-3 rounded-2xl border border-green-200 bg-green-50 px-4 py-3">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-600" />
                <p className="text-sm font-semibold text-green-800">Saved locally. This is ready to connect to a real database later.</p>
              </div>
            )}

            {saved.length > 0 && (
              <div className="mt-5">
                <p className="text-xs font-black uppercase tracking-[0.16em] text-[#94A3B8]">Recent local interest</p>
                <div className="mt-2 space-y-2">
                  {saved.slice(0, 3).map((item) => (
                    <div key={`${item.name}-${item.phone}`} className="rounded-xl border border-black/10 bg-white px-3 py-2">
                      <p className="text-sm font-black text-[#0F172A]">{item.name}</p>
                      <p className="text-xs text-[#64748B]">{item.role} - {item.city}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
