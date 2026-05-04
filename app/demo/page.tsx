import Link from "next/link";
import { ArrowRight, CheckCircle2, ClipboardCheck, CreditCard, Flag, MousePointerClick, ShieldCheck, UserCog } from "lucide-react";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

const DEMO_STEPS = [
  {
    id: "tenant-search",
    title: "Tenant search",
    path: "/browse",
    goal: "Search rooms, filter by region, save a listing, and open details.",
    clicks: ["Click Browse", "Search East Legon or Kumasi", "Open a listing", "Click Save"],
  },
  {
    id: "tenant-safety",
    title: "Tenant safety",
    path: "/listings/listing-001",
    goal: "Review verification, Rent Act advance warning, contact guidance, and report tools.",
    clicks: ["Open listing details", "Read Trust checklist", "Click Show Contact", "Open Report Listing"],
  },
  {
    id: "landlord-upload",
    title: "Landlord upload",
    path: "/landlord/upload",
    goal: "Create a pending listing with Ghana Card, phone, photos, price, and selected plan.",
    clicks: ["Choose room type", "Enter title and price", "Add Ghana Card format GHA-123456789-0", "Submit for Review"],
  },
  {
    id: "admin-review",
    title: "Admin review",
    path: "/admin",
    goal: "Approve or reject pending listings and review reports/payments.",
    clicks: ["Open Admin", "Expand pending listing", "Approve + Pay", "Check Payments and Reports tabs"],
  },
  {
    id: "payments",
    title: "MoMo activation",
    path: "/landlord/dashboard",
    goal: "Pay to activate an approved listing, generate a receipt, and make the listing live.",
    clicks: ["Open Landlord dashboard", "Click Pay to Go Live", "Choose MTN Mobile Money", "Enter 0244123456"],
  },
  {
    id: "testing",
    title: "Automated checks",
    path: "/demo#testing",
    goal: "Run the no-dependency tests and TypeScript check from the terminal.",
    clicks: ["Run npm run test", "Run npm run typecheck", "Confirm all checks pass"],
  },
];

const SAMPLE_DATA = [
  { label: "Phone", value: "0244123456" },
  { label: "Ghana Card", value: "GHA-123456789-0" },
  { label: "Room title", value: "Self-contained room near UPSA" },
  { label: "Rent", value: "1200" },
  { label: "MoMo number", value: "244123456" },
];

export default function DemoPage() {
  return (
    <div className="min-h-screen bg-surface">
      <Nav />

      <section className="relative overflow-hidden bg-[#101A18] px-4 py-20 text-white rd-grain">
        <div className="absolute -right-20 top-0 h-80 w-80 rounded-full bg-brand/25 blur-3xl" />
        <div className="absolute -left-20 bottom-0 h-72 w-72 rounded-full bg-[#F2B84B]/15 blur-3xl" />
        <div className="relative mx-auto max-w-6xl">
          <div className="max-w-3xl">
            <p className="mb-4 inline-flex rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-[#F2B84B]">
              Prototype command center
            </p>
            <h1 className="text-5xl font-black leading-[0.98] tracking-tight sm:text-7xl">
              Click the whole company into shape.
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-white/65 sm:text-lg">
              Use this page as the live demo script. It tells you where to go, what to enter, and what success should look like as we build RentDirect into a serious Ghana rental platform.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/browse" className="inline-flex items-center gap-2 rounded-2xl bg-white px-6 py-3.5 text-sm font-black text-[#101A18] hover:bg-[#F2B84B]">
                Start as Tenant <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/landlord/upload" className="inline-flex items-center gap-2 rounded-2xl border border-white/20 px-6 py-3.5 text-sm font-black text-white hover:bg-white/10">
                Start as Landlord
              </Link>
            </div>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-6xl px-4 py-14">
        <section className="mb-10 grid gap-4 md:grid-cols-4">
          {[
            { icon: MousePointerClick, title: "Clickable", body: "Every core route is linked from here." },
            { icon: ClipboardCheck, title: "Scripted", body: "Know exactly what data to enter." },
            { icon: ShieldCheck, title: "Trust-led", body: "Verify tenant safety and reports." },
            { icon: CreditCard, title: "Revenue-ready", body: "Test listing fees and receipts." },
          ].map(({ icon: Icon, title, body }) => (
            <div key={title} className="rd-card rounded-[1.5rem] p-5">
              <Icon className="mb-4 h-6 w-6 text-brand" />
              <p className="text-sm font-black text-[#0F172A]">{title}</p>
              <p className="mt-1 text-xs leading-relaxed text-[#64748B]">{body}</p>
            </div>
          ))}
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-4">
            {DEMO_STEPS.map((step, index) => (
              <div key={step.id} id={step.id} className="rd-card rounded-[1.6rem] p-5">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.18em] text-brand">Step {index + 1}</p>
                    <h2 className="mt-1 text-xl font-black text-[#0F172A]">{step.title}</h2>
                    <p className="mt-2 text-sm leading-relaxed text-[#64748B]">{step.goal}</p>
                  </div>
                  <Link href={step.path} className="inline-flex shrink-0 items-center justify-center gap-2 rounded-2xl bg-brand px-5 py-3 text-sm font-black text-white hover:bg-brand-hover">
                    Open Flow <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
                <div className="mt-5 grid gap-2 sm:grid-cols-2">
                  {step.clicks.map((click) => (
                    <div key={click} className="flex items-center gap-2 rounded-xl border border-black/10 bg-white px-3 py-2">
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-brand" />
                      <span className="text-xs font-semibold text-[#64748B]">{click}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <aside className="space-y-4">
            <div className="rd-card sticky top-24 rounded-[1.6rem] p-5">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-brand">Data to type</p>
              <h2 className="mt-1 text-xl font-black text-[#0F172A]">Use these demo values</h2>
              <div className="mt-4 space-y-2">
                {SAMPLE_DATA.map((item) => (
                  <div key={item.label} className="rounded-xl border border-black/10 bg-white px-4 py-3">
                    <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#94A3B8]">{item.label}</p>
                    <p className="mt-1 font-mono text-sm font-black text-[#0F172A]">{item.value}</p>
                  </div>
                ))}
              </div>
              <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3">
                <p className="flex items-center gap-2 text-xs font-black text-amber-900">
                  <Flag className="h-4 w-4" />
                  Prototype rule
                </p>
                <p className="mt-1 text-xs leading-relaxed text-amber-800">
                  If you cannot explain a screen to a landlord or tenant in 10 seconds, we simplify it.
                </p>
              </div>
            </div>
          </aside>
        </section>

        <section id="testing" className="mt-10 rounded-[1.6rem] bg-[#101A18] p-6 text-white">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-[#F2B84B]">Codex testing</p>
              <h2 className="mt-1 text-2xl font-black">Run these after every serious change</h2>
              <p className="mt-2 text-sm text-white/60">You do not need browser automation yet. These checks protect pricing, reports, payments, and listing lifecycle logic.</p>
            </div>
            <div className="grid gap-2 text-sm font-mono">
              <code className="rounded-xl bg-white/10 px-4 py-3">& npm.cmd run test</code>
              <code className="rounded-xl bg-white/10 px-4 py-3">& npm.cmd run typecheck</code>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
