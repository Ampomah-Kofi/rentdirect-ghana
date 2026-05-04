import Link from "next/link";
import { LogoMark } from "@/components/Logo";

export default function Footer() {
  const columns = [
    {
      title: "Product",
      links: [
        { href: "/browse", label: "Browse Rooms" },
        { href: "/compare", label: "Compare Listings" },
        { href: "/messages", label: "Messages" },
        { href: "/launch", label: "Launch Plan" },
        { href: "/demo", label: "Prototype Tour" },
      ],
    },
    {
      title: "Landlords",
      links: [
        { href: "/landlord/upload", label: "List a Room" },
        { href: "/landlord/dashboard", label: "Dashboard" },
        { href: "/#pricing", label: "Pricing" },
        { href: "/admin", label: "Admin Review" },
      ],
    },
    {
      title: "Trust",
      links: [
        { href: "/safety", label: "Safety Center" },
        { href: "/demo#reports", label: "Report Flow" },
        { href: "/demo#payments", label: "MoMo Receipts" },
        { href: "/demo#testing", label: "Testing Checklist" },
      ],
    },
    {
      title: "Company",
      links: [
        { href: "/launch", label: "Launch Plan" },
        { href: "/privacy", label: "Privacy" },
        { href: "/terms", label: "Terms" },
        { href: "/admin", label: "Operations" },
      ],
    },
  ];

  return (
    <footer className="relative overflow-hidden bg-[#101A18] text-[#F6F1E5] rd-grain">
      <div className="rd-kente-strip h-1.5" />
      <div className="absolute -right-20 -top-24 w-72 h-72 rounded-full bg-brand/30 blur-3xl" />
      <div className="absolute -left-24 bottom-0 w-80 h-80 rounded-full bg-[#F2B84B]/15 blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 py-14">
        <div className="mb-10 grid gap-4 md:grid-cols-4">
          {[
            { value: "0%", label: "tenant commission" },
            { value: "GHS 50", label: "standard listing" },
            { value: "16", label: "Ghana regions" },
            { value: "24h", label: "report review goal" },
          ].map((item) => (
            <div key={item.label} className="rounded-[1.35rem] border border-white/10 bg-white/5 px-5 py-4">
              <p className="text-2xl font-black text-[#F2B84B]">{item.value}</p>
              <p className="mt-1 text-xs font-bold uppercase tracking-[0.16em] text-white/45">{item.label}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-6 gap-8">
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <LogoMark size={30} />
              <span className="text-white font-black text-xl">RentDirect</span>
            </div>
            <p className="max-w-md text-sm leading-relaxed text-white/62">
              RentDirect is the Ghana-first rental marketplace for verified direct landlord listings, transparent fees, Mobile Money receipts, and tenant protection workflows.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link href="/browse" className="rounded-full bg-white px-5 py-2.5 text-sm font-black text-[#101A18] hover:bg-[#F2B84B]">
                Find a Room
              </Link>
              <Link href="/landlord/upload" className="rounded-full border border-white/20 px-5 py-2.5 text-sm font-black text-white hover:bg-white/10">
                List Property
              </Link>
            </div>
          </div>

          {columns.map((column) => (
            <div key={column.title}>
              <h3 className="text-white font-black text-sm mb-3">{column.title}</h3>
              <ul className="space-y-2">
                {column.links.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="text-sm text-white/55 hover:text-[#F2B84B] transition-colors">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-white/10 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-white/38">(c) 2026 RentDirect - Ghana direct rental marketplace.</p>
          <div className="flex items-center gap-3 text-xs text-white/38">
            <span>Rent Act aware</span>
            <span>-</span>
            <span>Data protection first</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
