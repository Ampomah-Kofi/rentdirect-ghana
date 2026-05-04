import Link from "next/link";
import { AlertTriangle, ArrowRight, CheckCircle2, FileText, Phone, ShieldCheck } from "lucide-react";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

const SAFETY_RULES = [
  "Visit the room before paying any money.",
  "Confirm the person showing the room is the owner or authorised caretaker.",
  "Do not pay inspection or reservation fees to unknown people.",
  "Ask for a written tenancy agreement before moving in.",
  "Always collect a receipt for any rent or deposit payment.",
  "Report listings demanding more than 6 months advance rent.",
];

const REPORT_TYPES = [
  "Agent posing as landlord",
  "Suspected scam or fraud",
  "Wrong price or wrong location",
  "Already rented out",
  "Demanding more than 6 months advance",
];

export default function SafetyPage() {
  return (
    <div className="min-h-screen bg-surface">
      <Nav />

      <section className="relative overflow-hidden bg-[#101A18] px-4 py-20 text-white rd-grain">
        <div className="absolute -right-24 top-0 h-96 w-96 rounded-full bg-brand/25 blur-3xl" />
        <div className="relative mx-auto max-w-5xl">
          <p className="mb-4 inline-flex rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-[#F2B84B]">
            Tenant safety center
          </p>
          <h1 className="max-w-3xl text-5xl font-black leading-[0.98] tracking-tight sm:text-7xl">
            Renting should not feel like gambling.
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-white/65 sm:text-lg">
            RentDirect is designed around direct landlord contact, identity review, Rent Act awareness and fast reporting. This page explains the safety rules we want every renter to follow.
          </p>
        </div>
      </section>

      <main className="mx-auto max-w-6xl px-4 py-14">
        <section className="grid gap-6 lg:grid-cols-[1fr_0.85fr]">
          <div className="rd-card rounded-[1.6rem] p-6">
            <div className="flex items-center gap-3">
              <ShieldCheck className="h-7 w-7 text-brand" />
              <h2 className="text-2xl font-black text-[#0F172A]">Before you pay</h2>
            </div>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {SAFETY_RULES.map((rule) => (
                <div key={rule} className="flex items-start gap-3 rounded-2xl border border-black/10 bg-white px-4 py-3">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
                  <p className="text-sm font-semibold leading-relaxed text-[#64748B]">{rule}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-[1.6rem] border border-amber-200 bg-amber-50 p-6">
              <AlertTriangle className="h-7 w-7 text-amber-700" />
              <h2 className="mt-4 text-xl font-black text-amber-950">Rent Act reminder</h2>
              <p className="mt-2 text-sm leading-relaxed text-amber-800">
                Ghana&apos;s Rent Act limits advance rent demands. RentDirect flags and lets tenants report listings that ask for more than 6 months advance.
              </p>
            </div>
            <div className="rd-card rounded-[1.6rem] p-6">
              <Phone className="h-7 w-7 text-brand" />
              <h2 className="mt-4 text-xl font-black text-[#0F172A]">Emergency judgement</h2>
              <p className="mt-2 text-sm leading-relaxed text-[#64748B]">
                If anything feels rushed, confusing or secretive, pause. Ask family, visit in daylight, and report the listing before sending money.
              </p>
            </div>
          </div>
        </section>

        <section className="mt-10 grid gap-6 lg:grid-cols-2">
          <div className="rd-card rounded-[1.6rem] p-6">
            <FileText className="h-7 w-7 text-brand" />
            <h2 className="mt-4 text-2xl font-black text-[#0F172A]">What tenants can report</h2>
            <div className="mt-5 space-y-2">
              {REPORT_TYPES.map((item) => (
                <div key={item} className="rounded-xl border border-black/10 bg-white px-4 py-3 text-sm font-bold text-[#64748B]">
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="relative overflow-hidden rounded-[1.6rem] bg-[#101A18] p-6 text-white rd-grain">
            <h2 className="text-2xl font-black">Watch the safety flow</h2>
            <p className="mt-3 text-sm leading-relaxed text-white/62">
              The autopilot demo creates a listing, activates it, and submits a tenant report so you can see how admin review works.
            </p>
            <Link href="/demo/autopilot" className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-black text-[#101A18] hover:bg-[#F2B84B]">
              Open Autopilot <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
