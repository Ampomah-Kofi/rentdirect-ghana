import Link from "next/link";
import { LogoMark } from "@/components/Logo";

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-[#101A18] text-[#F6F1E5] rd-grain">
      <div className="rd-kente-strip h-1.5" />
      <div className="absolute -right-20 -top-24 w-72 h-72 rounded-full bg-brand/30 blur-3xl" />
      <div className="absolute -left-24 bottom-0 w-80 h-80 rounded-full bg-[#F2B84B]/15 blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <LogoMark size={30} />
              <span className="text-white font-black text-xl">RentDirect</span>
            </div>
            <p className="text-sm leading-relaxed text-white/62">
              Ghana rooms from verified landlords. No agents, no 10% commission, no confusing middlemen.
            </p>
            <p className="text-xs text-[#F2B84B] mt-4 font-bold">Built for renters and landlords back home.</p>
          </div>

          <div>
            <h3 className="text-white font-black text-sm mb-3">Platform</h3>
            <ul className="space-y-2">
              {[
                { href: "/browse", label: "Browse Rooms" },
                { href: "/landlord/upload", label: "List a Room" },
                { href: "/landlord/dashboard", label: "Landlord Dashboard" },
                { href: "/messages", label: "Messages" },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm text-white/55 hover:text-[#F2B84B] transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-white font-black text-sm mb-3">Tenant Rights</h3>
            <ul className="space-y-2 text-sm text-white/55">
              <li>Max 6 months advance rent</li>
              <li>Always request a receipt</li>
              <li>Use a written tenancy agreement</li>
              <li>
                Rent Control: <a href="tel:0302680802" className="text-[#F2B84B] hover:underline">0302-680802</a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-black text-sm mb-3">Revenue Model</h3>
            <ul className="space-y-2 text-sm text-white/55">
              <li>Tenants browse free</li>
              <li>Landlords pay to publish</li>
              <li>Featured listings get priority</li>
              <li>Verification builds trust</li>
            </ul>
          </div>
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
