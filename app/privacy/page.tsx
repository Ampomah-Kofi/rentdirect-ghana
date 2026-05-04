import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

const SECTIONS = [
  {
    title: "What we collect in this prototype",
    body: "Demo listings may include landlord name, phone number, Ghana Card format, profile photo preview, room details, reports, messages and payment receipt records. In the current prototype, these are stored in your browser local storage.",
  },
  {
    title: "What changes before production",
    body: "Before public launch, RentDirect needs a real database, authentication, secure file storage, role-based admin access, payment provider webhooks and formal data retention controls.",
  },
  {
    title: "Sensitive landlord data",
    body: "Ghana Card numbers and landlord verification photos should only be visible to authorised admin reviewers. They should not be shown publicly to tenants.",
  },
  {
    title: "Tenant safety reports",
    body: "Reports should be used to investigate suspicious listings, illegal advance demands, incorrect pricing or rooms that are already rented. False reports may be restricted in production.",
  },
  {
    title: "Payments",
    body: "The current MoMo payment flow is simulated. Real production payments should use a licensed payment processor and store only the minimum transaction data needed for receipts and reconciliation.",
  },
];

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-surface">
      <Nav />

      <section className="bg-[#101A18] px-4 py-20 text-white rd-grain">
        <div className="mx-auto max-w-4xl">
          <p className="mb-4 text-xs font-black uppercase tracking-[0.22em] text-[#F2B84B]">Privacy Notice</p>
          <h1 className="text-5xl font-black leading-tight">Data protection must be designed in early.</h1>
          <p className="mt-5 max-w-2xl text-sm leading-relaxed text-white/65">
            This page is a prototype privacy notice. It explains how RentDirect should think about user data before moving from demo to production.
          </p>
        </div>
      </section>

      <main className="mx-auto max-w-4xl px-4 py-14">
        <div className="space-y-4">
          {SECTIONS.map((section) => (
            <section key={section.title} className="rd-card rounded-[1.5rem] p-6">
              <h2 className="text-xl font-black text-[#0F172A]">{section.title}</h2>
              <p className="mt-3 text-sm leading-relaxed text-[#64748B]">{section.body}</p>
            </section>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
