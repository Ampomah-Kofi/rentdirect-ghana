import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

const TERMS = [
  {
    title: "Prototype status",
    body: "RentDirect is currently an MVP/prototype. Listings, reports and payments in this version are for demonstration unless connected to a real backend and payment provider.",
  },
  {
    title: "No agent relationship",
    body: "RentDirect is designed to connect tenants and landlords directly. The platform does not act as a rental agent, property manager or legal representative in this prototype.",
  },
  {
    title: "Landlord responsibility",
    body: "Landlords are responsible for listing accurate prices, correct locations, lawful advance rent demands and real availability. False listings should be rejected or removed.",
  },
  {
    title: "Tenant responsibility",
    body: "Tenants should inspect properties, confirm ownership, use written agreements and obtain receipts before making payments.",
  },
  {
    title: "Payments",
    body: "Listing activation payments are currently simulated. Production payments must be processed through an approved payment provider with verifiable transaction references.",
  },
  {
    title: "Reports and moderation",
    body: "Tenant reports help identify fraud, illegal rent demands and incorrect listings. Admins should review reports promptly and take action where needed.",
  },
];

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-surface">
      <Nav />

      <section className="bg-[#101A18] px-4 py-20 text-white rd-grain">
        <div className="mx-auto max-w-4xl">
          <p className="mb-4 text-xs font-black uppercase tracking-[0.22em] text-[#F2B84B]">Terms of Use</p>
          <h1 className="text-5xl font-black leading-tight">Clear rules build trust.</h1>
          <p className="mt-5 max-w-2xl text-sm leading-relaxed text-white/65">
            These are prototype terms for RentDirect. They should be reviewed by qualified counsel before public launch.
          </p>
        </div>
      </section>

      <main className="mx-auto max-w-4xl px-4 py-14">
        <div className="space-y-4">
          {TERMS.map((term) => (
            <section key={term.title} className="rd-card rounded-[1.5rem] p-6">
              <h2 className="text-xl font-black text-[#0F172A]">{term.title}</h2>
              <p className="mt-3 text-sm leading-relaxed text-[#64748B]">{term.body}</p>
            </section>
          ))}
        </div>

        <div className="mt-8 rounded-[1.5rem] bg-[#101A18] p-6 text-white rd-grain">
          <h2 className="text-2xl font-black">Next legal step</h2>
          <p className="mt-2 text-sm leading-relaxed text-white/62">
            Before launch, convert this page into full production terms covering account rules, payments, refunds, dispute handling, privacy, moderation and liability.
          </p>
          <Link href="/launch" className="mt-5 inline-flex items-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-black text-[#101A18] hover:bg-[#F2B84B]">
            View Launch Plan <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
